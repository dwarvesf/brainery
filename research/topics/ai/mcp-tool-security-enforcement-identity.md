---
draft: false
title: "Tool-level security for remote MCP servers, part 2: enforcement, identity and practice"
description: "How an MCP server enforces permissions and filters data, connects to existing identity systems, and rolls out access control in practice."
date: 2025-03-27
authors:
  - monotykamary
github_id: monotykamary
tags:
  - ai
  - mcp
  - security
slug: mcp-tool-security-enforcement-identity
announce: false
series: mcp-tool-security
series_part: 2
series_total: 2
---

Part 1 designed the role-based model and the tool registry. This part puts it to work: enforcing permissions inside the server, filtering data by access policy, connecting to existing identity systems, and rolling the controls out in practice. It closes with the security practices that keep the system sound.

> Part 2 of 2 in the MCP tool security series. Previous: [Tool-level security for remote MCP servers, part 1: designing role-based access control](tool-level-security-for-remote-mcp-servers.md)

## Permission enforcement in server implementation

The most critical aspect of our RBAC implementation lies in the server-side enforcement of permissions. We need to modify the standard MCP server implementation to integrate permission checks at two key points: when listing available tools and when executing tool requests.

When handling a ListTools request, the server needs to filter the available tools based on the user's permissions. This ensures that users only see tools they're authorized to access. This filtering happens transparently to the client, creating a seamless experience where unauthorized tools simply don't exist from the user's perspective.

```javascript
// Permission enforcement during tool listing
server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  // Extract user identity from the validated token
  const userId = request.transport.session.userId;

  // Determine user's permissions based on their roles
  const userRoles = await getUserRoles(userId);
  const userPermissions = await getAllPermissionsForRoles(userRoles);

  // Filter tools based on user permissions
  const authorizedTools = Object.values(toolRegistry)
    .filter((toolEntry) => {
      // User must have ALL required permissions for this tool
      return toolEntry.requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
    })
    .map((toolEntry) => toolEntry.tool);

  return { tools: authorizedTools };
});
```

When handling a CallTool request, the server performs an additional permission check even if the tool was previously exposed in the listing. This defense-in-depth approach prevents unauthorized access even if a client attempts to directly call tools they shouldn't access. Beyond the basic permission check, the system also applies data access policies that filter both the arguments provided to the tool and the results returned to the user.

```javascript
// Permission enforcement during tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const toolEntry = toolRegistry[toolName];

  if (!toolEntry) {
    return createErrorResponse(`Tool not found: ${toolName}`);
  }

  // Get user identity and permissions
  const userId = request.transport.session.userId;
  const userRoles = await getUserRoles(userId);
  const userPermissions = await getAllPermissionsForRoles(userRoles);

  // Verify permissions for the requested tool
  const hasPermission = toolEntry.requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );

  if (!hasPermission) {
    // Audit the access attempt
    await logSecurityEvent(userId, "unauthorized_tool_access", toolName);
    return createErrorResponse("Insufficient permissions");
  }

  // Apply data access policies to filter tool arguments
  const filteredArguments = await applyDataAccessPolicy(
    toolEntry.dataAccessPolicy,
    request.params.arguments,
    userId,
    userRoles,
  );

  // Execute the tool with filtered arguments
  const result = await executeTool(toolName, filteredArguments);

  // Apply data access policies to filter the results
  const filteredResult = await filterToolResults(
    result,
    toolEntry.dataAccessPolicy,
    userId,
    userRoles,
  );

  return {
    content: [{ type: "text", text: JSON.stringify(filteredResult) }],
  };
});
```

## Data filtering and access policies

The most sophisticated part of our RBAC implementation is the data filtering system that enforces fine-grained access control on the data processed by tools. This system applies filtering at two points: when processing tool arguments and when returning tool results.

For argument filtering, the system examines resource identifiers in the request to ensure the user has access to the referenced resources. For example, if a user attempts to post a message to a Slack channel they don't have access to, the system will reject the request before it reaches the underlying Slack client.

```javascript
// Filter tool arguments based on data access policies
async function applyDataAccessPolicy(policy, args, userId, userRoles) {
  if (!policy) return args;

  // Create a copy of arguments to avoid modifying the original
  const filteredArgs = { ...args };

  // Check Slack channel access if relevant
  if (
    policy.channelVisibility === "authorized_only" &&
    filteredArgs.channel_id
  ) {
    const hasAccess = await checkChannelAccess(userId, filteredArgs.channel_id);
    if (!hasAccess) {
      throw new Error(`Access denied to channel: ${filteredArgs.channel_id}`);
    }
  }

  // Additional policy rules would be applied here based on tool type

  return filteredArgs;
}
```

For result filtering, the system applies similar checks but operates on the data returned from the tool. This filtering can be quite sophisticated, removing specific documents from knowledge search results or filtering columns and rows from analytics query results based on user permissions.

```javascript
// Filter knowledge base documents by access permissions
async function filterDocumentsByAccess(documents, userId, userRoles) {
  if (!documents || documents.length === 0) return documents;

  // Query accessible documents based on user roles
  const accessibleDocumentIds = await getAccessibleDocumentIds(userRoles);

  // Filter documents to include only those the user can access
  return documents.filter((doc) => accessibleDocumentIds.has(doc.id));
}

// Filter analytics results by column permissions
async function filterColumnsByAccess(results, userId, userRoles) {
  if (!results.columns || !results.rows) return results;

  // Determine which columns the user has permission to see
  const accessibleColumns = await getAccessibleColumns(
    results.dataset,
    userRoles,
  );

  // Create a filtered view of the results
  const columnIndexes = results.columns
    .map((col, index) => (accessibleColumns.has(col) ? index : -1))
    .filter((idx) => idx !== -1);

  return {
    columns: results.columns.filter((_, idx) => columnIndexes.includes(idx)),
    rows: results.rows.map((row) => columnIndexes.map((idx) => row[idx])),
  };
}
```

## Integrating with existing identity systems

Most organizations deploying MCP servers already have established identity systems, whether traditional Active Directory, cloud-based identity providers like Auth0 or Okta, or custom OAuth servers. Our RBAC implementation needs to integrate with these systems rather than creating a completely independent security infrastructure.

The core integration approach involves using the existing identity system for authentication while maintaining an MCP-specific permission model for authorization. When a user connects to the MCP server, the OAuth flow confirms their identity using the established identity provider. Once authenticated, the server maps the external identity to internal roles and permissions that control MCP tool access.

This mapping can occur through various mechanisms, depending on the identity provider's capabilities. For providers that support scopes or custom claims in tokens, we can extract role information directly from the authentication token. For simpler providers, we may need to maintain a mapping table that associates external user identities with our internal role assignments.

```javascript
// Extract roles from an external identity token
async function getRolesFromExternalToken(token) {
  try {
    // Decode and verify the token
    const decodedToken = await verifyToken(token);

    // Extract roles from token claims
    // This varies by identity provider - some use custom claims
    if (decodedToken.roles) {
      return decodedToken.roles;
    }

    if (decodedToken.scope) {
      // Parse space-separated scopes
      const scopes = decodedToken.scope.split(" ");
      return scopes
        .filter((s) => s.startsWith("role:"))
        .map((s) => s.substring(5));
    }

    // If no roles in token, fall back to database mapping
    return await getRolesFromDatabase(decodedToken.sub);
  } catch (error) {
    console.error("Error extracting roles from token:", error);
    return [];
  }
}
```

This federated approach allows organizations to maintain a single source of truth for identity while still implementing fine-grained control over MCP tool access. Changes to user responsibilities in the primary identity system can automatically flow through to MCP access permissions, ensuring consistency across the organization's security infrastructure.

## Practical implementation strategies

Implementing RBAC for MCP involves more than just coding the technical components. Successful deployments require careful planning and strategy to ensure the security model aligns with organizational needs while remaining maintainable over time.

### Start with a comprehensive inventory

The first step in implementing RBAC is creating a comprehensive inventory of tools, data resources, and access patterns. This inventory should identify the sensitivity level of each tool and the data it accesses, providing the foundation for designing appropriate permission boundaries. Engage with stakeholders across the organization to understand who needs access to which capabilities and under what circumstances.

For each MCP tool, document its purpose, the data it accesses or modifies, and the operational risk associated with its use. Group tools with similar risk profiles and access patterns to begin defining your permission model. This inventory becomes the reference for designing your role structure and permission assignments.

### Design role hierarchies with inheritance

Rather than creating a flat list of roles, design hierarchical role structures that leverage inheritance to simplify permission management. Create base roles that provide fundamental access needed by most users, then extend these with specialized roles that grant additional permissions for specific functions.

For example, a "StandardUser" role might provide access to basic knowledge search capabilities, while a "DataAnalyst" role inherits those permissions and adds access to analytics tools. This approach reduces redundancy in permission assignments and makes it easier to maintain consistency as your permission model evolves.

### Implement progressive access controls

Security should operate as a progressive series of checks that become more specific as operations proceed. The initial OAuth authentication confirms basic identity and authorization. The ListTools handler filters available tools based on user roles. The CallTool handler verifies specific permissions for the requested tool. The data access policies apply fine-grained filtering to the specific data elements being accessed.

This progressive approach ensures that security failures occur as early as possible in the request lifecycle, improving both security and performance. It also creates multiple layers of defense, ensuring that a single vulnerability won't compromise your entire security model.

### Establish comprehensive audit trails

Robust security requires visibility into how your system is being accessed and used. Implement comprehensive audit logging that captures key security events like authentication attempts, permission checks, and sensitive data access. These logs should include sufficient context to understand who performed what action and whether it succeeded or failed.

```javascript
// Log a security event
async function logSecurityEvent(userId, eventType, details, success = true) {
  await db.query(
    `INSERT INTO security_events (user_id, event_type, details, success, timestamp)
     VALUES ($1, $2, $3, $4, NOW())`,
    [userId, eventType, JSON.stringify(details), success],
  );
}
```

These audit trails serve multiple purposes: they help detect security incidents, support compliance requirements, and provide data for refining your security model over time. Store security logs securely and develop processes for regular review and analysis.

## Security considerations and best practices

Implementing RBAC for MCP servers requires attention to several critical security considerations beyond the basic role and permission model.

### Defense in depth

While RBAC provides powerful access controls, it should be part of a comprehensive security strategy that includes multiple defensive layers. Ensure your MCP servers implement network security through firewalls and VPNs, transport security through proper TLS configuration, and operational security through monitoring and alerting.

Never rely on a single security mechanism to protect sensitive systems. Even with perfect RBAC implementation, additional controls like network isolation, request rate limiting, and anomaly detection remain essential to a robust security posture.

### Principle of least privilege

The principle of least privilege dictates that users should have only the minimum access needed to perform their responsibilities. When designing your permission model, start with minimal access and add specific permissions as needed rather than starting with broad access and attempting to restrict it.

Regularly review permission assignments to identify and remove unnecessary access rights. Implement time-bound permissions for temporary access needs rather than granting permanent permissions that must be manually revoked later.

### Regular security reviews

Security is not a one-time implementation but an ongoing process. Schedule regular reviews of your RBAC model to ensure it remains aligned with organizational needs and security best practices. These reviews should examine role definitions, permission assignments, and actual usage patterns.

Look for common issues like permission creep (accumulation of unnecessary permissions), orphaned permissions (access rights no longer used by any role), and role explosion (proliferation of overly specific roles that complicate management).

### Data minimization and field-level security

Beyond controlling which tools users can access, implement data minimization practices that limit the exposure of sensitive information. Apply field-level security to filter out sensitive data elements that users don't need to see, even if they have access to the related tool.

For example, a user might have permission to search the knowledge base, but certain document fields like "internal notes" might be hidden from their view. Similarly, analytics results might mask specific columns containing sensitive business metrics based on the user's role.

## Wrap-up

Implementing Role-Based Access Control for MCP servers creates a secure foundation for AI-to-tool communication in production environments. By controlling not just which users can connect to your MCP server but also which tools they can access and what data they can see, you establish precise security boundaries that protect sensitive resources while enabling powerful capabilities for authorized users.

The multi-layered approach described in this guide, combining authentication, permission-based tool filtering, and data access policies, provides comprehensive protection aligned with security best practices. By integrating with existing identity systems and implementing proper audit trails, you can maintain security while leveraging your organization's established infrastructure.

As MCP adoption continues to grow, robust security controls become increasingly essential to realizing its full potential in enterprise environments. By implementing these patterns early, you establish a foundation that can evolve with your organization's needs while maintaining appropriate security boundaries.

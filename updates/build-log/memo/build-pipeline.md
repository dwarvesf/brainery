---
title: The Memo build and content quality pipeline
description: "Understand the automated processes and tools that transform Markdown content into the published Memo website, ensuring content quality and consistency."
date: 2025-05-20
authors:
  - tieubao
tags:
  - memo
  - build-pipeline
  - workflow
  - linting
  - formatting
  - build-log
redirect:
  - /s/pfLxbw
---

The Memo platform uses a sophisticated pipeline to transform raw Markdown content into the final, published website. This process involves automated builds, data processing, and a suite of tools dedicated to ensuring content quality and consistency. This document outlines these key aspects.

## Automated build workflow

At its heart, the build system is triggered by pushes to the `dev` branch (as defined in `.github/workflows/dispatch.yml`) and orchestrates a sequence of scripts and commands to get content ready for the web application, onchain integrations, and other platform features.

### Key scripts and their functions

- **generate-summary.ts**: This script is run to generate summaries, likely as part of the SPR content compression and AI processing steps.
- **duckdb-export (Makefile command)**: This command initiates the core data processing. It uses the Elixir compiler (`lib/obsidian-compiler/export_duckdb.ex`) to compile Obsidian Markdown, handle image processing (like compression and WebP conversion), detect and replace image paths, and save all processed data to DuckDB.

## Core data processing

The core data processing pipeline handles the transformation of raw Markdown content into structured data for the platform.

### File selection and initial handling

The system identifies which files to process, either based on recent Git history for incremental updates or a specified pattern. Files within the vault directory are filtered using patterns defined in `.export-ignore`, and submodule changes are also handled.

### AI-powered content transformation

This step involves compressing content using SPR (Summary-Preserve-Refactor) and generating embeddings (both OpenAI and custom). Processing is optimized by only regenerating embeddings when content actually changes, leveraging Git history for tracking file relationships through renames (`previous_paths` field).

### Database operations

The `vault` table in DuckDB is set up, updating the schema as needed and removing obsolete columns. Each selected file is read, its frontmatter extracted and normalized, and if new or changed, AI processing is triggered. All extracted and processed data is stored in the DuckDB database. Finally, the data is exported to a Parquet file (`vault.parquet`), which is crucial for efficient data access by the web application and other parts of the system.

## Content quality assurance

Beyond the core data processing, a comprehensive set of tools ensures content consistency, quality, and adherence to our standards. These tools cover linting (validating Markdown and metadata) and formatting (standardizing text styling).

*Relevant source files include: `scripts/formatter/format-sentence-case.js`, `scripts/formatter/note-lint.js`, and various rule files within `scripts/formatter/rules/`.*

### Linting

#### Linting architecture and process

The Memo system features a modular note linting system designed to verify Markdown files against a configurable set of rules. The process generally involves recursively scanning target directories, dynamically loading rule modules (e.g., from `scripts/formatter/rules/`), applying each loaded rule, and reporting violations. It exits with an error code if issues are detected, making it suitable for CI integration.

#### Key linting rules

- **Frontmatter validation (`frontmatter.js`):** Validates the YAML frontmatter section, checking for proper delimiters, formatting, balanced quotes/brackets, absence of duplicate keys, and no forbidden characters.
- **Heading structure rules (`no-heading1.js`):** Enforces proper document structure by flagging any level 1 headings within the content. The document title should come from the frontmatter.
- **Link validation (`relative-link-exists.js`):** Verifies that all relative links point to existing resources within the repository, handling standard and image links, ignoring code blocks, and processing URI-encoded paths and anchors.

#### Extending with custom rules

The modular design allows for easy extension. To add a new rule, create a JavaScript file in `scripts/formatter/rules/` and implement a `check(file, content)` function that returns an array of violation messages.

```javascript
/**
 * Rule: Description of what the rule checks.
 * Returns an array of violation messages if any.
 */
function check(file, content) {
  const violations = [];
  // Rule implementation: analyze content, push to violations if needed
  return violations;
}

export { check };
```

### Formatting

#### AI-powered sentence case formatting

An AI tool (`format-sentence-case.js`) standardizes text formatting, particularly for titles and headings. It converts text to sentence case while intelligently preserving proper nouns and acronyms by extracting relevant text elements (frontmatter titles, headings, bold text, link text), using an OpenAI model to convert, and replacing the original text.

### Workflow integration

The linting and formatting tools are designed for flexibility, usable both manually and in automated workflows. They can be run from the command line on files or directories:

- **Running the note linter:**

    ```bash
    # Check all rules in the vault directory
    node scripts/formatter/note-lint.js vault/
    # Check specific rules
    node scripts/formatter/note-lint.js vault frontmatter,no-heading1
    ```

- **Running the sentence case formatter:**

    ```bash
    node scripts/formatter/format-sentence-case.js [optional-path-to-file-or-directory]
    ```

These tools are integral to the Memo content workflow: content is created/edited, linted, formatted, and then proceeds to the core processing pipeline before DuckDB export. These steps can be run manually, integrated into Git pre-commit hooks, or incorporated into CI/CD pipelines.

---

> Next: [Automate static site deployment](deployment.md)

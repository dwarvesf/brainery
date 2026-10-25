---
title: "Dwarves operations checklists, part 2: clients, money and projects"
description: "Operations checklists for client contracts, billing and invoices, and a project from initialization through communication, backups, handover, case study and archive."
kind: playbook
date: 2024-08-20
authors:
  - tieubao
  - huynguyenh
  - innnotruong
  - zlatanpham
  - huytieu
  - nikkingtr
  - minhcloud
tags:
  - checklist
  - operation
  - people
  - hiring
  - project
  - delivery
redirect:
  - /playbook/operations/checklists/vietnam-invoice-checklist
  - /2SRPhw
  - /playbook/operations/checklists/project-handover
  - /AHIv4w
  - /playbook/operations/checklists/project-communication
  - /J9QGYQ
  - /playbook/operations/checklists/artifact-checklist
  - /yRz86w
  - /playbook/operations/checklists/consulting-contract-checklist
  - /VHDvgg
  - /playbook/operations/checklists/billing-checklist
  - /AEQnmA
  - /playbook/operations/checklists/project-case-study
  - /yAkaUA
  - /playbook/operations/checklists/project-initialization
  - /6UOtFw
  - /playbook/operations/checklists/project-archive
  - /6uSI1g
slug: operations-checklists-clients-projects
announce: false
series: operations-checklists
series_part: 2
series_total: 2
type: playbook
topic: engineering-practice
---

The Dwarves Operations team keeps one checklist per recurring job. This part holds the client and project groups: reviewing a consulting contract, billing and Vietnamese tax invoices, and the project checklists from initialization to archive. The people checklists (hiring to company assets) are in part 1, which also has the table that says when to use each list. These lists are a snapshot from 2024, so some tools and numbers have changed.

> Part 2 of 2 in the operations checklists series. Previous: [Dwarves operations checklists, part 1: the people lifecycle](operations-checklists.md)

## Clients and money

### Consulting contract

The checklist presents the process of contract evaluation.

**Content**

- [ ] The contract must be numbered incrementally according to the total number of contracts in that year
- [ ] The contract must have paging
- [ ] The contract must have enough contractors information
- [ ] The payment term in the contract should be numbered and have a concise description
- [ ] The currency, country and applicable law (Clause 18) need to be updated accordingly
- [ ] The termination term in the contract should be reviewed carefully
- [ ] The features list or scope of work must be specified clearly (i.e. the design and requirement documents must have a version)

**Process**

- [ ] Contract is signed legally by parties/people having responsibility (i.e. [hellosign.com](http://hellosign.com/))
- [ ] Contract must be signed before initiating the project
- [ ] The final and signed contract is put in the Official folder on Drive
- [ ] The contract is stored on Drive including the final PDF and the final source file (i.e. Word/Google Docs/Pages)

### Billing and invoices

This checklist illustrates the process of billing approval.

**Person in charge (PIC).** The person in charge of an invoice is the person in charge of the Account. If the Account has no person in charge, another member of the Operation team takes it. Ideally, the second person in charge is the Salesperson of the project. For example, Nam is the second person in charge of the Attrace account, because she is the Salesperson of that project.

**Invoice statuses**

- Every month, Fortress automatically generates the invoices for open projects, based on the previous month. At this stage the invoice is saved as Draft.
- During the 25th to 27th of each month, the PIC sends the Off-days report to Special Clients and asks for their confirmation.
- The PIC checks the invoice content, including member time-off.
- After receiving feedback from clients and reviewing all invoice contents, the PIC sends the official invoice to the client. The status changes to Sent.
- When Han receives the money transferred from the client, he changes the invoice status to Paid.
- If the invoice has not been paid 7 days after the send date, its status changes to Overdue. The PIC sends a follow-up email for the invoice.
- If there are errors after the invoices have been sent to clients, we mark the invoice as Error. The PIC sends an email that explains why the invoice is incorrect, then makes a new invoice and resends it to the client.

**Compliance check: issue an invoice**

- [ ] Invoice shows the correct numbers of item price, total price
- [ ] Invoice has invoice date
- [ ] Invoice has due date (= invoice date + 7)
- [ ] Invoice has a clear description to explain the item we charge the client and any other important note to help them understand the invoice content
- [ ] Invoice has a note for important details (i.e. routing number, reference number, etc.)

**Compliance check: invoice status**

- [ ] Invoice status must be up-to-date with the reality
- [ ] Invoice status is updated by the Person In Charge

**Compliance check: sending**

- [ ] Invoice is sent by the designated Person In Charge
- [ ] Error invoice must be notified to the Clients and marked as error in Fortress as soon as possible
- [ ] The Person In Charge has to follow up an overdue invoice within 3 days
- [ ] After the payment is deposited in DF's account, an official confirmation is sent to the Clients
- [ ] Invoice must be sent before or right on the monthly invoice date or after completing a payment milestone.

### Vietnam invoice

The process of taking a Vietnam invoice.

**Invoice checklist**

- [ ] Invoice Date must increase with Invoice Number.
- [ ] Company Name, Tax Code, Address on Business Registration Form.
- [ ] Item must be identical to the contract.
- [ ] Include Contract number.
- [ ] VAT: use "/" in VAT fields.
- [ ] Sign on each sheet of the invoice, do not sign overlapping.
- [ ] Mark on each signature
- [ ] Mark new address
- [ ] Send invoice to customer

**For an error invoice**

- [ ] Revoke the error invoices
- [ ] Clamp 3 sheets of the invoice

## Projects

### Project initialization

The checklist shows the process of project initialization.

**Paperwork**

- [ ] NDA (depends on clients)
- [ ] Legally signed agreements (hellosign.com for the e-contract)
- [ ] All related papers such as agreements are put on Drive

**Process**

- [ ] Resources prepared and ready
- [ ] Got deposit after the agreements are signed (depends on the agreements)
- [ ] Communication channel setup
- [ ] Task and project management tool setup
- [ ] Project meeting scheduled
- [ ] Requirements are clear
- [ ] Project init and setup

### Project communication

The rules of communication in a project.

**Transparency**

- [ ] Email communication should follow [email communication and use](https://www.notion.so/3703ec7baf5d438fb817175044898c7b?pvs=21).
- [ ] Work related discussion which is common knowledge for the team must be discussed in the public/shared channel
- [ ] In case a work related discussion which is common knowledge for the team is unintentionally chatted privately, the person should update the related people or the rest of the team

**Professionalism**

- [ ] The message sent out should be professional and polite in any case
- [ ] Avoid NSFW chat in work related discussion
- [ ] Be responsive to the discussion
- [ ] Avoid ignoring people. There should be at least a signal for getting back later
- [ ] Loop the related people if the discussion needs them
- [ ] No swearing
- [ ] Do not babble in a discussion in which you do not have any responsibility.

### Back up artifacts

To make sure the project's progress stays aligned with the team plan, the team collects artifacts every 3 months and saves them as a record of what was done.

**Why we need artifacts**

- Track the project's progress against the plan, which makes it easier to manage and control
- Future team members can learn from past projects, understanding the decisions made, the problems faced, and how they were solved
- Smooth the handover and onboarding process, keep a track record, and trace back if needed

**Artifacts checklist.** Every 3 months, update and synchronize the project charter and the artifacts below.

Back up all source code:

- [ ] If applicable, establish a pull process to back up all source code

Project charter:

- [ ] Description: What is the purpose of the project and which problem does the product solve?
- [ ] Project scope: Which functions is our team involved in?
- [ ] Tech stack: Which tech stack does our team provide?
- [ ] Stakeholders: Who you work with and their roles
- [ ] Resource allocation: Which role is assigned to whom?
- [ ] Meetings: When the meetings are set up and for which purpose
- [ ] Communication channels
- [ ] Changelog: Link to the current changelog directory, which records the updates of the team's work

Milestones and roadmap:

- [ ] What would the team do in the next 3 months?

Documents:

- High-level diagrams, with a description of the function of each component
  - [ ] ERD or class diagram
  - [ ] Container diagram
  - [ ] Component diagram
  - [ ] Infrastructure diagram
- Flow, activity or state machine diagrams for core or complex features
- README
  - [ ] Project description
  - [ ] How to install and run the source code
  - [ ] How to contribute (coding convention, explanation of source structure and architecture...)
- `.env` document
- Potential issues and roadblocks

### Project handover

**Source code**

- [ ] Detailed diagrams created.
- [ ] Source code up to standard.
- [ ] All tests must be passed prior to the handover.
- [ ] Provide HOW-TOs to guide the new member to the development process.
- [ ] New team member has been able to compile, run, test, deploy code to all involved systems.
- [ ] Code walkthrough done.
- [ ] New member has written and deployed code to QA without supervision. It could be a bugfix or small feature.
- [ ] New members know how and where to find information why certain design/implementation decisions are done.
- [ ] Do pair programming for at least 1 hour (an old member with a new member).
- [ ] Code review time is scheduled weekly.

### Project case study

The case study should focus on what the audience wants to read.

**Non-tech client.** The client wants to know if you have the capability to deliver their work.

- [ ] Does it reflect the problem, solution and value proposition from Dwarves?
- [ ] Does it show the familiar / personas of previous clients?
- [ ] Does it contain a demonstration of the final delivery?

**Tech manager and potential new hire.** The tech readers want to know how strong the team is from a technical perspective.

- [ ] Does it contain the technical challenge?
- [ ] Does it contain the system design and architecture design?

### Project archive

The checklist shows how a project is archived.

- [ ] Collect and put all artifacts to Google Drive.
- [ ] Write a case study to share experience.
- [ ] Thank the client and ask for a referral if possible.
- [ ] Update the audience database.

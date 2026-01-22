---
description: Create a well-structured GitHub ticket with problem context, success criteria, and implementation guidance
argument-hint: <feature/bug description or context>
---

## Mission

Create a comprehensive GitHub ticket for: $ARGUMENTS

## Step 1: Gather Context

Use the `ticket-creator` subagent to analyse the requirement and gather codebase context.

The subagent will:
1. Search the codebase to understand current state
2. Identify relevant files and patterns
3. Determine the appropriate repository for the ticket

## Step 2: Draft Ticket Content

The `ticket-creator` subagent will create a ticket with:

### Required Sections
- **Original Request**: The original user input that initiated this ticket (preserve exact wording)
- **Problem Statement**: Clear description of what needs to be solved
- **Success Criteria**: Specific, measurable acceptance criteria
- **Implementation Guidance**: Helpful direction without being prescriptive
- **Design & Mockups**: Visual references or notes on what's needed
- **Out of Scope**: Explicit boundaries
- **Dependencies**: Related or blocking issues

## Step 3: Review with User

Before creating the ticket, present the draft to the user for review:

```
## Ticket Draft Review

**Repository:** {repo-name}
**Title:** {proposed title}

{full ticket content}

---

Would you like me to:
1. Create this ticket as-is
2. Make modifications (please specify)
3. Save as draft for later
```

## Step 4: Create GitHub Issue

Only after user approval, create the issue:

```bash
gh issue create --repo bradyoo12/{repo-name} --title "{title}" --body-file {draft-file}
```

## Step 5: Add to BYLabs Project as Todo

After creating the issue, add it to the BYLabs project board as a Todo:

```bash
gh project item-add 18 --owner bradyoo12 --url {issue-url}
```

Report the created issue URL and confirm it was added to the BYLabs project.

## Important Notes

- Always ask user to confirm the target repository
- Always show the full ticket for review before creation
- If mockups are missing, explicitly note this in the ticket
- Reference similar existing implementations where helpful

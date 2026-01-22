Automated development workflow that picks up the top Todo ticket from the project board and implements it end-to-end.

## Usage
`/b-todo`
`/b-todo 123 456`
`/b-todo https://github.com/bradyoo12/SiteAgent/issues/123`

## Prerequisites (MUST RUN FIRST)

**Before any ticket processing, ensure the correct GitHub account is active:**

```bash
gh auth switch -u bradyoo12
```

## Input Detection (MUST CHECK IN THIS ORDER)

**At the start of this command, determine the input mode by checking in this exact order:**

### 1. Check for Ticket Number/URL Arguments

If ticket numbers or URLs are provided as arguments (e.g., `$ARGUMENTS` contains numbers or URLs):

```
/b-todo 123 456 789
/b-todo https://github.com/bradyoo12/SiteAgent/issues/123
/b-todo 123 https://github.com/bradyoo12/SiteAgent/issues/456
```

1. Parse the ticket numbers/URLs from arguments
2. **Build a queue** of tickets in the order provided
3. Skip the auto-discovery in Step 1 and proceed directly to Step 2 with the first ticket in the queue
4. After completing each ticket, move to the next in the queue (no auto-discovery needed)

### 2. No Input Provided → Auto-Discover Tickets

If NO ticket numbers or URLs are provided as arguments:

**Automatically discover tickets with "Todo" status from project 18 using the GraphQL query in Step 1.**

## Loop Behavior
This workflow runs in an infinite loop with 5-second intervals:
1. Execute the workflow (Steps 1-7)
2. After completing one ticket (success or failure), wait 5 seconds
3. Start again from Step 1 to pick up the next Todo ticket (or next in queue if arguments were provided)
4. Continue until manually stopped by the user (Ctrl+C) or queue is exhausted

## Workflow

Execute this workflow in sequence, then loop:

### Step 1: Get Top Todo Ticket from Project Board

**Skip this step if ticket numbers were provided as arguments - use the queue instead.**

#### Step 1a: Get open issues from the repository

```bash
gh issue list --repo bradyoo12/SiteAgent --state open --json number,title,url,projectItems --limit 100
```

#### Step 1b: Filter to issues in BYLabs project

From the response, filter issues where `projectItems` contains an item with project name "BYLabs".

#### Step 1c: Filter to issues with "Todo" status

For each issue in BYLabs project, check the project status:
- **IMPORTANT: Only select items with explicit "Todo" status. Do NOT touch items with null/no status.**
- Select the first issue with `status == "Todo"`

If no "Todo" items exist, log "No Todo tickets found. Waiting 5 seconds..." and wait 5 seconds, then restart from Step 1.

### Step 2: Move Ticket to In Progress
1. Get the project item ID and field IDs:
   ```bash
   gh project field-list 18 --owner bradyoo12 --format json
   ```
2. Find the Status field ID and "In Progress" option ID
3. Update the item status to "In Progress":
   ```bash
   gh project item-edit --project-id <project_id> --id <item_id> --field-id <status_field_id> --single-select-option-id <in_progress_option_id>
   ```

### Step 3: Read Ticket and Create Plan
1. Fetch the issue details:
   ```bash
   gh issue view <issue_number> --repo bradyoo12/SiteAgent
   ```
2. Analyze the issue requirements thoroughly
3. Create a detailed implementation plan:
   - List files to create/modify
   - Define step-by-step implementation sequence
   - Identify testing requirements
4. Add the plan as a comment to the issue:
   ```bash
   gh issue comment <issue_number> --repo bradyoo12/SiteAgent --body "## Implementation Plan

   <plan content here>"
   ```

### Step 4: Create Feature Branch
1. Ensure you're on the main branch and it's up to date:
   ```bash
   git checkout master && git pull
   ```
2. Create and checkout a new branch named `<issue_number>-<issue_title_slug>`:
   - Convert issue title to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Example: Issue #42 "Add User Authentication" → `42-add-user-authentication`
   ```bash
   git checkout -b <branch_name>
   ```

### Step 5: Implement the Plan
Execute the implementation plan:
1. Make all necessary code changes
2. Follow existing project patterns and conventions
3. Write clean, well-documented code
4. Ensure the implementation is complete and functional

### Step 6: Verify and Commit
1. Run any relevant tests or builds to verify the implementation
2. Stage all changes:
   ```bash
   git add -A
   ```
3. Create a commit with a descriptive message:
   ```bash
   git commit -m "feat: <description>

   Refs #<issue_number>

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```
4. Push the branch to remote:
   ```bash
   git push -u origin <branch_name>
   ```

### Step 7: Update Ticket Status (Success or Failure)

**If implementation is SUCCESSFUL:**
1. Move the ticket to "In Review":
   ```bash
   gh project item-edit --project-id <project_id> --id <item_id> --field-id <status_field_id> --single-select-option-id <in_review_option_id>
   ```
2. Add a completion comment:
   ```bash
   gh issue comment <issue_number> --repo bradyoo12/SiteAgent --body "Implementation complete. Branch: \`<branch_name>\`. Ready for review."
   ```

**If implementation FAILS or is BLOCKED:**
1. Move the ticket back to "Todo":
   ```bash
   gh project item-edit --project-id <project_id> --id <item_id> --field-id <status_field_id> --single-select-option-id <todo_option_id>
   ```
2. Checkout back to master and delete the local branch:
   ```bash
   git checkout master && git branch -D <branch_name>
   ```
3. Add a comment explaining the issue:
   ```bash
   gh issue comment <issue_number> --repo bradyoo12/SiteAgent --body "Implementation blocked due to: <reason>. Moved back to Todo."
   ```
4. Report the failure reason to the user

### Step 8: Loop
1. Log "Cycle complete. Waiting 5 seconds before next iteration..."
2. Wait 5 seconds
3. Go back to Step 1

## Important Notes
- **This command runs in an infinite loop** - it will keep processing Todo tickets until manually stopped (Ctrl+C)
- This command runs autonomously - no user input required during execution
- **Only process tickets with explicit "Todo" status. Items with no status (null) must be ignored.**
- The ticket is moved to "In Progress" immediately to prevent duplicate work
- If anything fails, the ticket is moved back to "Todo" for retry
- Branch naming follows the convention: `<issue_number>-<slug-of-title>`
- Commits reference the issue with "Refs #" (not "Fixes" or "Closes") to link without auto-closing
- The user will manually close the issue after reviewing the implementation
- 5-second delay between iterations allows the user to review progress and stop if needed

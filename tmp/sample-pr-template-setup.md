# Sample PR

## Title
chore(github): add default and heavy pull request templates

## Body
## Summary
- Adds repository-level pull request templates to standardize PR quality and review flow.
- Introduces both a lightweight default template and a detailed heavy-change template for larger, higher-risk updates.
- Scope is limited to GitHub metadata/templates; no product/test runtime behavior changes.

## Changes
- Added:
  - `.github/pull_request_template.md` (default PR template)
  - `.github/PULL_REQUEST_TEMPLATE/heavy-change.md` (selectable heavy template)
- Updated:
  - None
- Refactored:
  - None
- Removed:
  - None

## Validation
- Commands run:
  - `git status -sb`
  - `git branch --show-current`
- Results:
  - Passed: repository recognizes new template files in working tree
  - Failed: none
  - Skipped: runtime test execution (not applicable for markdown-only change)
- Notes on flaky or environment-specific behavior (if any): none

## Risk & Impact
- Risk level: Low
- Impacted areas: GitHub PR authoring/review workflow
- Backward compatibility concerns: none
- Any sensitive config/data implications: none

## Rollback Plan
- Revert PR commit(s), or
- Delete:
  - `.github/pull_request_template.md`
  - `.github/PULL_REQUEST_TEMPLATE/heavy-change.md`
- No runtime rollback or deployment action required

## Checklist
- [x] Branch is not `main`
- [x] PR title follows convention (`type(scope): summary`)
- [x] Tests added/updated where needed (not applicable)
- [x] Relevant regression checks passed (not applicable to markdown-only change)
- [x] No secrets or tokens committed
- [ ] Reviewer(s) added

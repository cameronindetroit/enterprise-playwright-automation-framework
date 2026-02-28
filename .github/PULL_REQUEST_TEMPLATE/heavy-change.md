## Summary
- What problem does this PR solve?
- Why this is high-impact or broad in scope
- Business/user impact
- Scope included
- Scope intentionally excluded

## Architecture / Design
- Key design decisions
- Trade-offs considered
- Alternatives rejected and why
- Diagrams or references (if applicable)

## Detailed Changes
### Application / Test Code
- Added:
- Updated:
- Refactored:
- Removed:

### Configuration / CI / Workflows
- Added:
- Updated:
- Removed:

### Documentation
- Added/Updated docs:
- Runbooks or onboarding notes impacted:

## Data, Security, and Compliance
- Any secret/token handling changes:
- Data exposure/artifact considerations:
- Access control / permissions impacted:
- Compliance considerations (if any):

## Validation Matrix
### Commands Run
- `npx playwright test -g "@regression" --reporter=line`
- Additional commands:

### Results by Area
- Dashboard:
- Login:
- E2E:
- Regression:
- Smoke:

### Results by Browser/Project
- Chromium:
- Firefox:
- WebKit:

### Summary
- Passed:
- Failed:
- Skipped:
- Known flaky tests and rationale:

## Risk Assessment
- Risk level: Low / Medium / High
- Top 3 risks:
  1.
  2.
  3.
- Mitigations in this PR:

## Rollout Plan
- Merge strategy (squash/merge/rebase):
- Post-merge actions:
- Feature flags or staged rollout steps:

## Rollback Plan
- Exact rollback approach:
- Dependencies/side effects of rollback:
- Validation steps after rollback:

## Reviewer Guide
- Suggested review order (files/modules):
  1.
  2.
  3.
- Areas needing extra scrutiny:
- Questions for reviewers:

## Checklist
- [ ] Branch is not `main`
- [ ] PR title follows convention (`type(scope): summary`)
- [ ] Tests added/updated where needed
- [ ] Heavy validation run completed and attached
- [ ] CI/workflow changes tested
- [ ] Security/data handling reviewed
- [ ] No secrets or tokens committed
- [ ] Documentation updated for behavior/config changes
- [ ] Reviewer(s) added

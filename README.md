# HoneycombICP Playwright Automation

[![Playwright Manual Run](https://github.com/cameronindetroit/enterprise-playwright-automation-framework/actions/workflows/playwright-manual.yml/badge.svg)](https://github.com/cameronindetroit/enterprise-playwright-automation-framework/actions/workflows/playwright-manual.yml)

Quick access:

- Run from web UI: https://github.com/cameronindetroit/enterprise-playwright-automation-framework/actions/workflows/playwright-manual.yml
- Latest workflow runs: https://github.com/cameronindetroit/enterprise-playwright-automation-framework/actions

## First-time setup checklist

- [ ] Confirm workflow file exists: `.github/workflows/playwright-manual.yml`
- [ ] Add repository secrets in GitHub → **Settings** → **Secrets and variables** → **Actions**:
  - [ ] `HONEYCOMB_USERID`
  - [ ] `HONEYCOMB_PASSWORD`
- [ ] (Optional for live URL) Enable GitHub Pages in GitHub → **Settings** → **Pages**:
  - [ ] **Source** = **GitHub Actions**
- [ ] Trigger the workflow from the Actions page using **Run workflow**
- [ ] For downloadable report, open artifact `playwright-html-report-<run_number>` and open `index.html`
- [ ] For live report URL, set `publish_to_pages=true` and check deploy step output for `page_url`

Playwright + TypeScript test framework for Honeycomb ICP workflows using Page Object Model (POM), centralized PageManager usage, and fixture-based login setup.

The dashboard E2E flow now includes KPI snapshot comparison and event-dropdown load validation.

## Quick Commands

`npm test` — run all tests  
`npm run ui` — open Playwright UI mode  
`npm run list` — list discovered tests  
`npm run chr` / `npm run ff` / `npm run wk` — run one browser project  
`npm run dash` / `npm run login` — run key suites  
`npm run reg:dashboard` / `npm run e2e:dashboard` — run targeted dashboard suites  
`npm run login` / `npm run e2e:login` — run targeted login suites  
`npm run smoke` / `npm run smoke:dashboard` / `npm run smoke:login` — run dedicated smoke suite(s)  
`npm run reg:smoke` / `npm run e2e:critical` — run CI-focused fast subsets  
`npm run last` — rerun failed tests  
`npm run report` — open HTML report

## Prerequisites

- Node.js 20.17+
- npm 11+

The project already includes runtime guidance in package metadata and `.nvmrc`.

## Install

From project root:

npm install

Install Playwright browsers (first time only):

npx playwright install

## Environment Configuration

Environment variables are loaded in `playwright.config.ts`:

- Default: `src/config/.env.qa`
- Override by setting `NODE_ENV` to use `src/config/.env.<NODE_ENV>`

Credentials are expected in env variables:

- `userid`
- `password`

The fixture supports encrypted or plain values. If encrypted values are used, decryption is handled with `CryptojsUtil`.

## Test Architecture

### Page Object Model

Page classes live under `src/pages`.

Recent structure updates:

- `DashboardPage.ts` owns dashboard-only locators/actions (KPIs, event dropdown, load event)
- `HomePage.ts` focuses on shell navigation and account/contact actions
- `ContactAccountAdminModalPage.ts` encapsulates Contact modal interactions

### Page Manager

`PageManager` centralizes page object creation and access:

- LoginPage
- HomePage
- DashboardPage
- EventPage
- ICPPage
- DataRequestPage
- SettingsPage
- FAQPage
- FeatureBugRequestPage

### Test Helpers

Reusable E2E helper logic is extracted to:

- `src/tests/helpers/DashboardE2EHelper.ts`

This helper centralizes KPI readiness waits, snapshot attachments, random event selection, and KPI change assertions.

### Fixture-based Setup

`src/tests/fixtures.ts` provides a custom test fixture that:

1. Creates worker-scoped authenticated `storageState`
2. Reuses that auth state across tests in the worker
3. Falls back to credential login if auth state is stale
4. Exposes authenticated `pageManager` to tests

Tests use:

import { test, expect } from "./fixtures.ts";

test("...", async ({ pageManager }) => {
  // use pageManager here
});

## Running Tests

### NPM Shortcuts (Recommended)

Run all tests:

npm test

Open Playwright UI mode:

npm run ui

List discovered tests:

npm run list

Run in headed mode:

npm run headed

Run in debug mode:

npm run debug

Run by browser:

npm run chr
npm run ff
npm run wk

Run specific suites:

npm run dash
npm run login
npm run e2e:login
npm run reg:dashboard
npm run e2e:dashboard
npm run smoke
npm run smoke:dashboard
npm run smoke:login
npm run reg:smoke
npm run e2e:critical

Run dashboard E2E suite:

npx playwright test src/tests/e2e/dashboard/dashboardE2E.spec.ts

Run login E2E suite:

npx playwright test src/tests/e2e/login/loginE2E.spec.ts

Run dashboard regression suite:

npx playwright test src/tests/regression/dashboard/dashboard.*.regression.spec.ts

Run dedicated smoke suites:

npx playwright test src/tests/smoke
npx playwright test src/tests/smoke/dashboard/dashboardSmoke.spec.ts
npx playwright test src/tests/smoke/login/loginSmoke.spec.ts

Run tag-based subsets:

npx playwright test src/tests/regression --grep @smoke
npx playwright test src/tests/e2e --grep @critical

Re-run only failed tests:

npm run last

Open HTML report:

npm run report

### Direct Playwright Commands

Run all tests:

npx playwright test

Run in UI mode:

npx playwright test --ui

Run one file:

npx playwright test src/tests/regression/dashboard/dashboard.navigation.regression.spec.ts

Run one test by title:

npx playwright test src/tests/regression/dashboard/dashboard.navigation.regression.spec.ts -g "Event tab navigation"

Run one project/browser:

npx playwright test --project=chromium

List discovered tests:

npx playwright test --list

## Reports

HTML report output:

- `playwright-report/index.html`

Screenshots and artifacts:

- `test-results/`

## Run From GitHub Web UI (Fastest)

This repo includes a manual workflow at `.github/workflows/playwright-manual.yml`.

Use it to run tests from the GitHub Actions webpage and download the HTML report.

### One-time setup

In your GitHub repository settings, add these **Actions secrets**:

- `HONEYCOMB_USERID`
- `HONEYCOMB_PASSWORD`

These map to the runtime env vars expected by this framework (`userid` and `password`).

### Trigger a run

1. Open GitHub → **Actions** → **Playwright Manual Run**
2. Click **Run workflow**
3. Choose:
  - `suite` (all / smoke / regression / e2e options)
  - `browser` (chromium / firefox / webkit / all)
  - optional `grep` tag filter (example `@critical`)
  - `node_env` (default `qa`)
  - `publish_to_pages` (`true` to publish live URL)
  - `retries` (`auto` recommended)
  - `workers` (`auto` recommended)
  - `timing_summary` (`true` recommended)
4. Start the run

Recommended first-run defaults:

- `suite=smoke`
- `browser=chromium`
- `publish_to_pages=false`
- leave `grep` empty
- `retries=auto`
- `workers=auto`
- `timing_summary=true`

Auto behavior for speed/stability:

- non-critical suites → retries `0`, workers `2`
- `e2e-critical` suite → retries `2`, workers `1`

### Get the HTML report

When the run finishes (pass or fail), open the workflow run and download artifact:

- `playwright-html-report-<run_number>`

Unzip it and open `index.html` in a browser.

### Scheduled runs (GitHub Actions cron)

This workflow is also scheduled to run automatically with two cron triggers.

Cron configured in `.github/workflows/playwright-manual.yml`:

- `0 * * * *` (hourly smoke run)
- `0 8 * * 1` (weekly regression run, Mondays at 02:00 CST / 08:00 UTC)

Scheduled run defaults:

- Hourly schedule (`0 * * * *`):
  - `suite=smoke`
  - `browser=chromium`
  - `retries=auto`
  - `workers=auto`
  - `publish_to_pages=false`
  - `timing_summary=true`
- Weekly schedule (`0 8 * * 1`):
  - `suite=regression-all`
  - `browser=chromium`
  - `retries=1`
  - `workers=2`
  - `publish_to_pages=false`
  - `timing_summary=true`

Note: Scheduled runs do not use manual `workflow_dispatch` input values.

### Optional: Live report URL via GitHub Pages

If `publish_to_pages=true`, the workflow deploys `playwright-report/` to GitHub Pages and prints a live URL in run logs.

One-time repo setup:

1. GitHub repository → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**

After each run with `publish_to_pages=true`:

- Open the workflow run and check the deploy step output for `page_url`
- The latest published report is available at that URL

Timing details:

- When `timing_summary=true`, the workflow publishes a **Run timing summary** table in the Actions run summary.
- It includes major step durations (dependency install, Playwright setup, test execution) plus total job elapsed time.

Note: GitHub Pages hosts one current version for this workflow deployment target (latest run replaces prior published report).

### Troubleshooting (GitHub Actions)

- **Missing secrets / login failures**
  - Symptom: Tests fail at login or env-based auth steps.
  - Fix: Verify repository secrets exist and are correctly named:
    - `HONEYCOMB_USERID`
    - `HONEYCOMB_PASSWORD`
  - Fix: Re-run workflow after updating secrets (secrets are not retroactive to completed runs).

- **`publish_to_pages=true` but no live URL**
  - Symptom: Deploy step is skipped or fails.
  - Fix: In GitHub → **Settings** → **Pages**, set **Source** to **GitHub Actions**.
  - Fix: Ensure workflow has `pages: write` and `id-token: write` permissions (already configured in this repo).

- **Workflow runs, but report artifact is missing**
  - Symptom: No `playwright-html-report-<run_number>` artifact.
  - Fix: Check test step logs for early setup failure before report generation.
  - Fix: Confirm Playwright report path is `playwright-report/` (default in this framework).

- **Wrong environment data used**
  - Symptom: Tests hit unexpected environment/config.
  - Fix: Set `node_env` input to match `src/config/.env.<node_env>`.
  - Example: `qa` uses `src/config/.env.qa`.

- **Runs are slow or timing out**
  - Symptom: Workflow exceeds expected runtime.
  - Fix: Select smaller suites first (`smoke`, `smoke-dashboard`, `smoke-login`).
  - Fix: Use one browser (`chromium`) before scaling to `all`.
  - Fix: Keep `retries=auto` and `workers=auto`, or explicitly set `retries=0` and `workers=2` for faster feedback runs.
  - Fix: Set `timing_summary=true` and check the summary table to identify the slowest step.

#### Failure signatures quick map

| Log/Error Signature | Likely Cause | Action |
| --- | --- | --- |
| `Configuration error` / `Missing required secrets HONEYCOMB_USERID and/or HONEYCOMB_PASSWORD` | Required Actions secrets are missing or empty | Add/update both secrets in **Settings → Secrets and variables → Actions**, then re-run |
| `Error: userid is undefined` or login credential empty | Missing/incorrect Actions secrets | Add `HONEYCOMB_USERID` and `HONEYCOMB_PASSWORD` in repo Actions secrets, then re-run |
| `Error: password is undefined` | Missing/incorrect Actions secrets | Recreate secret with exact name and verify non-empty value |
| `No tests found` | Suite path/grep mismatch | Use `suite=all` first, clear `grep`, then narrow scope |
| `Error: Project(s) "..." not found` | Browser/project input typo | Use only `chromium`, `firefox`, `webkit`, or `all` |
| `deploy-pages` skipped / no `page_url` output | Pages not enabled for Actions | Set repo **Settings → Pages → Source = GitHub Actions** |
| `Artifact not found: playwright-report/` | Test command failed before report generation | Check earlier failing step logs; fix setup/auth failure first |
| `Timeout of 60 minutes exceeded` | Large suite + multi-browser run | Start with `smoke` + `chromium`, then scale up |

## Current Test Files

- `src/tests/e2e/dashboard/dashboardE2E.spec.ts`
- `src/tests/e2e/login/loginE2E.spec.ts`
- `src/tests/smoke/dashboard/dashboardSmoke.spec.ts`
- `src/tests/smoke/login/loginSmoke.spec.ts`
- `src/tests/regression/dashboard/dashboard.kpi.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.dropdown.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.navigation.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.contact.regression.spec.ts`
- `src/tests/regression/login/login.success.regression.spec.ts`
- `src/tests/regression/login/login.invalid-password.regression.spec.ts`
- `src/tests/regression/login/login.forgot-password.regression.spec.ts`

## Dashboard E2E Coverage

`src/tests/e2e/dashboard/dashboardE2E.spec.ts` currently validates:

- Dashboard shell visibility post-login
- Dashboard KPI/header elements
- Event dropdown flow with random event selection
- Load New Event behavior and before/after KPI snapshot comparison
- Navigation coverage for Events, ICP, Data Request, Settings, FAQ, Feature/Bug Request

Note: Contact modal send flow is intentionally `test.skip(...)` to avoid sending real emails during routine runs.

## Troubleshooting

If UI mode shows no tests:

1. Run test discovery: `npx playwright test --list`
2. Ensure tests importing fixture use `import { test, expect } from "./fixtures.ts"`
3. Ensure fixture parameter names match test args (for example, `pageManager`)
4. Restart TypeScript server in VS Code if editor diagnostics are stale

## Notes

`requirements.md` contains broader framework goals and roadmap notes. This README focuses on current implementation and day-to-day usage.

# HoneycombICP Playwright Automation

Playwright + TypeScript test framework for Honeycomb ICP workflows using Page Object Model (POM), centralized PageManager usage, and fixture-based login setup.

The dashboard E2E flow now includes KPI snapshot comparison and event-dropdown load validation.

## Quick Commands

`npm test` — run all tests  
`npm run ui` — open Playwright UI mode  
`npm run list` — list discovered tests  
`npm run chr` / `npm run ff` / `npm run wk` — run one browser project  
`npm run dash` / `npm run login` — run key suites  
`npm run reg:dashboard` / `npm run e2e:dashboard` — run targeted dashboard suites  
`npm run smoke` / `npm run smoke:dashboard` — run dedicated smoke suite(s)  
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
npm run reg:dashboard
npm run e2e:dashboard
npm run smoke
npm run smoke:dashboard
npm run reg:smoke
npm run e2e:critical

Run dashboard E2E suite:

npx playwright test src/tests/e2e/dashboard/dashboardE2E.spec.ts

Run dashboard regression suite:

npx playwright test src/tests/regression/dashboard/dashboard.*.regression.spec.ts

Run dedicated smoke suites:

npx playwright test src/tests/smoke
npx playwright test src/tests/smoke/dashboard/dashboardSmoke.spec.ts

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

## Current Test Files

- `src/tests/e2e/dashboard/dashboardE2E.spec.ts`
- `src/tests/smoke/dashboard/dashboardSmoke.spec.ts`
- `src/tests/regression/dashboard/dashboard.kpi.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.dropdown.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.navigation.regression.spec.ts`
- `src/tests/regression/dashboard/dashboard.contact.regression.spec.ts`
- `src/tests/loginTest.spec.ts`

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

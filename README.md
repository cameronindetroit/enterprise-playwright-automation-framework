# Enterprise Playwright Automation

Playwright + TypeScript test framework for Honeycomb ICP workflows using Page Object Model (POM), centralized PageManager usage, and fixture-based login setup.

## Quick Commands

`npm test` — run all tests  
`npm run ui` — open Playwright UI mode  
`npm run list` — list discovered tests  
`npm run chr` / `npm run ff` / `npm run wk` — run one browser project  
`npm run dash` / `npm run login` — run key suites  
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

### Page Manager

`PageManager` centralizes page object creation and access:

- LoginPage
- HomePage
- EventPage
- ICPPage
- DataRequestPage
- SettingsPage
- FAQPage
- FeatureBugRequestPage

### Fixture-based Setup

`src/tests/fixtures.ts` provides a custom test fixture that:

1. Creates `pageManager`
2. Navigates to login
3. Fills credentials
4. Logs in
5. Exposes authenticated `pageManager` to tests

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

npx playwright test src/tests/dashboardTest.spec.ts

Run one test by title:

npx playwright test src/tests/dashboardTest.spec.ts -g "Event tab navigation"

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

- `src/tests/dashboardTest.spec.ts`
- `src/tests/loginTest.spec.ts`

## Troubleshooting

If UI mode shows no tests:

1. Run test discovery: `npx playwright test --list`
2. Ensure tests importing fixture use `import { test, expect } from "./fixtures.ts"`
3. Ensure fixture parameter names match test args (for example, `pageManager`)
4. Restart TypeScript server in VS Code if editor diagnostics are stale

## Notes

`requirements.md` contains broader framework goals and roadmap notes. This README focuses on current implementation and day-to-day usage.

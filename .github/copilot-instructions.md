# Copilot Instructions for LinkedIn Automation Testing Project

## Project Overview
This is an **E2E browser automation framework** testing a complete LinkedIn user workflow using **Playwright + TypeScript**. It implements the **Page Object Model (POM)** pattern with data-driven tests, integrated Jira/Zephyr reporting, and CI/CD support (Docker, Jenkins, GitHub Actions).

**Key workflow**: Login → Search Recruiters (Excel-driven) → Compose Messages → Logout → Generate Reports

## Architecture & Patterns

### Page Object Model (POM) Structure
Located in `tests/pages/`, each page class extends `BasePage`:
- **`basePage.ts`**: Core utilities with `b_*` prefixed methods (navigation, waits, element interactions, assertions)
- **`loginPage.ts`**: Handles login flow (username, password submission)
- **`linkedInSearchPage.ts`**: Recruiter search and navigation to LinkedIn feed
- **`composeMessage.ts`**: Message composition with dynamic template generation via `buildMessage()`
- **`logoutPage.ts`**: Logout flow
- **`readRecruiterNames.ts`**: Reads recruiter data from Excel files for data-driven tests

**Pattern**: Each page object imports only its dependencies and uses Playwright `Locator` objects. Never hardcode selectors in tests—use page object methods.

### Base Method Naming Convention
All BasePage methods start with `b_` (e.g., `b_clickElement`, `b_fillField`, `b_waitForElementVisible`). This distinguishes framework utilities from page-specific logic. Use `pressSequentially()` instead of `fill()` for text input to handle dynamic form fields.

### Data-Driven Tests
- Recruiter names are loaded from `data/recruiterList.xlsx` via `readRecruiterNames.ts`
- The `Row` type represents spreadsheet records with dynamic column mapping (supports "FirstName"/"LastName"/"Name")
- Messages are generated dynamically using `buildMessage(row, dayOffset)` which:
  - Extracts recruiter name from flexible column headers
  - Embeds company information if available
  - Uses Sydney timezone for weekday calculation
  - Returns templated message strings

### Test Hooks & Setup
File: `tests/pages/hooks.ts` extends Playwright's base test fixture to:
- Clear cookies and localStorage before each test
- Ensure clean session state without side effects

Import as: `import { test, expect } from './pages/hooks';`

## Critical Workflows & Commands

### Running Tests Locally
```bash
npx playwright test                                    # Run all tests
npx playwright test tests/userSendsMessage.spec.ts    # Run specific test
npx playwright test --headed                           # Show browser window
npx playwright test --debug                            # Open Playwright Inspector
```

### Environment Setup (.env required)
```
BASE_URL=https://www.linkedin.com
LINKEDIN_USERNAME=your_email@example.com
LINKEDIN_PASSWORD=your_password
ZEPHYR_AUTH_TOKEN=your_jira_zephyr_api_token
```

### Test Reporting
- **HTML Reports**: Generated in `playwright-report/` (run `npx playwright show-report`)
- **Allure Reports**: Generated in `allure-results/`
- **Zephyr Integration**: Configured in `playwright.config.ts` to auto-create test cycles in Jira

## Project-Specific Conventions

### Locator Strategy
Avoid CSS/XPath brittle selectors. Prefer:
1. `aria-label` attributes (most reliable for LinkedIn)
2. `placeholder` attributes
3. Role-based selectors: `page.getByRole('button', { name: /regex/i })`
4. Fallback to semantic attributes

Example from `composeMessage.ts`: Use `getByRole('button', { name: /^Close your conversation with/i })` instead of dynamic ID selectors.

### Handling Dynamic Content
For form fields that don't respond to `.fill()`:
```typescript
// Use pressSequentially() for LinkedIn's dynamic inputs
await element.pressSequentially(text);
// Or inject HTML directly as fallback
await element.evaluate((el: HTMLElement) => (el.innerHTML = text));
```

### Timeout Management
- Default timeout: `maxTimeout = 30_000` (30 seconds) defined in `basePage.ts`
- Network waits: Use `waitUntil: 'networkidle'` for page loads (LinkedIn's dynamic content)
- Viewport: Set to `4500x3250` in `playwright.config.ts` to capture full LinkedIn UI

### Error Context in Tests
Always validate environment variables at test start:
```typescript
if (!process.env.BASE_URL || !process.env.LINKEDIN_USERNAME || !process.env.LINKEDIN_PASSWORD) {
  throw new Error("Missing required environment variables");
}
```

## Integration Points

### Zephyr/Jira Reporter
Configured in `playwright.config.ts`:
- Reports test results to Jira Zephyr with automatic test cycle creation
- Test cycle name: "Smoke + Happy Path" (update for each automation run)
- Tags tests with components: "login, message, search, logout, report"

### Email Reporting
`tests/pages/logAndReport.ts` exports `sendReportEmail()` to mail test results via Nodemailer after test completion.

### CI/CD Configuration
- Retries: 2 attempts in CI, 0 locally
- Workers: 1 worker in CI, auto-scale locally
- Video recording: Enabled for all tests
- Trace: Captured on first retry for debugging

## Adding New Tests

1. **Create test file** in `tests/` with `.spec.ts` suffix
2. **Import page objects** and `{ test, expect }` from `./pages/hooks`
3. **Instantiate page classes** with `new PageClass(page)`
4. **Use base methods** for all interactions (never direct Playwright calls)
5. **Add tags** for categorization: `test('[ID] Description', {tag:'@smoke'}, async ()`
6. **Update Excel** if data-driven: Add recruiter rows to `data/recruiterList.xlsx`

Example structure (see `userSendsMessage.spec.ts`):
```typescript
import { test } from './pages/hooks';
import { LoginPage } from './pages/loginPage';

test('[T1] My test', async ({ page }) => {
  const login = new LoginPage(page);
  await login.b_navigateTo(process.env.BASE_URL!);
  // ... test logic
});
```

## Key Files Reference
| File | Purpose |
|------|---------|
| `tests/pages/basePage.ts` | Core automation utilities (all `b_*` methods) |
| `tests/pages/hooks.ts` | Clean state setup (cookies, storage clearing) |
| `tests/userSendsMessage.spec.ts` | End-to-end test template |
| `playwright.config.ts` | Playwright + Zephyr reporter configuration |
| `data/recruiterList.xlsx` | Data source for recruiter search tests |
| `.env` | Credentials and API tokens (not in repo) |

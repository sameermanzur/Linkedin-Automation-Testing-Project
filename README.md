# LinkedIn Automation Testing Project
📌 Overview

This project automates LinkedIn recruiter outreach using Playwright with TypeScript.
It reads recruiter names from an Excel file, searches for them on LinkedIn, navigates to their profiles, opens the message dialog, and sends a personalized message.

The framework also integrates with Zephyr for Jira for test case management, and is designed to run locally as well as in CI/CD pipelines (GitHub Actions, Jenkins, Docker).

🛠️ Tech Stack

Playwright (E2E browser automation)

TypeScript (strong typing and maintainability)

ExcelJS / XLSX (data-driven tests using recruiter names)

Node.js & npm (dependency management)

Dotenv (environment variables for credentials & config)

Zephyr Reporter (test management integration with Jira)

Allure Reports (visual test execution reports)

Docker & Jenkins (CI/CD pipeline support)

## Acknowledgements
https://www.linkedin.com/in/swaroop-landge-9a5b9111/ for their continuous support, direction, and encouragement in shaping my journey into QA Automation.

LinkedIn-Automation-Project/
│── tests/                     # Test specs
│   ├── verifyE2EuserFlow.spec.ts
│   ├
│── pages/                     # Page Object Models (POM)
│   ├── basePage.ts
│   ├── loginPage.ts
│   ├── linkedInSearchPage.ts
│   ├── composeMessage.ts
│   ├── logoutPage.ts
│   ├── readRecruiterNames.ts  # Excel data utility
│
│── hooks/                     # Playwright hooks (before/after each test)
│   ├── hooks.ts
│
│── data/
│   ├── recruiterNames.xlsx    # Input test data
│
│── reports/                   # Allure & Zephyr reports
│
│── playwright.config.ts       # Playwright config
│── package.json
│── tsconfig.json
│── .env                       # Environment variables
│── Dockerfile
│── Jenkinsfile

⚙️ Setup & Installation
1. Clone Repository
git clone https://github.com/sameermanzur/LinkedIn-Automation-Project.git
cd LinkedIn-Automation-Project

2. Install Dependencies
npm install

3. Configure Environment

Create a .env file:

BASE_URL=https://www.linkedin.com
USERNAME=your_email@example.com
PASSWORD=your_password
ZEPHYR_TOKEN=your_zephyr_api_key

4. Prepare Test Data

Update ./data/recruiterNames.xlsx with recruiter names in FirstName / LastName / Name format.

▶️ Running Tests
Local Execution
npx playwright test

Run Specific Test
npx playwright test tests/verifyE2EuserFlow.spec.ts --headed

Clear Cache & Cookies (best practice hooks)

Hooks automatically clear session storage, cookies, and cache before each test run.

🧩 Key Features

✅ Data-driven testing using Excel recruiter list

✅ Page Object Model (POM) for maintainability

✅ Environment-driven setup with .env

✅ Clear cache/cookies hooks for clean sessions

✅ Integration with Jira Zephyr for reporting

✅ CI/CD ready (Docker + Jenkins + GitHub Actions)

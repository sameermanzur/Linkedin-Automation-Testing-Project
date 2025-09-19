# LinkedIn Automation Testing Project
## 📌 Overview

This project automates LinkedIn recruiter outreach using Playwright with TypeScript.
It reads recruiter names from an Excel file, searches for them on LinkedIn, navigates to their profiles, opens the message dialog, and sends a personalized message.

The framework also integrates with Zephyr for Jira for test case management, and is designed to run locally as well as in CI/CD pipelines (GitHub Actions, Jenkins, Docker).

## 🛠️ Tech Stack

Playwright (E2E browser automation)

TypeScript (strong typing and maintainability)

ExcelJS / XLSX (data-driven tests using recruiter names)

Node.js & npm (dependency management)

Dotenv (environment variables for credentials & config)

Zephyr Reporter (test management integration with Jira)

Allure Reports (visual test execution reports)

Docker & Jenkins (CI/CD pipeline support)

## Acknowledgements
Swaroop Landge https://www.linkedin.com/in/swaroop-landge-9a5b9111/ for their continuous support, direction, and encouragement in shaping my journey into QA Automation.

## 🧩 Page Object Model (POM)

This project uses the Page Object Model (POM) design pattern for clean, reusable, and maintainable test automation. Each page has its own class with dedicated methods.

basePage.ts → Core utilities (navigation, waits, common actions)

loginPage.ts → Handles login (username, password, submit)

linkedInSearchPage.ts → Manages recruiter search

composeMessage.ts → Automates recruiter message composition

logoutPage.ts → Handles logout flow

readRecruiterNames.ts → Reads recruiter data from Excel (data-driven tests)

## flowchart TD
    A[Login Page] --> B[LinkedIn Search Page]
    B --> C[Compose Message Page]
    C --> D[Logout Page]
    E[Excel Data] --> B


⚙️ Setup & Installation
1. Clone Repository
git clone https://github.com/sameermanzur/Linkedin-Automation-Testing-Project/tree/End-to-End-Flow
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

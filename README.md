# LinkedIn Automation Testing Project

## 📌 Overview

This project is an **End-to-End (E2E) Test Automation Framework** designed to simulate a real user journey on LinkedIn. It automates critical workflows such as logging in, searching for recruiters, composing personalized messages, and logging out.

The framework goes beyond isolated unit tests by validating the entire workflow across multiple pages and components. It integrates with **Zephyr for Jira** for test case management and is built to run both locally and in CI/CD pipelines (GitHub Actions, Jenkins, Docker).

## 🚀 Features

- **E2E Browser Automation**: Uses **Playwright** for reliable and fast browser interactions.
- **Page Object Model (POM)**: Implements POM design patterns for maintainable and scalable code.
- **Data-Driven Testing**: Reads recruiter names from Excel files (`.xlsx`) to dynamically generate test cases.
- **TypeScript**: Written in TypeScript for strong typing and better developer tooling.
- **Environment Management**: Uses `.env` files for secure handling of credentials and configuration.
- **Robust Reporting**: Integrates **Allure Reports** for visual execution results and **Zephyr** for Jira test management.
- **Email Notifications**: Automatically emails execution logs and reports upon test completion.
- **CI/CD Ready**: Configured for Docker and Jenkins integration.

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)**: E2E testing framework.
- **[TypeScript](https://www.typescriptlang.org/)**: Programming language.
- **[Node.js](https://nodejs.org/)**: Runtime environment.
- **[ExcelJS](https://github.com/exceljs/exceljs) / [XLSX](https://docs.sheetjs.com/)**: For reading Excel data.
- **[Dotenv](https://github.com/motdotla/dotenv)**: Environment variable management.
- **[Nodemailer](https://nodemailer.com/)**: For sending email reports.
- **[Allure](https://allurereport.org/)**: Reporting tool.

## 📂 Project Structure

```
├── data/
│   └── recruiterList.xlsx      # Data file containing recruiter names
├── e2e/
│   └── example.spec.ts         # Sample Playwright test
├── tests/
│   ├── pages/                  # Page Object Models and Utilities
│   │   ├── basePage.ts         # Base class for all pages
│   │   ├── loginPage.ts        # Login page interactions
│   │   ├── linkedInSearchPage.ts # Search functionality
│   │   ├── composeMessage.ts   # Message composition logic
│   │   ├── logoutPage.ts       # Logout interactions
│   │   ├── readRecruiterNames.ts # Excel reading utility
│   │   ├── logAndReport.ts     # Email reporting utility
│   │   ├── hooks.ts            # Test hooks (setup/teardown)
│   │   └── globalTearDown.ts   # Global cleanup scripts
│   ├── login.spec.ts           # Login test suite
│   ├── userSendsMessage.spec.ts # Main E2E workflow test
│   └── seed.spec.ts            # Data seeding placeholder
├── playwright.config.ts        # Playwright configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/sameermanzur/Linkedin-Automation-Testing-Project.git
cd Linkedin-Automation-Testing-Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
BASE_URL=https://www.linkedin.com
LINKEDIN_USERNAME=your_email@example.com
LINKEDIN_PASSWORD=your_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER_EMAIL=your_email_for_sending_reports
REPORT_RECIPIENT=recipient_email@example.com
ZEPHYR_TOKEN=your_zephyr_api_key
```

### 4. Prepare Test Data
Ensure `data/recruiterList.xlsx` exists and contains a list of names. The file should have headers like `First Name`, `Last Name`, or `Name`.

## ▶️ Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test tests/userSendsMessage.spec.ts
```

### Run in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```

### Generate Allure Report
```bash
npx allure generate ./allure-results --clean
npx allure open
```

## 🧩 Page Object Model (POM) Details

- **BasePage**: Contains common methods like `b_navigateTo`, `b_clickElement`, and `b_fillField`.
- **LoginPage**: Encapsulates login logic (`enterUserName`, `enterPassword`, `login`).
- **LinkedInSearchPage**: Handles navigating to the feed and searching for recruiters.
- **ComposeMessagePage**: Manages opening message dialogs, generating personalized text, and sending messages.
- **LogoutPage**: Handles the logout process to ensure a clean state.

## 🤝 Acknowledgements

Special thanks to [Swaroop Landge](https://www.linkedin.com/in/swaroop-landge-9a5b9111/) for his continuous support and mentorship in QA Automation.

## 📄 License

This project is licensed under the ISC License.

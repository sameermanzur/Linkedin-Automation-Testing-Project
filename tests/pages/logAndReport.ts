/*
test is executed; Zephyr report is generated as test Cycle; Good for Test Management and Traceability 
I want to receive email of the logs and the report; status: No of passed and failed (<20>); 
nodemailer - for emailing 
add OAuth2.0 verification to avoid password handling in Google console 
*/ 
import nodemailer from "nodemailer";
import path from "path";
import { google } from "googleapis";
import dotenv from 'dotenv';
import fs from'fs'; 

dotenv.config(); 

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER_EMAIL,
  REPORT_RECIPIENT
} = process.env;

export async function sendReportEmail() {
  // 1. OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // redirect URI
  );
  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

 const {token} = await oAuth2Client.getAccessToken();
 if (!token) throw new Error ('Failed to get token'); 


  // 2. Paths to reports
  const reportPath = path.resolve(__dirname, "../reports/allure-report.zip"); 
  const logsPath = path.resolve(__dirname, "../logs/execution.log");

  // 3. Verify files exist
  if (!fs.existsSync(reportPath)) console.warn("Report not found");
  if (!fs.existsSync(logsPath)) console.warn("Logs not found");

  // 4. Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GOOGLE_USER_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken: token,
    },
  });

  // 5. Email content
  const mailOptions = {
    from: `"Playwright Automation" <${GOOGLE_USER_EMAIL}>`,
    to: REPORT_RECIPIENT,
    subject: "Playwright Test Execution Report",
    html: `
      <h2>Playwright Test Results</h2>
      <p>Attached: Allure Report & Execution Logs</p>
      <p>Summary: <b>20 Passed | 2 Failed | 0 Skipped</b></p>
    `,
    attachments: [
      ...(fs.existsSync(reportPath)
        ? [{ filename: "allure-report.zip", path: reportPath }]
        : []),
      ...(fs.existsSync(logsPath)
        ? [{ filename: "execution.log", path: logsPath }]
        : []),
    ],
  };

  // 6. Send
  try {const info = await transporter.sendMail(mailOptions);
  console.log("Report email sent:", info.messageId);
} catch (err) {
  console.error('email sending failed', err);
  throw err; 
}}; 
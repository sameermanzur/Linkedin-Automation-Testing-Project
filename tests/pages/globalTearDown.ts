import { sendReportEmail } from "./logAndReport";

/**
 * Global teardown function executed after all tests have finished.
 *
 * It is responsible for triggering the email report generation and sending process.
 * This ensures that stakeholders receive the test results automatically upon completion.
 *
 * @returns A promise that resolves when the email report process is initiated.
 */
async function globalTearDown() {
    console.log('sending email report...')
    await sendReportEmail();    
}

export default globalTearDown;

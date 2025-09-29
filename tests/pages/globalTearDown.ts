import { sendReportEmail } from "./logAndReport";

async function globalTearDown() {
    console.log('sending email report...')
    await sendReportEmail();    
}

export default globalTearDown; 
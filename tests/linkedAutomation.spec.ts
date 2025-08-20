import { test, expect } from '@playwright/test';
import fs from 'fs';
import * as XLSX from 'xlsx'; 
import * as path from 'path';
import dotenv from 'dotenv'; 
dotenv.config(); // Load environment variables at the start

// Path defined 
const recruitersNameFilePath = path.resolve(__dirname,'..','test-data','recruitersNameList.xlsx');

test ('LinkedIn Recruiter Automated Messaging', async ({ page }) => {

  // Test the File Exist 

  if (!fs.existsSync(recruitersNameFilePath)) {
    throw new Error(`Excel file not found at path: ${recruitersNameFilePath}`);
  }

 // Go to LinkedIn login page
  await page.goto('https://www.linkedin.com/login');

  // // Ensure environment variables are set
  // if (!process.env.USERNAME || !process.env.PASSWORD) {
  //   throw new Error('USERNAME or PASSWORD environment variable is not set.');
  // }

  // Log in
  await page.fill('input#username', process.env.USERNAME);
  await page.pause(); 
  await page.fill('input#password', process.env.PASSWORD);
  await page.pause();
  await page.click('button[type="submit"]');

  // Wait for login to complete 
  await page.waitForURL('**/feed/**', {timeout: 10000}); 

   // Read the Excel file 
  const workBook = XLSX.readFile(recruitersNameFilePath);
  const sheetName = workBook.SheetNames[1] || workBook.SheetNames[0];
  const worksheet = workBook.Sheets[sheetName];

  // Parse recruiters data from the worksheet
  const recruitersData: any[] = XLSX.utils.sheet_to_json(worksheet);

  // Loop through each recruiter
  for (const recruiter of recruitersData) {
    const recruiterName = recruiter.name || recruiter.recruiterName || recruiter.Name;

    if (!recruiterName) {
      console.log('Skipping row with no recruiter name');
      continue;
    }

    console.log(`Processing recruiter: ${recruiterName}`);

    // Search for the recruiter
    await page.pause(); 
    await page.locator("//input[@placeholder='Search']").fill(recruiterName);
    await page.keyboard.press('Enter');

    // Wait for search results to load
    await page.waitForTimeout(3000);
    await page.pause();

    // Click on the first person result (adjust selector based on current LinkedIn structure)
    try {
      const searchResult = page.locator('div[data-test-search-result] a').first();
      if (await searchResult.isVisible()) {
        await searchResult.click();
      } else {
        await page.locator('span.entity-result__title-text a').first().click();
      }
    } catch (error) {
      console.log(`Could not find search result for ${recruiterName}, skipping...`);
      continue;
    }

    // Wait for profile to load
    await page.waitForTimeout(3000);
    await page.pause();

    // Click the Message button
    await page.locator('button:has-text("Message")').click();

    // Compose the full message
    const fullMessage =
      `Hi ${recruiterName},` +
      "\n\nA new beginning awaits for me." +
      "\nI want to thank you for your support during my unemployment." +
      `\nYou've been awesome ${recruiterName}. Let's keep in touch.` +
      "\nHave a great week." +
      "\nCheers,\nSameer\n\n";

    // Type and send the full message
    await page.fill('div.msg-form__contenteditable', fullMessage);

    // Send the message
    await page.click('button[data-control-name="send"]');

    // Wait for message to be sent
    await page.waitForTimeout(2000);

    console.log(`Message sent to ${recruiterName}`);
  } 
});

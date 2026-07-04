import { Page, Locator } from '@playwright/test';
import BasePage from './basePage.js'
import type { Row } from './readRecruiterNames.ts';

/**
 * Returns the weekday name in Sydney, Australia for the current date or a future date.
 * @param dayOffset - The number of days to add to the current date. Defaults to 0.
 * @returns The name of the weekday (e.g., "Monday", "Tuesday").
 */
function sydneyWeekday(dayOffset = 0): string {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() + dayOffset);
  return d.toLocaleDateString('en-AU', { weekday: 'long', timeZone: 'Australia/Sydney' });
}

/**
 * Extracts and returns a display name from a Row object.
 * It attempts to find "First Name", "Last Name", or "Name" keys in the row data.
 * @param r - The row object containing recruiter data.
 * @returns The composed full name, or the value of the first key, or 'there' as a fallback.
 */
export function displayName(r: Row): string {
  const keys = Object.keys(r);
  const firstKey = keys.find(k => /first/i.test(k));
  const lastKey = keys.find(k => /last/i.test(k));
  const nameKey = keys.find(k => /name/i.test(k));

  if (firstKey || lastKey) {
    const first = String(r[firstKey ?? ''] ?? '').trim();
    const last = String(r[lastKey ?? ''] ?? '').trim();
    const full = [first, last].filter(Boolean).join(' ').trim();
    if (full) return full;
  }
  if (nameKey) return String(r[nameKey] ?? '').trim();
  if (keys.length > 0) return String(r[keys[0]] ?? '').trim();
  return 'there';
}

/**
 * Dynamically generates a message for a recruiter based on row data.
 * @param r - The row object containing recruiter data.
 * @param dayOffset - Optional day offset for the weekday greeting. Defaults to 0.
 * @returns The formatted message string.
 */
export function buildMessage(r: Row, dayOffset = 0): string {
  const weekday = sydneyWeekday(dayOffset);
  const smile = '🙂';
  const company = String(r['Company'] ?? r['company'] ?? '').trim();
  const companyPart = company ? ` at ${company}` : '';
  return [
    `Hi ${displayName(r)}${companyPart},`,
    `Today is ${weekday}.`,
    '',
    'A new beginning awaits me.',
    'I want to thank you for your support during my unemployment.',
    `You\'ve been awesome ${smile}. Let\'s keep in touch.`,
    'Have a great week.',
    'Best regards,',
    'Sameer'
  ].join('\n');
}

/**
 * ComposeMessagePage class handles the interactions for composing and sending messages on LinkedIn.
 */
export class ComposeMessagePage extends BasePage {
  /** Locator for the 'Message' button on a profile. */
  private readonly clickMessageButton: Locator;
  /** Locator for the message text box. */
  private readonly messageBox: Locator;
  /** Locator for the 'Send' button. */
  private readonly sendButton: Locator;
  /** Locator for the button to close the message box. */
  private readonly closeMessageBox: Locator;

  /**
   * Initializes a new instance of the ComposeMessagePage class.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page);
    this.clickMessageButton= page.locator('button[aria-label^="Message"]'); 
    this.messageBox = page.getByRole('textbox');
    this.sendButton = page.locator("button[type='submit']"); 
    this.closeMessageBox = page.getByRole('button', { name: /^Close your conversation with/i}) // Used Aria label to avoid Dynamic locators 
  }

  /**
   * Clicks the 'Message' button to open the conversation window.
   * @returns A promise that resolves when the button is clicked.
   */
  async clickMessage(){
    await this.b_clickElement(this.clickMessageButton); 
  }
  
  /**
   * Generates and fills the message box with a personalized message.
   * @param row - The row data containing recruiter details.
   * @param dayOffset - Optional day offset for the weekday.
   * @returns A promise that resolves to the generated message text.
   */
  async fillMessageFromRow(row: Row, dayOffset = 0): Promise<string> {
    const text = buildMessage(row, dayOffset);
    try {
      await this.messageBox.fill('');
      await this.messageBox.fill(text);
    } catch {
      await this.messageBox.evaluate((el: HTMLElement) => (el.innerHTML = '')); // To Match the element to execute an argument, this fills the message in the text box
      await this.messageBox.pressSequentially(text);
    }
    return text;
  }

  /**
   * Clicks the 'Send' button to send the composed message.
   * @returns A promise that resolves when the send button is clicked.
   */
  async sendMessage() {
    await this.b_clickElement(this.sendButton);
  }

  /**
   * Closes the message conversation window.
   * @returns A promise that resolves when the close button is clicked.
   */
  async closeMessage(){
    await this.b_clickElement(this.closeMessageBox)
  }
}

export default ComposeMessagePage;

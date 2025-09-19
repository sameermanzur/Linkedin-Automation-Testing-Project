import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';
import type { Row } from './readRecruiterNames';

function sydneyWeekday(dayOffset = 0): string {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() + dayOffset);
  return d.toLocaleDateString('en-AU', { weekday: 'long', timeZone: 'Australia/Sydney' });
}

function displayName(r: Row): string {
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

export class ComposeMessagePage extends BasePage {
  private readonly messageButton: Locator;
  private readonly messageBox: Locator;
  private readonly sendButton: Locator;
  constructor(page: Page) {
    super(page);
    this.messageButton = page.getByRole('button', { name: /message/i });
    this.messageBox = page.getByRole('textbox');
    this.sendButton = page.locator("button[type='submit']"); 
  }

  async openMessage(): Promise<void> {
    if (await this.messageButton.isVisible().catch(() => false)) {
      await this.b_clickElement(this.messageButton);
    }
  }

  async fillMessageFromRow(row: Row, dayOffset = 0): Promise<string> {
    const text = buildMessage(row, dayOffset);
    await this.messageBox.click();
    try {
      await this.messageBox.fill('');
      await this.messageBox.fill(text);
    } catch {
      await this.messageBox.evaluate((el: HTMLElement) => (el.innerHTML = ''));
      await this.messageBox.pressSequentially(text);
    }
    return text;
  }

  async sendMessage() {
    await this.b_clickElement(this.sendButton);
  }
}

export default ComposeMessagePage;
export { displayName };


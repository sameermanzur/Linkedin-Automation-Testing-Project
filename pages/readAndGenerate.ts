import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

export type Recruiter = {
  Name?: string;
  FirstName?: string;
  LastName?: string;
  Company?: string;
};

const TZ = 'Australia/Sydney';

// Resolve a relative path 
function resolvePath(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

// Get weekday 
export function sydneyWeekday(offsetDays = 0, locale = 'en-AU'): string {
  const ts = Date.now() + offsetDays * 24 * 60 * 60 * 1000; // offset in ms
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    timeZone: 'Australia/Sydney',
  }).format(ts);
}

// Read the sheet to recruiter objects
export async function readRecruiters(xlsxPath: string): Promise<Recruiter[]> {
  const abs = resolvePath(xlsxPath);
  try {
    await fs.promises.access(abs);
  } catch {
    throw new Error(`Recruiter list not found at: ${abs}`);
  }
  const buf = await fs.promises.readFile(abs);
  const workbook = XLSX.read(buf, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const ws = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Recruiter>(ws, { defval: '' });

  // keep only rows with at least one name field
  return rows.filter(r =>
    (r.Name && String(r.Name).trim()) ||
    (r.FirstName && String(r.FirstName).trim()) ||
    (r.LastName && String(r.LastName).trim())
  );
}

// Dislpay name with fallback 
function displayName(r: Recruiter): string {
  const fromName = (r.Name ?? '').toString().trim();
  if (fromName) return fromName;
  const first = (r.FirstName ?? '').toString().trim();
  const last  = (r.LastName ?? '').toString().trim();
  return `${first} ${last}`.trim() || 'there';
}

/** Build ONE LinkedIn message for ONE recruiter */
export function buildMessage(r: Recruiter, dayOffset = 0): string {
  const weekday = sydneyWeekday(dayOffset);
  const smile = '😊';
  const company = r.Company?.trim();
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

export async function buildMessagesFromXlsx(xlsxPath: string, dayOffset = 0): Promise<string[]> {
  const recs = await readRecruiters(xlsxPath);
  const out: string[] = [];
  for (const r of recs) out.push(buildMessage(r, dayOffset));
  return out;
}; 


import * as fs from 'fs';
import * as path from 'path';
import readXlsxFile from 'read-excel-file/node';
import { fileURLToPath } from 'url';

export interface Recruiter {
  Name?: string; FirstName?: string; LastName?: string; Company?: string;
}

const TZ = 'Australia/Sydney';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

function resolveFromModule(...parts: string[]) {
  return path.resolve(__dirname, ...parts);
}

function sydneyWeekday(offsetDays = 0, locale = 'en-AU'): string {
  const ts = Date.now() + offsetDays * 86400000;
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: TZ }).format(ts);
}

async function readRecruitersInternal(xlsxPath: string): Promise<Recruiter[]> {
  const abs = path.isAbsolute(xlsxPath) ? xlsxPath : resolveFromModule(xlsxPath);
  await fs.promises.access(abs).catch(() => { throw new Error(`Recruiter list not found at: ${abs}`); });

  // Map headers to your interface fields
  const schema = {
    'Name':      { prop: 'Name',      type: String },
    'FirstName': { prop: 'FirstName', type: String },
    'LastName':  { prop: 'LastName',  type: String },
    'Company':   { prop: 'Company',   type: String },
  } as const;

  const { rows } = await readXlsxFile(abs, { schema }); // rows: Recruiter[]
  return rows.filter(r =>
    (r.Name && r.Name.trim()) ||
    (r.FirstName && r.FirstName.trim()) ||
    (r.LastName && r.LastName.trim())
  );
}

function displayName(r: Recruiter): string {
  const viaName = (r.Name ?? '').toString().trim();
  if (viaName) return viaName;
  const first = (r.FirstName ?? '').toString().trim();
  const last  = (r.LastName ?? '').toString().trim();
  return `${first} ${last}`.trim() || 'there';
}

function buildMessage(r: Recruiter, dayOffset = 0): string {
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

export async function loadRecruiterData(opts?: { xlsxPath?: string; dayOffset?: number }) {
  const xlsxPath = opts?.xlsxPath ?? (process.env.CONTACTS_PATH?.trim() || '../data/recruiterList.xlsx');
  const recs = await readRecruitersInternal(xlsxPath);
  if (recs.length === 0) throw new Error(`No recruiter rows parsed. Path: ${xlsxPath}`);

  const messages = recs.map(r => buildMessage(r, opts?.dayOffset ?? 0));
  const first = recs[0];
  const firstRecruiterName =
    (first.Name?.trim()) ||
    `${(first.FirstName ?? '').trim()} ${(first.LastName ?? '').trim()}`.trim();

  return { recruiters: recs, messages, firstRecruiterName };
}
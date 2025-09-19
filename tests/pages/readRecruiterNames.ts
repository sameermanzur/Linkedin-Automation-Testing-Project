import XLSX from 'xlsx';          
import * as path from 'path';
import * as fs from 'fs';

export type Row = Record<string, any>;

export async function readExcel(
  file: string,
  sheet?: string | number
): Promise<Row[]> {
  const abs = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);

  // Verify file exists and is readable
  try {
    await fs.promises.access(abs, fs.constants.R_OK);
  } catch {
    throw new Error(`Excel not found or not readable: ${abs}`);
  }

  const wb = XLSX.readFile(abs);                   
  const name =
    typeof sheet === 'number' ? wb.SheetNames[sheet] :
    (sheet ?? wb.SheetNames[0]);

  const ws = name ? wb.Sheets[name] : undefined;
  if (!ws) throw new Error(`Sheet not found. Available: ${wb.SheetNames.join(', ')}`);

  return XLSX.utils.sheet_to_json<Row>(ws, { defval: '' });
}

// Build a display name from whatever headers the sheet has
export function deriveName(row: Row): string {
  const keys = Object.keys(row);
  const firstKey = keys.find(k => /(^|[^a-z])first([^a-z]|$)/i.test(k));
  const lastKey  = keys.find(k => /(^|[^a-z])last([^a-z]|$)/i.test(k));
  const nameKey  = keys.find(k => /name/i.test(k));

  if (firstKey && lastKey) {
    const first = String(row[firstKey] ?? '').trim();
    const last  = String(row[lastKey]  ?? '').trim();
    return [first, last].filter(Boolean).join(' ').trim();
  }
  if (nameKey) return String(row[nameKey] ?? '').trim();
  return '';
}

export async function getRecruiterNames(
  filePath: string,
  sheet?: string | number
): Promise<string[]> {
  const rows = await readExcel(filePath, sheet);
  return rows
    .map(deriveName)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export default readExcel;

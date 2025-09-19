//Utilities to read recruiter names from an Excel file
import path from 'path';
import * as xlsx from 'xlsx';

export type Row = Record<string, any>;
// Fileutils to read excel file
export class FileUtils {
  static async readExcelFile(filePath: string): Promise<Row[]> {
    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const wb = xlsx.readFile(abs);
    const rows: Row[] = [];
    for (const name of wb.SheetNames) {
      const sheet = wb.Sheets[name];
      rows.push(...xlsx.utils.sheet_to_json<Row>(sheet, { defval: '' }));
    }
    return rows;
  }
}
// Passing a function to extract names 

function deriveName(row: Row): string {
  const keys = Object.keys(row);
  const firstKey = keys.find(k => /first/i.test(k));
  const lastKey = keys.find(k => /last/i.test(k));
  const nameKey = keys.find(k => /name/i.test(k));

  if (firstKey && lastKey) {
    const first = String(row[firstKey] ?? '').trim();
    const last = String(row[lastKey] ?? '').trim();
    return [first, last].filter(Boolean).join(' ').trim();
  }

  if (nameKey) {
    return String(row[nameKey] ?? '').trim();
  }

  // Fallback: take the first column value as name
  if (keys.length > 0) {
    return String(row[keys[0]] ?? '').trim();
  }
  return '';
}

export async function getRecruiterNames(filePath: string): Promise<string[]> {
  const rows = await FileUtils.readExcelFile(filePath);
  return rows
    .map(deriveName)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}


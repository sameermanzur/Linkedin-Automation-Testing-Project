import XLSX from 'xlsx';          
import * as path from 'path';
import * as fs from 'fs';

/**
 * Type definition for a generic row object from an Excel sheet.
 */
export type Row = Record<string, any>;

/**
 * Reads an Excel file and converts a specific sheet to a JSON array of Row objects.
 * @param file - The path to the Excel file.
 * @param sheet - The name or index of the sheet to read. Defaults to the first sheet.
 * @returns A promise that resolves to an array of Row objects.
 * @throws Will throw an error if the file does not exist or is not readable.
 * @throws Will throw an error if the specified sheet is not found.
 */
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

/**
 * Derives a full display name from a row object based on common header patterns.
 * Looks for keys resembling "First", "Last", or "Name".
 * @param row - The row object containing potential name data.
 * @returns The derived name string, or an empty string if no name could be found.
 */
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

/**
 * Extracts a list of formatted recruiter names from an Excel file.
 * @param filePath - The path to the Excel file.
 * @param sheet - The name or index of the sheet to read.
 * @returns A promise that resolves to an array of recruiter name strings.
 */
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

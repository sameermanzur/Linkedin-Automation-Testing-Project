import *as xlsx from "xlsx"; 
import *as fs from "fs"; 

const sheet = require('xlsx'); 

interface Person {
    Name: string; 
}

// Read Excel file 
const workbook = xlsx.readFile('recruitersNameList.xlsx'); 
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName]; 

// Convert sheet to Json 

const data: Person[] = xlsx.utils.sheet_to_json<Person>(worksheet); 

// Generate messages 
const messages: string[] = data.map(row) => {
    return `Hi ${row.Name}, Hope you are doing well!`
}

const output = messages.join("\n");

fs.writeFileSync("messages.txt", output, "utf8");

console.log("Messages written to messages.txt");


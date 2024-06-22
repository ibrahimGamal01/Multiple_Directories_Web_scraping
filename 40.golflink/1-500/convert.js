const fs = require('fs');
const xlsx = require('xlsx');

// Read the JSON file
const jsonFilePath = '40.golf_courses.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Convert JSON data to a worksheet
const worksheet = xlsx.utils.json_to_sheet(jsonData);

// Create a new workbook and append the worksheet
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Golf Courses');

// Write the workbook to an Excel file
const excelFilePath = '40.golf_courses.xlsx';
xlsx.writeFile(workbook, excelFilePath);

console.log(`Excel file created successfully at ${excelFilePath}`);

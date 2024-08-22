import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from 'fs';
import path from 'path'
import { createObjectCsvWriter } from 'csv-writer';

let dbInstance = null;
const directoryPath = "C:/morazanfiles";
const filePath = path.join(directoryPath, "notas.csv");

export async function connectToDatabase() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: "notas.db",
      driver: sqlite3.Database,
    });
  }
  return dbInstance;
}

export async function initializeDatabase() {
  try {
    const db = await connectToDatabase();
    await db.exec(`CREATE TABLE IF NOT EXISTS notas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT,
            subject TEXT,
            I_partial INTEGER,
            II_partial INTEGER,
            III_partial INTEGER,
            IV_partial INTEGER,
            acumulativo INTEGER,
            FinalGrade INTEGER
        )`);
   
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function closeDatabase() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}

//check if directory exists
const ensureDirectoryExists = (directory)=> {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
const  exportToCSV = async (data)=> {
    try {
        ensureDirectoryExists(directoryPath);
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'student', title: 'Student' },
                { id: 'subject', title: 'Subject' },
                { id: 'I_partial', title: 'I Partial' },
                { id: 'II_partial', title: 'II Partial' },
                { id: 'III_partial', title: 'III Partial' },
                { id: 'IV_partial', title: 'IV Partial' },
                { id: 'acumulativo', title: 'Acumulativo' },
                { id: 'FinalGrade', title: 'Final Grade' }
            ]
        });
        await csvWriter.writeRecords(data);
        console.log(`Data exported to ${filePath}`);
        
    } catch (error) {
        console.log("Could not export csv",csv)
        
    }
 
}
export async function saveDataInDb(
  student,
  subject,
  I_partial,
  II_partial,
  III_partial,
  IV_partial,
  acumulativo,
  FinalGrade
) {

  try {
    const db = await connectToDatabase();
    await initializeDatabase();
    await db.run(
      `INSERT INTO notas (student, subject, I_partial, II_partial, III_partial, IV_partial, acumulativo, FinalGrade) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student,
        subject,
        I_partial,
        II_partial,
        III_partial,
        IV_partial,
        acumulativo,
        FinalGrade,
      ]
    );

    console.log(`Note for ${student} in ${subject} added.`);
    const data = [
      {
        student,
        subject,
        I_partial,
        II_partial,
        III_partial,
        IV_partial,
        acumulativo,
        FinalGrade,
      },
    ];
    await exportToCSV(data);
  } catch (error) {
    console.error("Error saving data to database:", error);
  } finally {
    await closeDatabase();
  }
}

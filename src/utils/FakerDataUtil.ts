import * as fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic import of faker with top-level await
const { faker } = await import('@faker-js/faker');


// Define the type for the user data
interface UserData {
  name: string;
  email: string;
  username: string;
  phone: string;
  age: number;
  address: string;
}

// Function to generate fake user data
const generateUserData = (): UserData => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    phone: faker.phone.number(),
    age: faker.number.int({ min: 18, max: 99 }),
    address: faker.location.country(),
  };
};

// Function to generate an array of fake user data
export const generateTestData = (numRecords: number): UserData[] => {
  const testData: UserData[] = faker.helpers.multiple(generateUserData, {
  count: numRecords});
  return testData;
};

const currentDir = __dirname;
// Go one level above (back to 'src')
const srcDir = path.resolve(currentDir, "..");

// Change to 'config' folder
const testdataDir = path.resolve(srcDir, "testdata");

// Function to export data to JSON file
export const exportToJson = (data: UserData[], fileName: string) => {
  fs.writeFileSync(`${testdataDir}/${fileName}`, JSON.stringify(data, null, 2));
  console.log(`Data exported to JSON file: ${testdataDir}/${fileName}`);
};

// Function to export data to CSV file
export const exportToCsv = (data: UserData[], fileName: string) => {

  const csvWriter = createObjectCsvWriter({
    path: `${testdataDir}/${fileName}`,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'username', title: 'Username' },
      { id: 'phone', title: 'Phone' },
      { id: 'age', title: 'Age' },
      { id: 'address', title: 'Address' },
    ],
  });

 

  csvWriter.writeRecords(data).then(() => {
    console.log(`Data exported to CSV file: ${testdataDir}/${fileName}`);
  });
};

// Generate test data
// const testData = generateTestData(3);

// // Export data to JSON file
// exportToJson(testData, 'testData_en.json');

// // Export data to CSV file
// exportToCsv(testData, 'testData_en.csv');
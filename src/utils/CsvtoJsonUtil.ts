
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSVToJSON = (data: string, delimiter: string = ','): Record<string, string>[] => {
    const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
    return data
      .slice(data.indexOf('\n') + 1)
      .split('\n')
      .map((v: string) => {
        const values = v.split(delimiter);
        return titles.reduce(
          (obj: Record<string, string>, title: string, index: number) => ((obj[title.trim()] = values[index].trim()), obj),
          {}
        );
      });
  };

//   console.log(CSVToJSON('col1,col2\na,b\nc,d'));
// Example usage
const currentDir = __dirname;
// Go one level above (back to 'src')
const srcDir = path.resolve(currentDir, "..");

// Change to 'config' folder
const testdataDir = path.resolve(srcDir, "testdata");
const csvFilePath = `${testdataDir}`;

export const convertCsvFileToJsonFile = (csvFileName: string, jsonFileName: string, delimiter: string = ','): void => {
    try {
      // Read the CSV file
      const csvData = fs.readFileSync(`${testdataDir}/${csvFileName}`, 'utf8');
  
      // Convert CSV to JSON
      const jsonData = CSVToJSON(csvData, delimiter);
  
      // Write JSON data to a new file
      fs.writeFileSync(`${testdataDir}/${jsonFileName}`, JSON.stringify(jsonData, null, 2));
  
      console.log(`Conversion completed. JSON data written to: ${testdataDir}/${jsonFileName}`);
    } catch (error) {
      console.error('Error converting CSV to JSON:', error instanceof Error ? error.message : String(error));
    }
  };

export default {
  convertCsvFileToJsonFile,
  CSVToJSON
};
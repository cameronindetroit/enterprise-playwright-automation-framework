import CryptoJS from "crypto-js";
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CryptoJSUtil = CryptoJS;
const SALT = process.env.SALT || "defaultSalt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentDir = __dirname;
// Go one level up to reach the src directory
const srcDir = path.resolve(currentDir, '..');

// Change to config directory
const configDir = path.resolve(srcDir, 'config');
let envFilePath = `${configDir}/.env`;
if(process.env.NODE_ENV){
    envFilePath = `${configDir}/.env.${process.env.NODE_ENV}`;
}

console.log("Encrypting file at path: ", envFilePath);

export function encryptEnvFile(){
// Read the .env file
    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const envLines = envContent.split('\n');

    //Encrypt values and update the array
    const encryptedLines = envLines.map(line => {
        const [key, value] = line.split('=');
        if(value){
            const encryptedValue = CryptoJSUtil.AES.encrypt(value, SALT).toString();
            return `${key}=${encryptedValue}`;
    }
        return line; // Return the line as is if it doesn't contain '='
    });

    // Join the encrypted lines back into a single string
    const encryptedEnvContent = encryptedLines.join('\n');

    // Write the encrypted content back to the .env file
    fs.writeFileSync(envFilePath, encryptedEnvContent, 'utf-8');
    console.log(`Encrypted .env file at path: ${envFilePath}`);
}

export function decryptEnvFile(){
    // Read the .env file
    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const envLines = envContent.split('\n');
    
    // Decrypt values and update the array
    const decryptedLines = envLines.map(line => {
        const [key, value] = line.split('=');
        if(value){
            const bytes = CryptoJSUtil.AES.decrypt(value, SALT);
            const decryptedValue = bytes.toString(CryptoJSUtil.enc.Utf8);
            return `${key}=${decryptedValue}`;
        }
        return line; // Return the line as is if it doesn't contain '='
    });

    // Join the decrypted lines back into a single string
    const decryptedEnvContent = decryptedLines.join('\n');

    // Write the decrypted content back to the .env file
    fs.writeFileSync(envFilePath, decryptedEnvContent, 'utf-8');
    console.log(`Decrypted .env file at path: ${envFilePath}`);
}
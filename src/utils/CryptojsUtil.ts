// Include Crypto library (make sure to install it via npm if you haven't already)
// You can download it from: https//cryptojs.gitbook.io/docs/
import CryptoJS from "crypto-js";

const CryptoJSUtil = CryptoJS;

// Get the SALT from environment variable
const SALT = process.env.SALT || "defaultSalt";

// Encryption function
export function encrypt(text: string){
    const cipherText = CryptoJSUtil.AES.encrypt(text, SALT).toString();
    return cipherText;
}

// Decryption function
export function decrypt(cipherText: string){
    if (!cipherText) {
        return "";
    }

    try {
        const bytes = CryptoJSUtil.AES.decrypt(cipherText, SALT);
        const originalText = bytes.toString(CryptoJSUtil.enc.Utf8);
        return originalText || "";
    } catch {
        return "";
    }
}

// Example usage:
// const encrypted = encrypt("mySecretPassword");
// const decrypted = decrypt(encrypted);
// console.log("Encrypted:", encrypted);
// console.log("Decrypted:", decrypted);


export default {
    encrypt,
    decrypt
};

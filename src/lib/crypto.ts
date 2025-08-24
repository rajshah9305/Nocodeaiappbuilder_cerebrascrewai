import CryptoJS from 'crypto-js';

/**
 * Encrypts a string using AES.
 * @param text The string to encrypt.
 * @param key The secret key to use for encryption.
 * @returns The encrypted string (ciphertext).
 */
export const encrypt = (text: string, key: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
  return ciphertext;
};

/**
 * Decrypts a string using AES.
 * @param ciphertext The encrypted string to decrypt.
 * @param key The secret key to use for decryption.
 * @returns The decrypted string (plaintext).
 */
export const decrypt = (ciphertext: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

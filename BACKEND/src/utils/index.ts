import * as crypto from 'crypto';

/**
 * Generates a SHA-256 hash for a given string.
 * This is the standard and most secure way to generate hashes in Node.js.
 *
 * @param data - The string or data to hash.
 * @returns The SHA-256 hash as a hexadecimal string.
 */
function generateSHA256(data: string): string {
    // Create a new hash object using the 'sha256' algorithm
    const hash = crypto.createHash('sha256');

    // Update the hash object with the data to be hashed
    // The data is converted to 'utf8' encoding.
    hash.update(data, 'utf8');

    // Calculate the digest of the data and return it in hexadecimal format
    return hash.digest('hex');
}
export default generateSHA256;
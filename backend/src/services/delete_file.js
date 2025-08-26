import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../../index.js';

export const delfile = async (file, email) => {
    try {
        const filePath = path.resolve(__dirname, `src/uploads/${email}`, file);
        console.log('Attempting to delete:', filePath);
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log('Deleted =>', file);
            return { success: true, message: `File ${file} deleted successfully` };
        } catch (accessError) {
            console.log('File Not Found for Deletion =>', filePath);
            return { success: false, message: `File ${file} not found` };
        }
    }
    catch (error) {
        console.log(`Error in Deletion (MayBe Not Found in Storage)=>${file}\t\t\t${error}`);
        return { success: false, message: `Error deleting file: ${error.message}` };
    }
}

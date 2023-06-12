import * as fs from 'fs';
import path from 'path';
import logger from './logger';

/**
 * A helper class for file operations.
 */
export class FileHelper {
	/**
	 * Creates a JSON file with the specified content in the specified folder.
	 * @param folderPath - The path to the folder where the file will be created.
	 * @param fileName - The name of the JSON file to create.
	 * @param jsonContent - The content of the JSON file.
	 */
	createJsonFile(folderPath: string, fileName: string, jsonContent: string): void {
		logger.info(`Creating json file ${fileName}`);
		fs.writeFile(path.join(folderPath, fileName), jsonContent, 'utf8', (error) => {
			if (error) {
				logger.error('Error writing JSON file:', error);
			} else {
				logger.info('JSON config file created successfully!');
			}
		});
	}

	/**
	 * Retrieves the files in the specified folder that match the expected file names.
	 * @param folderPath - The path of the folder.
	 * @param expectedFiles - An array of expected file names.
	 * @returns A promise that resolves to an array of files that match the expected file names.
	 * @throws {Error} If an error occurs during the file retrieval process.
	 */
	async getFilesInFolder(folderPath: string, expectedFiles: string[]): Promise<string[]> {
		logger.info(`Retrieving files from folder ${folderPath}`);
		return new Promise<string[]>((resolve, reject) => {
			fs.readdir(folderPath, (error, files) => {
				if (error) {
					logger.error(`Error retrieving files from folder: ${error}`);
					reject(new Error(`Error retrieving files from folder: ${error}`));
				} else {
					const matchingFiles = files.filter((file) => expectedFiles.includes(file));
					resolve(matchingFiles);
				}
			});
		});
	}
}

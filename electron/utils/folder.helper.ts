import * as fs from 'fs';
import * as path from 'path';
import { LolConfigPath } from './configs';
import logger from './logger';

/**
 * Helper class for folder-related operations.
 */
export class FolderHelper {
	/**
	 * Ensures that a folder exists at the specified path.
	 * @param folderPath - The path of the folder to check.
	 * @returns True if the folder exists, false otherwise.
	 */
	ensureFolderExists(folderPath: string): boolean {
		return fs.existsSync(folderPath);
	}

	/**
	 * Creates a folder at the specified path asynchronously.
	 * @param folderPath - The path where the folder should be created.
	 * @returns A promise that resolves when the folder creation is complete.
	 */
	async createFolder(folderPath: string): Promise<void> {
		fs.mkdir(folderPath, { recursive: true }, (err) => {
			if (err) {
				logger.error('Error creating folder:', err);
			} else {
				logger.info('Folder created:', folderPath);
			}
		});
	}

	/**
	 * Deletes a folder at the specified path asynchronously.
	 * @param folderPath - The path of the folder to delete.
	 */
	async deleteFolder(folderPath: string): Promise<void> {
		fs.rmdir(folderPath, { recursive: true }, (err) => {
			if (err) {
				logger.error('Error deleting folder:', err);
			} else {
				logger.info('Folder deleted:', folderPath);
			}
		});
	}

	/**
	 * Renames a folder from the old path to the new path asynchronously.
	 * @param oldPath - The old path of the folder.
	 * @param newPath - The new path of the folder.
	 */
	async renameFolder(oldPath: string, newPath: string): Promise<void> {
		fs.rename(oldPath, newPath, (err) => {
			if (err) {
				logger.error('Error updating folder:', err);
			} else {
				logger.info('Folder updated:', oldPath, newPath);
			}
		});
	}

	/**
	 * Gets the names of all folders in the specified directory asynchronously.
	 * @param folderPath - The path of the directory.
	 * @returns An array of folder names.
	 */
	async getFoldersNameInDirectory(folderPath: string): Promise<string[]> {
		const folderNames: string[] = [];
		fs.readdirSync(folderPath).forEach((element) => {
			const elementPath = path.join(folderPath, element);
			const stat = fs.statSync(elementPath);

			if (stat.isDirectory()) {
				folderNames.push(element);
			}
		});

		return folderNames;
	}

	/**
	 * Checks if the folder contains the expected files asynchronously.
	 * @param folderPath - The path of the folder to check.
	 * @param files - The files in the folder.
	 * @param expectedFiles - The expected files in the folder.
	 */
	async checkFolderFiles(folderPath: string, files: string[], expectedFiles: string[]): Promise<void> {
		if (files.length !== expectedFiles.length) {
			logger.error(`Some files are missing or extra in the folder '${folderPath}'`);
			return;
		}

		const missingFiles: string[] = [];
		expectedFiles.forEach((expectedFile) => {
			if (!files.includes(expectedFile)) {
				missingFiles.push(expectedFile);
			}
		});

		if (missingFiles.length > 0) {
			logger.error(`The folder '${folderPath}' does not contain the file(s): ${missingFiles.join(', ')}`);
			return;
		}
	}

	/**
	 * Validates the League of Legends configuration path.
	 * @returns A promise that resolves to the validated configuration path.
	 * @throws {Error} If the League of Legends installation path is not set, the folder does not exist, or the Config folder is missing.
	 */
	async validateLolConfigPath(): Promise<string> {
		if (LolConfigPath == null) {
			throw new Error(`The default League of Legends installation path has not been set or the folder does not exist!`);
		}

		if (!this.ensureFolderExists(LolConfigPath)) {
			throw new Error(`The folder given does not exist. Please check your League of Legends installation path.`);
		}

		const foldersNameList = await this.getFoldersNameInDirectory(LolConfigPath);

		if (!foldersNameList.includes('Config')) {
			throw new Error(
				`The Config folder does not exist. Please check your League of Legends installation path. Path given : ${LolConfigPath}`,
			);
		}

		return path.join(LolConfigPath, 'Config');
	}
}

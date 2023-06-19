import * as fs from 'fs';
import * as path from 'path';
import logger from '../../utils/logger';
import { exec } from 'child_process';
import { ElectronStoreHelper } from './electron-store.helper';

/**
 * Helper class for folder-related operations.
 */
export class FolderHelper {
	private electronStoreHelper: ElectronStoreHelper = ElectronStoreHelper.getInstance();
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
				throw err;
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
		fs.rm(folderPath, { recursive: true }, (err) => {
			if (err) {
				logger.error('Error deleting folder:', err);
				throw err;
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
				throw err;
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
			logger.warn(`Some files are missing or extra in the folder '${folderPath}'`);
		}

		const missingFiles: string[] = [];
		expectedFiles.forEach((expectedFile) => {
			if (!files.includes(expectedFile)) {
				missingFiles.push(expectedFile);
			}
		});

		if (missingFiles.length > 0) {
			logger.warn(`The folder '${folderPath}' does not contain the file(s): ${missingFiles.join(', ')}`);
			return;
		}
	}

	/**
	 * Opens a folder in the default file explorer.
	 * @param folderPath - The path of the folder to open.
	 * @throws {Error} If the command execution fails.
	 */
	openFolderInExplorer(folderPath: string): void {
		let command = `start "" "${folderPath}"`;
		exec(command, (error) => {
			if (error) {
				throw new Error(`Failed to open folder: ${error.message}`);
			}
		});
	}

	/**
	 * Validates the League of Legends configuration path.
	 * @returns A promise that resolves to the validated configuration path.
	 * @throws {Error} If the League of Legends installation path is not set, the folder does not exist, or the Config folder is missing.
	 */
	validateLolConfigPath(): string {
		const lolConfigPath = this.electronStoreHelper.get('lolConfigPath');
		if (lolConfigPath == null) {
			throw new Error(`The default League of Legends installation path has not been set or the folder does not exist!`);
		}

		if (!this.ensureFolderExists(lolConfigPath)) {
			throw new Error(`The folder given does not exist. Please check your League of Legends installation path.`);
		}

		if (!['League of Legends', 'Config'].every((el) => lolConfigPath.includes(el))) {
			throw new Error(`The config path seems to be wrong. Be sure that it includes the Config folder.`);
		}

		return lolConfigPath;
	}
}

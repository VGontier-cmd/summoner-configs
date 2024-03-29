import * as fs from 'fs';
import * as path from 'path';
import { FileHelper } from '../../helpers/file.helper';
import { FolderHelper } from '../../helpers/folder.helper';
import { Profile } from '../profile-manager/profile.interface';
import * as expectedFiles from '../types/expected-files';
import { FolderNotFoundException } from './file-explorer.exceptions';
import logger from '../../../utils/logger';
import { Config } from '../../../utils/configs';

/**
 * Manages folders and files for profiles in a root folder.
 */
export class FileExplorerManager {
	/**
	 * The root folder path.
	 */
	private readonly rootFolderPath: string;
	/**
	 * The folder helper instance.
	 */
	private folderHelper: FolderHelper;
	/**
	 * The file helper instance.
	 */
	private fileHelper: FileHelper;

	/**
	 * Creates an instance of `FolderManager`.
	 * @param rootFolderPath The root folder path.
	 */
	constructor(rootFolderPath: string) {
		this.rootFolderPath = path.join(rootFolderPath, Config.DEFAULT_FOLDER_NAME);

		// Initialize file / folder helpers
		this.folderHelper = new FolderHelper();
		this.fileHelper = new FileHelper();

		// Create project root folder if not existing
		if (!this.folderHelper.ensureFolderExists(this.rootFolderPath)) this.folderHelper.createFolder(this.rootFolderPath);
	}

	/**
	 * Retrieves the folder path for the specified profile.
	 * @param profile The profile.
	 * @throws {FolderNotFoundException} If the folder for the profile does not exist.
	 * @returns The profile's folder path.
	 */
	async getProfileFolderPath(profile: Profile) {
		const folderPath = path.join(this.rootFolderPath, this.getProfileFolderName(profile));

		if (!this.folderHelper.ensureFolderExists(folderPath))
			throw new FolderNotFoundException(`No folder has been found for the given profile : ${profile.name} `);
		return folderPath;
	}

	/**
	 * Deletes the folder associated with the specified profile.
	 * @param profile The profile.
	 */
	async deleteProfileFolder(profile: Profile) {
		const folderPath = path.join(this.rootFolderPath, this.getProfileFolderName(profile));
		await this.folderHelper.deleteFolder(folderPath);
	}

	/**
	 * Updates the folder associated with the specified old profile to the new profile.
	 * @param oldProfile The old profile.
	 * @param profile The new profile.
	 */
	async updateProfileFolder(oldProfile: Profile, profile: Profile) {
		const oldFolderName = path.join(this.rootFolderPath, this.getProfileFolderName(oldProfile));
		const newFolderName = path.join(this.rootFolderPath, this.getProfileFolderName(profile));

		this.folderHelper.renameFolder(oldFolderName, newFolderName);
	}

	/**
	 * Retrieves profiles from the root folder path.
	 * @returns A promise that resolves to an array of Profile objects.
	 */
	async retrieveProfiles(): Promise<Profile[]> {
		const profilesList: Profile[] = [];
		const foldersName = await this.folderHelper.getFoldersNameInDirectory(this.rootFolderPath);

		foldersName.forEach((folderName) => {
			const folderPath = path.join(this.rootFolderPath, folderName);
			const files = fs.readdirSync(folderPath);

			const missingFiles: string[] = [];
			expectedFiles.managerFolderFiles.forEach((expectedFile) => {
				if (!files.includes(expectedFile)) {
					missingFiles.push(expectedFile);
				}
			});

			if (missingFiles.length > 0) {
				logger.error(`The folder '${folderName}' does not contain the file(s) : ${missingFiles.join(', ')}`);
				return;
			}

			// Load profile details file
			let profileDetails: { id: string; name: string; color: string; isFav: boolean } | undefined;
			const profileFolderPath = path.join(this.rootFolderPath, folderName);
			try {
				const data = fs.readFileSync(path.join(profileFolderPath, 'profileDetails.json'), 'utf8');
				profileDetails = JSON.parse(data);
			} catch (err) {
				logger.error(`Error while trying to get the profile details for folder ${this.rootFolderPath}`, err);
			}

			if (profileDetails) {
				logger.info(`Loading profileDetails for profile ${profileDetails.name}`);
				const { id, name, color, isFav } = profileDetails;
				profilesList.push({
					id: id,
					name: name,
					color: color,
					isFav: isFav,
				});
			}
		});
		return profilesList;
	}

	/**
	 * Imports the profile from the client by copying the necessary files from the client's configuration folder.
	 * @param profile - The profile object to be imported.
	 */
	async importFromClient(profile: Profile) {
		const lolConfigPath = this.folderHelper.validateLolConfigPath(); // Validate lol config path or throw error

		const files = await this.fileHelper.getFilesInFolder(lolConfigPath, expectedFiles.clientConfigRequiredFiles);

		await this.folderHelper.checkFolderFiles(lolConfigPath, files, expectedFiles.clientConfigRequiredFiles);

		this.folderHelper.createFolder(path.join(this.rootFolderPath, this.getProfileFolderName(profile))); // Create profile folder

		for (const fileName of [...expectedFiles.clientConfigRequiredFiles, ...expectedFiles.clientConfigOptionalFiles]) {
			const sourceFilePath = path.join(lolConfigPath, fileName);
			const destinationFilePath = this.getDestinationFilePath(profile, fileName);

			try {
				if (!fs.existsSync(sourceFilePath)) {
					console.info(`The file '${fileName}' does not exist in the Config folder`);
					return;
				}
				await fs.promises.copyFile(sourceFilePath, destinationFilePath);
				logger.info(`Copied file: ${fileName}`);
			} catch (error) {
				throw new Error(`Error copying files from folder: ${sourceFilePath}, to folder: ${destinationFilePath}`);
			}
		}

		await this.createProfileSettingsFile(profile);
	}

	/**
	 * Exports the profile to the client by copying the necessary files to the client's configuration folder.
	 * @param profile - The profile object to be exported.
	 */
	async exportProfileToClient(profile: Profile) {
		const lolConfigPath = this.folderHelper.validateLolConfigPath(); // Validate lol config path or throw error
		const profileFolderPath = await this.getProfileFolderPath(profile);

		const files = await this.fileHelper.getFilesInFolder(profileFolderPath, [
			...expectedFiles.clientConfigRequiredFiles,
			...expectedFiles.clientConfigOptionalFiles,
		]);

		await this.folderHelper.checkFolderFiles(profileFolderPath, files, [
			...expectedFiles.clientConfigRequiredFiles,
			...expectedFiles.clientConfigOptionalFiles,
		]);

		files.forEach(async (fileName) => {
			if (fileName !== 'profileDetails.json') {
				const sourceFilePath = path.join(profileFolderPath, fileName);
				const destinationFilePath = path.join(lolConfigPath, fileName);

				try {
					// Delete the file id it's existing in the destination folder to force the override
					if (fs.existsSync(destinationFilePath)) {
						// Delete the destination file
						fs.unlinkSync(destinationFilePath);
					}

					fs.copyFileSync(sourceFilePath, destinationFilePath);
					logger.info(`Copied file: ${fileName}`);
				} catch (error) {
					logger.error(error);
					throw new Error(`Error copying file : ${fileName}`);
				}
			}
		});
	}

	/**
	 * Retrieves the destination file path for the given profile and file name.
	 * @param profile - The profile object containing the details.
	 * @param fileName - The name of the file.
	 * @returns The destination file path.
	 */
	getDestinationFilePath(profile: Profile, fileName: string): string {
		return path.join(path.join(this.rootFolderPath, this.getProfileFolderName(profile)), fileName);
	}

	/**
	 * Creates a profile settings file for the given profile.
	 * @param profile - The profile object containing the details to be saved.
	 */
	async createProfileSettingsFile(profile: Profile) {
		const jsonContent = JSON.stringify(profile, null, 2);
		this.fileHelper.createJsonFile(
			path.join(this.rootFolderPath, this.getProfileFolderName(profile)),
			'profileDetails.json',
			jsonContent,
		);
	}

	/**
	 * Opens the profile folder in the default file explorer.
	 * @param profile - A promise that resolves to the Profile object.
	 */
	async openProfileFolderInFileExplorer(profile: Profile) {
		this.folderHelper.openFolderInExplorer(await this.getProfileFolderPath(await profile));
	}

	/**
	 * Generates the folder name for the given profile.
	 * @param profile - The profile object.
	 * @returns The folder name for the profile.
	 */
	private getProfileFolderName(profile: Profile) {
		return `${profile.name}_${profile.id}`;
	}
}

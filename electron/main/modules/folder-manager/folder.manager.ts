import * as fs from 'fs';
import * as path from 'path';
import { DefaultFolderName } from '../../../utils/configs';
import { FileHelper } from '../../../utils/file.helper';
import { FolderHelper } from '../../../utils/folder.helper';
import { Profile } from '../profile-manager/profile.interface';
import * as expectedFiles from '../types/expected-files';
import { FolderNotFoundException } from './folder.exceptions';

/**
 * Manages folders and files for profiles in a root folder.
 */
export class FolderManager {
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
		this.rootFolderPath = path.join(rootFolderPath, DefaultFolderName ?? 'LolSettingsManager');

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
		const folderPath = path.join(this.rootFolderPath, `${profile.name}_${profile.id}`);

		if (!this.folderHelper.ensureFolderExists(folderPath))
			throw new FolderNotFoundException(`No folder has been found for the given profile : ${profile.name} `);
		return folderPath;
	}

	/**
	 * Deletes the folder associated with the specified profile.
	 * @param profile The profile.
	 */
	async deleteProfileFolder(profile: Profile) {
		const folderName = this.getProfileFolderName(profile);
		await this.folderHelper.deleteFolder(folderName);
	}

	/**
	 * Updates the folder associated with the specified old profile to the new profile.
	 * @param oldProfile The old profile.
	 * @param profile The new profile.
	 */
	async updateProfileFolder(oldProfile: Profile, profile: Profile) {
		const oldFolderName = this.getProfileFolderName(oldProfile);
		const newFolderName = this.getProfileFolderName(profile);
		await this.folderHelper.renameFolder(oldFolderName, newFolderName);
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

			if (files.length !== expectedFiles.managerFolder.length) {
				console.error(`Some files are missing or extra in the folder '${folderName}'`);
				return;
			}

			const missingFiles: string[] = [];
			expectedFiles.managerFolder.forEach((expectedFile) => {
				if (!files.includes(expectedFile)) {
					missingFiles.push(expectedFile);
				}
			});

			if (missingFiles.length > 0) {
				console.error(`The folder '${folderName}' does not contain the file(s) : ${missingFiles.join(', ')}`);
				return;
			}

			// Load profile details file
			let profileDetails;
			const profileFolderPath = path.join(this.rootFolderPath, folderName)
			fs.readFile(path.join(profileFolderPath, 'profileDetails.json'), 'utf8', (err, data) => {
				if (err) {
					console.error(`Error while trying to get the profile details for folder ${this.rootFolderPath}`, err);
				} else {
					profileDetails = JSON.parse(data);
				}
			});

			if (profileDetails) {
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
		const lolConfigPath = await this.folderHelper.validateLolConfigPath(); // Validate lol config path or throw error

		const files = await this.fileHelper.getFilesInFolder(lolConfigPath, expectedFiles.clientConfigFolder);

		await this.folderHelper.checkFolderFiles(lolConfigPath, files, expectedFiles.clientConfigFolder);

		this.folderHelper.createFolder(path.join(this.rootFolderPath,this.getProfileFolderName(profile))) // Create profile folder 

		for (const fileName of expectedFiles.clientConfigFolder) {
			const sourceFilePath = path.join(lolConfigPath, fileName);
			const destinationFilePath = this.getDestinationFilePath(profile, fileName);
		
			try {
				await fs.promises.copyFile(sourceFilePath, destinationFilePath);
				console.log(`Copied file: ${fileName}`);
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
		const lolConfigPath = await this.folderHelper.validateLolConfigPath(); // Validate lol config path or throw error
		const profileFolderPath = await this.getProfileFolderPath(profile);

		const files = await this.fileHelper.getFilesInFolder(profileFolderPath, expectedFiles.managerFolder);

		await this.folderHelper.checkFolderFiles(profileFolderPath, files, expectedFiles.managerFolder);

		expectedFiles.clientConfigFolder.forEach(async (fileName) => {
			if (fileName !== 'profileDetails.json') {
				const sourceFilePath = path.join(profileFolderPath, fileName);
				const destinationFilePath = path.join(lolConfigPath, fileName);

				try {
					fs.copyFileSync(sourceFilePath, destinationFilePath);
					console.log(`Copied file: ${fileName}`);
				} catch (error) {
					console.error(`Error copying file : ${fileName}`, error);
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
	 * Generates the folder name for the given profile.
	 * @param profile - The profile object.
	 * @returns The folder name for the profile.
	 */
	private getProfileFolderName(profile : Profile) {
		return `${profile.name}_${profile.id}`
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

	
}

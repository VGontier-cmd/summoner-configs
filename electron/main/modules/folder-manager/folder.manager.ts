import * as fs from 'fs';
import * as path from 'path';
import { DefaultFolderName } from '../../../utils/configs';
import { FileHelper } from '../../../utils/file.helper';
import { FolderHelper } from '../../../utils/folder.helper';
import { Profile } from '../profile-manager/profile.interface';
import * as expectedFiles from '../types/expected-files';
import { FolderNotFoundException } from './folder.exceptions';

export class FolderManager {
	private readonly rootFolderPath: string;
	private folderHelper: FolderHelper;
	private fileHelper: FileHelper;

	constructor(rootFolderPath: string) {
		this.rootFolderPath = path.join(rootFolderPath, DefaultFolderName ?? 'LolSettingsManager');

		// Initialize file / folder helpers
		this.folderHelper = new FolderHelper();
		this.fileHelper = new FileHelper();

		// Create project root folder if not existing
		if (!this.folderHelper.ensureFolderExists(this.rootFolderPath)) this.folderHelper.createFolder(this.rootFolderPath);
	}

	async getProfileFolderPath(profile: Profile) {
		const folderPath = path.join(this.rootFolderPath, `${profile.name}_${profile.id}`);

		if (!this.folderHelper.ensureFolderExists(folderPath))
			throw new FolderNotFoundException(`No folder has been found for the given profile : ${profile.name} `);
		return folderPath;
	}

	async deleteProfileFolder(profile: Profile) {
		const folderName = `${profile.name}_${profile.id}`;
		await this.folderHelper.deleteFolder(folderName);
	}

	async updateProfileFolder(oldProfile: Profile, profile: Profile) {
		const oldFolderName = `${oldProfile.name}_${oldProfile.id}`;
		const newFolderName = `${profile.name}_${profile.id}`;
		await this.folderHelper.renameFolder(oldFolderName, newFolderName);
	}

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
			fs.readFile(path.join(this.rootFolderPath, 'profileDetails.json'), 'utf8', (err, data) => {
				if (err) {
					console.error(`Error while trying to get the profile details for folder ${this.rootFolderPath}`);
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

	async importFromClient(profile: Profile) {
		const lolConfigPath = await this.folderHelper.validateLolConfigPath(); // Validate lol config path or throw error

		const files = await this.fileHelper.getFilesInFolder(lolConfigPath, expectedFiles.clientConfigFolder);

		await this.folderHelper.checkFolderFiles(lolConfigPath, files, expectedFiles.clientConfigFolder);

		expectedFiles.clientConfigFolder.forEach((fileName) => {
			const sourceFilePath = path.join(lolConfigPath, fileName);
			const destinationFilePath = this.getDestinationFilePath(profile, fileName);
			fs.copyFile(sourceFilePath, destinationFilePath, (error) => {
				if (error) {
					new Error(`Error copying files from folder: ${sourceFilePath}, to folder : ${destinationFilePath}`);
				} else {
					console.log(`Copied file: ${fileName}`);
				}
			});
		});

		this.createProfileSettingsFile(profile);
	}

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

	getDestinationFilePath(profile: Profile, fileName: string): string {
		return path.join(path.join(this.rootFolderPath, `${profile.name}_${profile.id}`), fileName);
	}

	createProfileSettingsFile(profile: Profile) {
		const jsonContent = JSON.stringify(profile, null, 2);
		this.fileHelper.createJsonFile(
			path.join(this.rootFolderPath, `${profile.name}_${profile.id}`),
			'profileDetails.json',
			jsonContent,
		);
	}
}

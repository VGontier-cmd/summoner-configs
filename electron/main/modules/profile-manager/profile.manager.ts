import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { FolderManager } from '../folder-manager/folder.manager';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileNotFoundException } from './profile.exceptions';
import { Profile } from './profile.interface';
import logger from '../../../utils/logger';
import { UUID } from 'node:crypto';

/**
 * Manages profiles and their operations.
 */
export class ProfileManager {
	private profileList: Profile[];
	private folderManager: FolderManager; // Manages the creation of folders/files on the disk

	/**
	 * Creates an instance of `ProfileManager`.
	 * @param rootFolderPath - The root folder path for profile management.
	 */
	constructor(rootFolderPath: string) {
		this.folderManager = new FolderManager(rootFolderPath);
		this.profileList = [];
		this.initializeProfileList();
	}

	/**
	 * Initializes the profile list by retrieving profiles from the folder manager asynchronously.
	 */
	async initializeProfileList(): Promise<void> {
		logger.info(`Initializing ProfileList ...`);
		this.profileList = await this.folderManager.retrieveProfiles();
		logger.info(`Initialization complete.`);
	}

	/**
	 * Creates a new profile.
	 * @param createProfile - The profile data for creation.
	 */
	async create(createProfile: CreateProfileDto): Promise<void> {
		logger.info(`Creating a new Profile`);
		/**
		 * Validates the createProfile object using class-validator library.
		 * @param errors - An array of validation errors, if any.
		 */

		const validateProfile = new CreateProfileDto({
			name: createProfile.name,
			color: createProfile.color,
			isFav: createProfile.isFav,
		});

		validate(validateProfile, { enableDebugMessages: true })
			.then(async (errors) => {
				logger.info(errors);
				if (errors.length > 0) {
					logger.error('Validation errors:', errors);
					throw new Error('A validation error occured when trying to create the profile');
				} else {
					console.log(createProfile);
					const newProfile: Profile = {
						id: uuidv4(),
						name: validateProfile.name,
						color: validateProfile.color,
						isFav: validateProfile.isFav,
					};
					await this.folderManager.importFromClient(newProfile); // Import settings files from the League of Legends client
					this.profileList.push(newProfile); // Push the new profile if no error occurred during the file import
					console.log(this.profileList);
				}
			})
			.catch((error) => {
				logger.error('Validation error:', error);
			});
	}

	/**
	 * Retrieves all profiles.
	 * @returns An array of profiles.
	 */
	async getAll(): Promise<Profile[]> {
		return this.profileList;
	}

	/**
	 * Retrieves a profile by ID.
	 * @param id - The ID of the profile to retrieve.
	 * @returns The retrieved profile.
	 * @throws {ProfileNotFoundException} If the profile is not found.
	 */
	async get(id: UUID): Promise<Profile> {
		const profile = this.profileList.find((profile) => {
			return profile.id === id;
		});
		if (!profile) {
			throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
		}
		return profile;
	}

	/**
	 * Deletes a profile by ID.
	 * @param id - The ID of the profile to delete.
	 * @throws {ProfileNotFoundException} If the profile is not found.
	 */
	async delete(id: string): Promise<void> {
		logger.info(`Deleting profile with id : ${id}`);
		const profileIndex = this.profileList.findIndex((profile) => profile.id === id);

		if (profileIndex === -1) {
			throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
		}

		await this.folderManager.deleteProfileFolder(this.profileList[profileIndex]);
		this.profileList.splice(profileIndex, 1);
	}

	/**
	 * Updates a profile by ID.
	 * @param id - The ID of the profile to update.
	 * @param updateProfileDto - The updated profile data.
	 * @throws {ProfileNotFoundException} If the profile is not found.
	 */
	async update(id: UUID, updateProfileDto: UpdateProfileDto): Promise<void> {
		logger.info(`Updating profile with id : ${id}`);
		/**
		 * Validates the updateProfileDto object using class-validator library.
		 * @param errors - An array of validation errors, if any.
		 */

		const validateProfile = new UpdateProfileDto({
			id: id,
			name: updateProfileDto.name,
		});
		console.log('profile', validateProfile);
		validate(validateProfile, { enableDebugMessages: true })
			.then(async (errors) => {
				logger.info(errors);
				if (errors.length > 0) {
					logger.error('Validation errors:', errors);
					throw new Error('A validation error occured when trying to update the profile');
				} else {
					const profileIndex = this.profileList.findIndex((profile) => profile.id === id);

					if (profileIndex === -1) {
						throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
					}

					const updatedProfile: Profile = {
						...this.profileList[profileIndex],
						...updateProfileDto,
					};

					await this.folderManager.updateProfileFolder(this.profileList[profileIndex], updatedProfile); // Update the folder and the config file
					this.profileList[profileIndex] = updatedProfile; // Update the profile list accordingly with the updated profile
					this.folderManager.createProfileSettingsFile(updatedProfile); // Edit the config json file accordingly
				}
			})
			.catch((error) => {
				logger.error('Validation error:', error);
			});
	}

	/**
	 * Opens the profile folder in the file explorer.
	 *
	 * @param {UUID} profileId - The ID of the profile.
	 * @returns A Promise that resolves when the profile folder is opened in the file explorer.
	 */
	async openProfileFolderInFileExplorer(profileId: UUID) {
		const profile = this.get(profileId);
		this.folderManager.openProfileFolderInFileExplorer(await profile);
	}

	/**
	 * Exports the profile with the specified ID to the client.
	 *
	 * @param {UUID} profileId - The ID of the profile to export.
	 * @returns A Promise that resolves when the export is completed successfully.
	 */
	async exportToClient(profileId: UUID) {
		const profileToExport = await this.get(profileId);
		this.folderManager.exportProfileToClient(profileToExport);
	}
}

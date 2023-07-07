import { ValidationError, validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { FileExplorerManager } from '../folder-manager/file-explorer.manager';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileNotFoundException } from './profile.exceptions';
import { Profile } from './profile.interface';
import logger from '../../../utils/logger';
import { UUID } from 'node:crypto';
import { Config } from '../../../utils/configs';

/**
 * Manages profiles and their operations.
 */
export class ProfileManager {
	private profileList: Profile[];
	private fileExplorerManager: FileExplorerManager; // Manages the creation of folders/files on the disk

	/**
	 * Creates an instance of `ProfileManager`.
	 * @param rootFolderPath - The root folder path for profile management.
	 */
	constructor(rootFolderPath: string) {
		this.fileExplorerManager = new FileExplorerManager(rootFolderPath);
		this.profileList = [];
		this.initializeProfileList();
	}

	/**
	 * Initializes the profile list by retrieving profiles from the folder manager asynchronously.
	 */
	async initializeProfileList(): Promise<void> {
		logger.info(`Initializing ProfileList ...`);
		this.profileList = await this.fileExplorerManager.retrieveProfiles();
		logger.info(`Initialization complete.`);
	}

	/**
	 * Creates a new profile.
	 * @param createProfile - The profile data for creation.
	 */
	async create(createProfile: CreateProfileDto): Promise<Profile> {
		// Check if the profile limit is not reach
		if (this.profileList.length >= Config.PROFILE_CREATION_LIMIT) {
			throw new Error(`Profiles limit reach: [${Config.PROFILE_CREATION_LIMIT}]`);
		}
		return new Promise<Profile>((resolve, reject) => {
			logger.info(`Creating a new Profile`);

			const validateProfile = new CreateProfileDto({
				name: createProfile.name,
				color: createProfile.color,
				isFav: createProfile.isFav,
			});

			validate(validateProfile)
				.then(async (errors) => {
					if (errors.length > 0) {
						const errorMessage = this._buildValidationErrorMessage(errors);
						logger.error(`Validation error(s): ${errorMessage}`);
						throw new Error(errorMessage);
					} else {
						const newProfile: Profile = {
							id: uuidv4(),
							name: validateProfile.name,
							color: validateProfile.color,
							isFav: validateProfile.isFav,
						};

						await this.fileExplorerManager.importFromClient(newProfile);
						this.profileList.push(newProfile);

						resolve(newProfile); // Resolve the promise with the created profile
					}
				})
				.catch((error) => {
					logger.error('Validation error:', error);
					reject(error); // Reject the promise with the validation error
				});
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
	async delete(id: string): Promise<Profile> {
		return new Promise<Profile>(async (resolve, reject) => {
			try {
				logger.info(`Deleting profile with id: ${id}`);
				const profileIndex = this.profileList.findIndex((profile) => profile.id === id);

				if (profileIndex === -1) {
					throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
				}

				const deletedProfile = this.profileList[profileIndex];

				await this.fileExplorerManager.deleteProfileFolder(deletedProfile);
				this.profileList.splice(profileIndex, 1);

				resolve(deletedProfile); // Resolve the promise with the deleted profile
			} catch (error) {
				reject(error); // Reject the promise with any errors that occurred
			}
		});
	}

	/**
	 * Updates a profile by ID.
	 * @param id - The ID of the profile to update.
	 * @param updateProfileDto - The updated profile data.
	 * @throws {ProfileNotFoundException} If the profile is not found.
	 */
	async update(id: UUID, updateProfileDto: UpdateProfileDto): Promise<Profile> {
		return new Promise<Profile>((resolve, reject) => {
			logger.info(`Updating profile with id: ${id}`);

			const validateProfile = new UpdateProfileDto({
				id: id,
				name: updateProfileDto.name,
			});

			validate(validateProfile)
				.then(async (errors) => {
					if (errors.length > 0) {
						const errorMessage = this._buildValidationErrorMessage(errors);
						logger.error(`Validation error(s): ${errorMessage}`);
						throw new Error(errorMessage);
					} else {
						const profileIndex = this.profileList.findIndex((profile) => profile.id === id);

						if (profileIndex === -1) {
							throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
						}

						const updatedProfile: Profile = {
							...this.profileList[profileIndex],
							...updateProfileDto,
						};

						// Update folder name
						await this.fileExplorerManager.updateProfileFolder(this.profileList[profileIndex], updatedProfile);

						// Update list
						this.profileList[profileIndex] = updatedProfile;

						// Edit profile settings json file
						await this.fileExplorerManager.createProfileSettingsFile(updatedProfile);

						resolve(updatedProfile); // Resolve the promise with the updated profile
					}
				})
				.catch((error) => {
					logger.error('Validation error:', error);
					reject(error); // Reject the promise with the validation error
				});
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
		this.fileExplorerManager.openProfileFolderInFileExplorer(await profile);
	}

	/**
	 * Exports the profile with the specified ID to the client.
	 *
	 * @param {UUID} profileId - The ID of the profile to export.
	 * @returns A Promise that resolves when the export is completed successfully.
	 */
	async exportToClient(profileId: UUID) {
		const profileToExport = await this.get(profileId);
		await this.fileExplorerManager.exportProfileToClient(profileToExport);
	}

	/**
	 * Builds the validation error message from an array of ValidationErrors.
	 *
	 * @param {ValidationError[]} errors - The array of ValidationErrors.
	 * @returns {string} - The built validation error message.
	 */
	private _buildValidationErrorMessage(errors: ValidationError[]) {
		return errors
			.map((error) => {
				if (!error.constraints) {
					return '';
				}
				const constraintsArray = Object.keys(error.constraints).map((key) => [key, error.constraints?.[key]]);
				return constraintsArray.map(([key, value]) => value).join(', ');
			})
			.join('');
	}
}

import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { FolderManager } from '../folder-manager/folder.manager';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileNotFoundException } from './profile.exceptions';
import { Profile } from './profile.interface';

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
		this.profileList = await this.folderManager.retrieveProfiles();
	}

	/**
	 * Creates a new profile.
	 * @param createProfile - The profile data for creation.
	 */
	async create(createProfile: CreateProfileDto): Promise<void> {
		/**
		 * Validates the createProfile object using class-validator library.
		 * @param errors - An array of validation errors, if any.
		 */
		validate(createProfile)
			.then(async (errors) => {
				if (errors.length > 0) {
					console.log('Validation errors:', errors);
				} else {
					const newProfile: Profile = {
						id: uuidv4(),
						name: createProfile.name,
						color: createProfile.color ?? '#000000',
						isFav: createProfile.isFav ?? false,
					};

					await this.folderManager.importFromClient(newProfile); // Import settings files from the League of Legends client
					this.profileList.push(newProfile); // Push the new profile if no error occurred during the file import
				}
			})
			.catch((error) => {
				console.log('Validation error:', error);
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
	async get(id: string): Promise<Profile> {
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
	async update(id: string, updateProfileDto: UpdateProfileDto): Promise<void> {
		/**
		 * Validates the updateProfileDto object using class-validator library.
		 * @param errors - An array of validation errors, if any.
		 */
		validate(updateProfileDto)
			.then(async (errors) => {
				if (errors.length > 0) {
					console.log('Validation errors:', errors);
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
				}
			})
			.catch((error) => {
				console.log('Validation error:', error);
			});
	}
}

import { BrowserWindow, app, ipcMain } from 'electron';
import { ProfileNotFoundException } from '../profile-manager/profile.exceptions';
import { ProfileManager } from '../profile-manager/profile.manager';

export function ipcManager(win: BrowserWindow, rootFolderPath: string) {
	/**
	 * Creates an instance of the ProfileManager class with the specified root folder path.
	 *
	 * @param {string} rootFolderPath - The path of the root folder.
	 * @returns {ProfileManager} The ProfileManager instance.
	 */
	const profileManager = new ProfileManager(rootFolderPath);

	/**
	 * Listens to the 'close-win' event from the render window and quits the application.
	 */
	ipcMain.on('close-win', () => {
		app.quit();
	});

	/**
	 * Listens to the 'minimize-win' event from the render window and minimizes the window if available.
	 */
	ipcMain.on('minimize-win', () => {
		if (win) {
			win.minimize();
		}
	});

	/**
	 * Listens to the 'minimize-win' event from the render window and minimizes the window if available.
	 */
	ipcMain.on('minimize-win', () => {
		if (win) {
			win.minimize();
		}
	});

	/**
	 * Event: ipcmain-profile-update
	 * Args:
	 *   - _event: Event - The IPC event object (unused in the function).
	 *   - id: string - The ID of the profile to update.
	 *   - updateProfileDto: UpdateProfileDto - The updated profile data.
	 * @returns {Promise<string>} A promise that resolves to a success message with the updated profile ID.
	 * @throws {Error} If an error occurs during the profile update process.
	 */
	ipcMain.handle('ipcmain-profile-update', async (_event, id, updateProfileDto) => {
		try {
			await profileManager.update(id, updateProfileDto);
			return `Success updating profile with id: ${id}`;
		} catch (error: any) {
			throw new Error(error.message);
		}
	});

	/**
	 * Event: ipcmain-profile-create
	 * Args:
	 *   - event: Event - The IPC event object.
	 *   - createProfile: CreateProfileDto - The data for creating a new profile.
	 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile creation.
	 * @throws {Error} If an error occurs during the profile creation process.
	 */
	ipcMain.handle('ipcmain-profile-create', async (event, createProfile) => {
		try {
			await profileManager.create(createProfile);
			return 'Success creating profile';
		} catch (error: any) {
			throw new Error(error.message);
		}
	});

	/**
	 * Event: ipcmain-profile-delete
	 * Args:
	 *   - event: Event - The IPC event object.
	 *   - id: string - The ID of the profile to delete.
	 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile deletion.
	 * @throws {Error} If an error occurs during the profile deletion process.
	 */
	ipcMain.handle('ipcmain-profile-delete', async (event, id) => {
		try {
			await profileManager.delete(id);
			return `Success deleting profile with id: ${id}`;
		} catch (error: any) {
			throw new Error(error.message);
		}
	});

	/**
	 * Event: ipcmain-profile-get
	 * Args:
	 *   - id: string - The ID of the profile to retrieve.
	 * @returns {Profile} The profile object with the specified ID.
	 * @throws {ProfileNotFoundException} If the profile with the specified ID is not found.
	 */
	ipcMain.handle('ipcmain-profile-get', (_event, id) => {
		try {
			const profile = profileManager.get(id);
			return profile;
		} catch (error: any) {
			throw new Error(error.message);
		}
	});

	/**
	 * Event: ipcmain-profile-get-all
	 * @returns {Profile[]} An array of all profiles.
	 */
	ipcMain.handle('ipcmain-profile-get-all', () => {
		const profiles = profileManager.getAll();
		return profiles;
	});
}

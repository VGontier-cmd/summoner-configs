import { BrowserWindow, app, ipcMain } from 'electron';
import { ProfileManager } from '../profile-manager/profile.manager';
import { UUID } from 'node:crypto';

/**
 * Sets up the IPC event handlers for communication between the main process and the renderer process.
 * @param {BrowserWindow} win - The Electron BrowserWindow instance.
 * @param {string} rootFolderPath - The path of the root folder.
 */
export function ipcManager(win: BrowserWindow, rootFolderPath: string) {
	/**
	 * Creates an instance of the ProfileManager class with the specified root folder path.
	 * @param {string} rootFolderPath - The path of the root folder.
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
	 * Event: ipcmain-profile-update
	 * @param {Event} _event - The IPC event object (unused in the function).
	 * @param {string} id - The ID of the profile to update.
	 * @param {UpdateProfileDto} updateProfileDto - The updated profile data.
	 * @returns {Promise<string>} A promise that resolves to a success message with the updated profile ID.
	 * @throws {Error} If an error occurs during the profile update process.
	 */
	ipcMain.handle('ipcmain-profile-update', async (_event, id, updateProfileDto) => {
		try {
			await profileManager.update(id, updateProfileDto);
			return `Success updating profile with id: ${id}`;
		} catch (error) {
			throw error;
		}
	});

	/**
	 * Event: ipcmain-profile-create
	 * @param {Event} event - The IPC event object.
	 * @param {CreateProfileDto} createProfile - The data for creating a new profile.
	 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile creation.
	 * @throws {Error} If an error occurs during the profile creation process.
	 */
	ipcMain.handle('ipcmain-profile-create', async (event, createProfile) => {
		try {
			await profileManager.create(createProfile);
			return 'Success creating profile';
		} catch (error) {
			throw error;
		}
	});

	/**
	 * Event: ipcmain-profile-delete
	 * @param {Event} event - The IPC event object.
	 * @param {string} id - The ID of the profile to delete.
	 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile deletion.
	 * @throws {Error} If an error occurs during the profile deletion process.
	 */
	ipcMain.handle('ipcmain-profile-delete', async (event, id) => {
		try {
			await profileManager.delete(id);
			return `Success deleting profile with id: ${id}`;
		} catch (error) {
			throw error;
		}
	});

	/**
	 * Event: ipcmain-profile-get
	 * @param {Event} _event - The IPC event object.
	 * @param {string} id - The ID of the profile to retrieve.
	 * @returns {Profile} The profile object with the specified ID.
	 * @throws {ProfileNotFoundException} If the profile with the specified ID is not found.
	 */
	ipcMain.handle('ipcmain-profile-get', (_event, id) => {
		try {
			const profile = profileManager.get(id);
			return profile;
		} catch (error) {
			throw error;
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

	/**
	 * Event: ipcmain-profile-open-folder-in-file-explorer
	 * @param {Event}_event -The IPC event object.
	 * @param {string} id - The id of the profile to open the folder for.
	 */
	ipcMain.on('ipcmain-profile-open-folder-in-file-explorer', (_event, id: UUID) => {
		profileManager.openProfileFolderInFileExplorer(id);
	});
}

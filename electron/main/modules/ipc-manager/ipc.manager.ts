import { BrowserWindow, app, ipcMain } from 'electron';
import { ProfileManager } from '../profile-manager/profile.manager';
import { UUID } from 'node:crypto';
import { ElectronStoreHelper } from '../../helpers/electron-store.helper';
import { UpdateProfileDto } from '../profile-manager/dto/update-profile.dto';
import { CreateProfileDto } from '../profile-manager/dto/create-profile.dto';
import logger from '../../../utils/logger';
import { isLeagueClientOpen } from '../league-client-manager/league-client.manager';

/**
 * Object containing IPC event handlers for communication between the main process and the renderer process.
 */
export const ipcManager = {
	/**
	 * Sets up the IPC event handlers.
	 * @param {BrowserWindow} win - The Electron BrowserWindow instance.
	 * @param {string} rootFolderPath - The path of the root folder.
	 */
	setup(win: BrowserWindow, rootFolderPath: string): void {
		const profileManager = new ProfileManager(rootFolderPath);
		const electronStore = ElectronStoreHelper.getInstance();

		if (win === null || profileManager === null) {
			// Handle the case where either win or profileManager is null
			throw new Error('IPCManager setup failed. Null references detected.');
		}

		/**
		 * Event: close-win
		 * Listens to the 'close-win' event from the render window and quits the application.
		 */
		ipcMain.on('close-win', () => {
			app.quit();
		});

		/**
		 * Event: minimize-win
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
		 * @param {UUID} id - The ID of the profile to update.
		 * @param {UpdateProfileDto} updateProfileDto - The updated profile data.
		 * @returns {Promise<string>} A promise that resolves to a success message with the updated profile ID.
		 * @throws {Error} If an error occurs during the profile update process.
		 */
		ipcMain.handle('ipcmain-profile-update', async (_event, id: UUID, updateProfileDto: UpdateProfileDto) => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.update(id, updateProfileDto) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-create
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {CreateProfileDto} createProfile - The data for creating a new profile.
		 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile creation.
		 * @throws {Error} If an error occurs during the profile creation process.
		 */
		ipcMain.handle('ipcmain-profile-create', async (_event, createProfile: CreateProfileDto) => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.create(createProfile) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-delete
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {UUID} id - The ID of the profile to delete.
		 * @returns {Promise<string>} A promise that resolves to 'Success' on successful profile deletion.
		 * @throws {Error} If an error occurs during the profile deletion process.
		 */
		ipcMain.handle('ipcmain-profile-delete', async (_event, id: UUID) => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.delete(id) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-get
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {UUID} id - The ID of the profile to retrieve.
		 * @returns {Profile} The profile object with the specified ID.
		 * @throws {Error} If an error occurs during the profile retrieval process.
		 */
		ipcMain.handle('ipcmain-profile-get', async (_event, id: UUID) => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.get(id) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-get-all
		 * @returns {Profile[]} An array of all profiles.
		 */
		ipcMain.handle('ipcmain-profile-get-all', async () => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.getAll() });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-config-path-register
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {string} path - The path to register in the Electron Store.
		 * @returns {boolean} Returns true on successful registration, false otherwise.
		 */
		ipcMain.handle('ipcmain-config-path-register', (_event, path: string) => {
			try {
				return JSON.stringify({ success: true, data: electronStore.set('lolConfigPath', path) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-config-path-get
		 * @returns {boolean} Returns true if the userConfigPath exists in the Electron Store, false otherwise.
		 */
		ipcMain.handle('ipcmain-config-path-get', () => {
			try {
				return JSON.stringify({ success: true, data: electronStore.get('lolConfigPath') });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-export
		 * Exports the profile configs with the specified ID to the client.
		 * @param {Event} event - The IPC event object.
		 * @param {UUID} id - The ID of the profile to export.
		 * @returns {boolean} A Promise that resolves to `true` if the export is successful, or `false` otherwise.
		 */
		ipcMain.handle('ipcmain-profile-export', async (_event, id: UUID) => {
			try {
				return JSON.stringify({ success: true, data: await profileManager.exportToClient(id) });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-open-folder-in-file-explorer
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {UUID} id - The ID of the profile to open the folder for.
		 */
		ipcMain.handle('ipcmain-league-client-get-status', async (_event) => {
			try {
				return JSON.stringify({ success: true, isOpen: await isLeagueClientOpen() });
			} catch (error: any) {
				logger.error(error);
				return { success: false, error: error.message };
			}
		});

		/**
		 * Event: ipcmain-profile-open-folder-in-file-explorer
		 * @param {Event} _event - The IPC event object (unused in the function).
		 * @param {UUID} id - The ID of the profile to open the folder for.
		 */
		ipcMain.on('ipcmain-profile-open-folder-in-file-explorer', (_event, id: UUID) => {
			profileManager.openProfileFolderInFileExplorer(id);
		});
	},
};

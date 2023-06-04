import { BrowserWindow, app, ipcMain } from 'electron';

export function ipcManager(win: BrowserWindow) {
	// We listen to the 'close-win' event from the render window
	ipcMain.on('close-win', () => {
		app.quit();
	});

	// We listen to the 'minimize-win' event from the render window
	ipcMain.on('minimize-win', () => {
		if (win) {
			win.minimize();
		}
	});
}

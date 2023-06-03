import { BrowserWindow, app, ipcMain } from 'electron';

export function ipcManager(win: BrowserWindow) {
	// On écoute l'événement 'close-win' depuis la fenêtre de rendu
	ipcMain.on('close-win', () => {
		app.quit();
	});

	// On écoute l'événement 'minimize-win' depuis la fenêtre de rendu
	ipcMain.on('minimize-win', () => {
		if (win) {
			win.minimize();
		}
	});
}

/**
 * The list of files in the client configuration folder.
 */
export const clientConfigRequiredFiles: string[] = ['game.cfg', 'PersistedSettings.json'];
export const clientConfigOptionalFiles: string[] = ['input.ini'];

/**
 * The list of files in the manager folder.
 * Includes the profileDetails.json file and files from the client configuration folder.
 */
export const managerFolderFiles: string[] = ['profileDetails.json', ...clientConfigRequiredFiles];

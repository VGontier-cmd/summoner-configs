/**
 * The list of files in the client configuration folder.
 */
export const clientConfigFolder: string[] = ['game.cfg', 'input.ini', 'PersistedSettings.json'];

/**
 * The list of files in the manager folder.
 * Includes the profileDetails.json file and files from the client configuration folder.
 */
export const managerFolder: string[] = ['profileDetails.json', ...clientConfigFolder];

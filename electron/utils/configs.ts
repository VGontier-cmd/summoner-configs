import * as dotenv from 'dotenv';

/**
 * Loads environment variables from the .env file.
 */
dotenv.config();

/**
 * The default folder name retrieved from the environment variables.
 */
export const DefaultFolderName: string | undefined = process.env.DEFAULT_FOLDER_NAME;

/**
 * The path to the League of Legends configuration file.
 * This property is currently set to null.
 */
export const LolConfigPath: null = null;

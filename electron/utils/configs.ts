import * as dotenv from 'dotenv';

/**
 * Loads environment variables from the .env file.
 */
dotenv.config();

export namespace Config {
	export const DEFAULT_FOLDER_NAME: string = process.env.DEFAULT_FOLDER_NAME || 'LolSettingsManager';
	export const PROFILE_CREATION_LIMIT: number = 15;
}
/**
 * The default folder name retrieved from the environment variables.
 */

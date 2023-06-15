import * as dotenv from 'dotenv';

/**
 * Loads environment variables from the .env file.
 */
dotenv.config();

/**
 * The default folder name retrieved from the environment variables.
 */
export const DefaultFolderName: string | undefined = process.env.DEFAULT_FOLDER_NAME;

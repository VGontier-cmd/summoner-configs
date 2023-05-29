import * as dotenv from 'dotenv';

dotenv.config(); // Load env var from the .env file

export default {
  DefaultFolderName: process.env.DEFAULT_FOLDER_NAME ?? '',
};

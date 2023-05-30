import * as fs from 'fs';
import * as path from 'path';
import config from '../../../utils/configs';
import { Profile } from '../profile-manager/profile.interface';
import * as expectedFiles from '../types/expected.files';

export class FolderManager {
  private readonly rootFolderPath: string;

  constructor(rootFolderPath: string) {
    this.rootFolderPath = path.join(
      rootFolderPath,
      config.DefaultFolderName ?? 'LolSettingsManager',
    );
    if (!this.ensureFolderExists(this.rootFolderPath))
      this.createFolder(this.rootFolderPath); // Create project root folder if not existing
  }

  ensureFolderExists(path: string): boolean {
    return fs.existsSync(path);
  }

  createFolder(path: string) {
    fs.mkdirSync(path);
  }

  getFoldersNameInDirectory(folderPath: string): string[] {
    const folderNames: string[] = [];
    fs.readdirSync(folderPath).forEach((element) => {
      const elementPath = path.join(folderPath, element);
      const stat = fs.statSync(elementPath);

      if (stat.isDirectory()) {
        folderNames.push(element);
      }
    });

    return folderNames;
  }

  retrieveProfiles(): Profile[] {
    const profilesList: Profile[] = [];
    const foldersName = this.getFoldersNameInDirectory(this.rootFolderPath);

    foldersName.forEach((folderName) => {
      const folderPath = path.join(this.rootFolderPath, folderName);
      const files = fs.readdirSync(folderPath);

      if (files.length !== expectedFiles.managerFolder.length) {
        console.error(
          `Some files are missing or extra in the folder '${folderName}'`,
        );
        return;
      }

      const missingFiles: string[] = [];
      expectedFiles.managerFolder.forEach((expectedFile) => {
        if (!files.includes(expectedFile)) {
          missingFiles.push(expectedFile);
        }
      });

      if (missingFiles.length > 0) {
        console.error(
          `The folder '${folderName}' does not contain the file(s) : ${missingFiles.join(
            ', ',
          )}`,
        );
        return;
      }

      // Load profile details file
      let profileDetails;
      fs.readFile(
        path.join(this.rootFolderPath, 'profileDetails.json'),
        'utf8',
        (err, data) => {
          if (err)
            console.error(
              `Error while trying to get the profile details for folder ${this.rootFolderPath}`,
            );
          profileDetails = JSON.parse(data);
        },
      );

      if (profileDetails) {
        const { id, name, color, isFav } = profileDetails;
        profilesList.push({
          id: id,
          name: name,
          color: color,
          isFav: isFav,
        });
      }
    });

    return profilesList;
  }

  deleteProfileFolder(profile: Profile) {
    const folderName = `${profile.name}_${profile.id}`;
    fs.rmdir(folderName, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting folder:', err);
      } else {
        console.log('Folder deleted:', folderName);
      }
    });
  }

  updateProfileFolder(oldProfile: Profile, profile: Profile) {
    const oldFolderName = `${oldProfile.name}_${oldProfile.id}`;
    const newFolderName = `${profile.name}_${profile.id}`;

    fs.rename(oldFolderName, newFolderName, (err) => {
      if (err) {
        console.error('Error updating folder:', err);
      } else {
        console.log('Folder updating:', oldFolderName, newFolderName);
      }
    });
  }

  //TODO
  importFromClient(profile: Profile) {
    if (config.LolConfigPath == null) {
      throw new Error(
        'The default League of Legends installation path as not been set already or the folder doesnt exist!',
      );
    }

    if (!this.ensureFolderExists(config.LolConfigPath)) {
      throw new Error(
        'The folder given does not exist, please check your League of Legends installation path',
      );
    }

    const foldersNameList = this.getFoldersNameInDirectory(
      config.LolConfigPath,
    );

    if (!foldersNameList.includes('Config'))
      throw new Error(
        'The Config folder does not exist, please check your League of Legends installation path',
      );

    const clientConfigFolder = path.join(config.LolConfigPath, 'Config');
    const files = fs.readdirSync(clientConfigFolder);

    if (files.length !== expectedFiles.clientConfigFolder.length) {
      console.error(
        `Some files are missing or extra in the folder '${clientConfigFolder}'`,
      );
      return;
    }

    const missingFiles: string[] = [];
    expectedFiles.clientConfigFolder.forEach((expectedFile) => {
      if (!files.includes(expectedFile)) {
        missingFiles.push(expectedFile);
      }
    });

    if (missingFiles.length > 0) {
      console.error(
        `The folder '${clientConfigFolder}' does not contain the file(s) : ${missingFiles.join(
          ', ',
        )}`,
      );
      return;
    }

    // Export lol configs from the config client folder to the manager folder
    expectedFiles.clientConfigFolder.forEach((fileName) => {
      const sourceFilePath = path.join(clientConfigFolder, fileName);
      const destinationFilePath = path.join(
        path.join(this.rootFolderPath, `${profile.name}_${profile.id}`),
        fileName,
      );

      try {
        fs.copyFileSync(sourceFilePath, destinationFilePath);
        console.log(`Copied file: ${fileName}`);
      } catch (error) {
        console.error(`Error copying file: ${fileName}`);
        console.error(error);
      }
    });

    // Create the settings file for the profiles
    const jsonContent = JSON.stringify(profile, null, 2);
    fs.writeFile(
      path.join(
        path.join(this.rootFolderPath, `${profile.name}_${profile.id}`),
        'profileDetails.json',
      ),
      jsonContent,
      'utf8',
      (error) => {
        if (error) {
          console.error('Error writing JSON file:', error);
        } else {
          console.log('JSON config file created successfully!');
        }
      },
    );
  }

  exportProfileToClient(profile: Profile) {}
}

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

  importFromClient(profile: Profile) {
    this.validateLolConfigPath();

    const clientConfigFolder = path.join(config.LolConfigPath ?? '', 'Config');
    const files = this.getFilesInFolder(
      clientConfigFolder,
      expectedFiles.clientConfigFolder,
    );

    this.checkFolderFiles(
      clientConfigFolder,
      files,
      expectedFiles.clientConfigFolder,
    );

    expectedFiles.clientConfigFolder.forEach((fileName) => {
      const sourceFilePath = path.join(clientConfigFolder, fileName);
      const destinationFilePath = this.getDestinationFilePath(
        profile,
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

    this.createProfileSettingsFile(profile);
  }

  getProfileFolderPath(profile: Profile) {
    return path.join(this.rootFolderPath, `${profile.name}_${profile.id}`);
  }

  exportProfileToClient(profile: Profile) {
    const lolConfigPath = this.validateLolConfigPath();

    const clientConfigFolder = path.join(lolConfigPath, 'Config');
    const profileFolderPath = this.getProfileFolderPath(profile);

    this.ensureFolderExists(profileFolderPath);
    const files = this.getFilesInFolder(
      profileFolderPath,
      expectedFiles.managerFolder,
    );

    this.checkFolderFiles(
      profileFolderPath,
      files,
      expectedFiles.managerFolder,
    );

    expectedFiles.clientConfigFolder.forEach((fileName) => {
      if (fileName !== 'profileDetails.json') {
        const sourceFilePath = path.join(profileFolderPath, fileName);
        const destinationFilePath = path.join(clientConfigFolder, fileName);

        try {
          fs.copyFileSync(sourceFilePath, destinationFilePath);
          console.log(`Copied file: ${fileName}`);
        } catch (error) {
          console.error(`Error copying file: ${fileName}`);
          console.error(error);
        }
      }
    });
  }

  // Helper functions

  validateLolConfigPath(): string {
    if (config.LolConfigPath == null) {
      throw new Error(
        'The default League of Legends installation path has not been set or the folder does not exist!',
      );
    }

    if (!this.ensureFolderExists(config.LolConfigPath)) {
      throw new Error(
        'The folder given does not exist. Please check your League of Legends installation path.',
      );
    }

    const foldersNameList = this.getFoldersNameInDirectory(
      config.LolConfigPath,
    );
    if (!foldersNameList.includes('Config')) {
      throw new Error(
        'The Config folder does not exist. Please check your League of Legends installation path.',
      );
    }

    return config.LolConfigPath;
  }

  getFilesInFolder(folderPath: string, expectedFiles: string[]): string[] {
    const files = fs.readdirSync(folderPath);
    return files.filter((file) => expectedFiles.includes(file));
  }

  checkFolderFiles(
    folderPath: string,
    files: string[],
    expectedFiles: string[],
  ) {
    if (files.length !== expectedFiles.length) {
      console.error(
        `Some files are missing or extra in the folder '${folderPath}'`,
      );
      return;
    }

    const missingFiles: string[] = [];
    expectedFiles.forEach((expectedFile) => {
      if (!files.includes(expectedFile)) {
        missingFiles.push(expectedFile);
      }
    });

    if (missingFiles.length > 0) {
      console.error(
        `The folder '${folderPath}' does not contain the file(s): ${missingFiles.join(
          ', ',
        )}`,
      );
      return;
    }
  }

  getDestinationFilePath(profile: Profile, fileName: string): string {
    return path.join(
      path.join(this.rootFolderPath, `${profile.name}_${profile.id}`),
      fileName,
    );
  }

  createProfileSettingsFile(profile: Profile) {
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
}

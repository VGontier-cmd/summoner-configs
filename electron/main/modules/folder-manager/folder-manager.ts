import * as fs from 'fs';
import * as path from 'path';
import folder from '../../../utils/configs';
import { CreateProfileDto } from '../profile-manager/dto/create-profile-dto';
import { Profile } from '../profile-manager/profile.interface';

export class FolderManager {
  private readonly rootFolderPath: string;

  constructor(rootFolderPath: string) {
    this.rootFolderPath = path.join(
      rootFolderPath,
      folder.DefaultFolderName ?? 'LolSettingsManager',
    );
    this.ensureFolderExists();
  }

  ensureFolderExists() {
    if (!fs.existsSync(this.rootFolderPath)) {
      // Create folder if it not existing
      fs.mkdirSync(this.rootFolderPath);
    }
  }

  getFoldersNameInDirectory(): string[] {
    const folderNames: string[] = [];
    fs.readdirSync(this.rootFolderPath).forEach((element) => {
      const elementPath = path.join(this.rootFolderPath, element);
      const stat = fs.statSync(elementPath);

      if (stat.isDirectory()) {
        folderNames.push(element);
      }
    });

    return folderNames;
  }

  retrieveProfiles(): Profile[] {
    const profilesList: Profile[] = [];
    const foldersName = this.getFoldersNameInDirectory();

    this.ensureFolderExists();

    foldersName.forEach((folderName) => {
      const folderPath = path.join(this.rootFolderPath, folderName);
      const files = fs.readdirSync(folderPath);

      const expectedFiles = [
        'profileDetails.json',
        'game.cfg',
        'input.ini',
        'PersistedSettings.json',
      ];

      if (files.length !== expectedFiles.length) {
        console.error(
          `Some files are missing or extra in the folder '${folderName}'`,
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
              `Error while trying to get the profile details for folder ${folder}`,
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
  importFromClient(createProfileDto: CreateProfileDto) {}
  exportProfileToClient(profile: Profile) {}
}

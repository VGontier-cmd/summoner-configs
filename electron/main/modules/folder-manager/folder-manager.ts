import * as fs from 'fs';
import * as path from 'path';
import folder from '../../../utils/configs';
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
          gameSettingsFilePath: path.join(this.rootFolderPath, 'game.cfg'),
          keybindsFilePath: path.join(this.rootFolderPath, 'input.ini'),
          persistedSettingsFilePath: path.join(
            this.rootFolderPath,
            'PersistedSettings.json',
          ),
          color: color,
          isFav: isFav,
        });
      }
    });

    return profilesList;
  }
}

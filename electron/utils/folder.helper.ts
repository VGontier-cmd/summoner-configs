import * as fs from 'fs';
import * as path from 'path';
import config from './configs';

export class FolderHelper {
  ensureFolderExists(path: string): boolean {
    return fs.existsSync(path);
  }

  createFolder(path: string) {
    fs.mkdirSync(path);
  }

  deleteFolder(folderPath: string) {
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting folder:', err);
      } else {
        console.log('Folder deleted:', folderPath);
      }
    });
  }

  renameFolder(oldPath: string, newPath: string) {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error updating folder:', err);
      } else {
        console.log('Folder updating:', oldPath, newPath);
      }
    });
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

    return path.join(config.LolConfigPath, 'Config');
  }
}

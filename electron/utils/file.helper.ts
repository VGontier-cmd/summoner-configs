import * as fs from 'fs';
import path from 'path';

export class FileHelper {
  createJsonFile(folderPath: string, fileName: string, jsonContent: string) {
    fs.writeFile(
      path.join(folderPath, fileName),
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

  getFilesInFolder(folderPath: string, expectedFiles: string[]): string[] {
    const files = fs.readdirSync(folderPath);
    return files.filter((file) => expectedFiles.includes(file));
  }
}

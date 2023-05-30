import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { FolderManager } from '../folder-manager/folder-manager';
import { CreateProfileDto } from './dto/create-profile-dto';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { ProfileNotFoundException } from './profile.exceptions';
import { Profile } from './profile.interface';
// TODO : Add folder implementation to save file on creation / update and on delete

export class ProfileManager {
  private profileList: Profile[];
  private folderManager: FolderManager; // Allow to manage the creation of folders / files on the disk

  constructor(rootFolderPath: string) {
    this.folderManager = new FolderManager(rootFolderPath);
    this.profileList = this.folderManager.retrieveProfiles();
  }

  create(createProfile: CreateProfileDto) {
    validate(createProfile)
      .then((errors) => {
        if (errors.length > 0) {
          console.log('Validation errors:', errors);
        } else {
          const newProfile: Profile = {
            id: uuidv4(),
            name: createProfile.name,
            color: createProfile.color,
            isFav: createProfile.isFav ?? false,
          };

          this.folderManager.importFromClient(newProfile);
          this.profileList.push(newProfile);
        }
      })
      .catch((error) => {
        console.log('Validation error:', error);
      });
  }

  getAll(): Profile[] {
    return this.profileList;
  }

  get(id: string): Profile {
    const profile = this.profileList.find((profile) => {
      return profile.id === id;
    });
    if (!profile) {
      throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
    }
    return profile;
  }

  delete(id: string) {
    const profileIndex = this.profileList.findIndex(
      (profile) => profile.id === id,
    );

    if (profileIndex === -1) {
      throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
    }

    this.folderManager.deleteProfileFolder(this.profileList[profileIndex]);
    this.profileList.splice(profileIndex, 1);
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Profile {
    const profileIndex = this.profileList.findIndex(
      (profile) => profile.id === id,
    );

    if (profileIndex === -1) {
      throw new ProfileNotFoundException(`Profile not found with ID: ${id}`);
    }

    const updatedProfile: Profile = {
      ...this.profileList[profileIndex],
      ...updateProfileDto,
    };

    this.profileList[profileIndex] = updatedProfile;
    return updatedProfile;
  }
}

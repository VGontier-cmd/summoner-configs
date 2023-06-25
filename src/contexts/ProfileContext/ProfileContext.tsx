import { toast } from '@/components/ui/use-toast';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useLeagueContext } from '../LeagueContext/LeagueContext';
import { CreateProfileDto } from 'electron/main/modules/profile-manager/dto/create-profile.dto';
import { UpdateProfileDto } from 'electron/main/modules/profile-manager/dto/update-profile.dto';

interface ProfileProviderProps {
	children: ReactNode;
}

const ProfileContext = createContext<any>(null);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
	const { configPath } = useLeagueContext();
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
	const [editingProfileId, setEditingProfileId] = useState<string | null>();
	const [openNewProfile, setOpenNewProfile] = useState(false);

	const loadProfiles = () => {
		ipcRenderer.invoke('ipcmain-profile-get-all').then((result) => {
			const resultParsed = JSON.parse(result);
			if (resultParsed.success) {
				setProfiles(resultParsed.data);
			} else {
				toast({
					description: `Error: ${resultParsed.error}`,
				});
			}
		});
	};

	const handleProfileClick = (profileId: string | null): void => {
		setSelectedProfileId(selectedProfileId === profileId ? null : profileId);
	};

	const handleEditDialogOpenChange = (isOpen: boolean, profileId: string) => {
		if (isOpen) {
			setEditingProfileId(profileId);
		} else {
			setEditingProfileId(null);
		}
	};

	const addProfile = (profile: Profile) => {
		if (!profile) return;
		setProfiles((profiles) => [...profiles, profile]);
		console.log('profile added:', profile);
	};

	const updateProfile = (updatedProfile: Profile) => {
		if (!updatedProfile) return;
		setProfiles((prevProfiles) =>
			prevProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)),
		);
		console.log('profile updated:', updatedProfile);
	};

	const deleteProfile = (profile: Profile) => {
		if (!profile) return;
		setProfiles((prevProfiles) => prevProfiles.filter((p) => p.id !== profile.id));
		console.log('profile deleted:', profile);
	};

	const handleOpenProfileInFileExplorer = (profile: Profile) => {
		if (!profile) return;
		ipcRenderer.send('ipcmain-profile-open-folder-in-file-explorer', profile.id);
	};

	const handleExportSelectedProfile = () => {
		if (!selectedProfileId) return;

		if (!configPath) {
			toast({
				description: 'You must register the config path in your settings',
			});
			return;
		}

		ipcRenderer.invoke('ipcmain-profile-export', selectedProfileId).then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				toast({
					description: 'Profile exported successfully !',
				});
				console.log('exported profile:', parsedResult.data);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
			}
		});
	};

	const validateProfile = (profile: CreateProfileDto | UpdateProfileDto) => {
		if (!profile.name) {
			throw new Error('The profile name cannot be empty...');
		}

		if (profile.name.length > 20) {
			throw new Error('The profile name length cannot exceed 20 characters...');
		}
	};

	return (
		<ProfileContext.Provider
			value={{
				profiles,
				openNewProfile,
				selectedProfileId,
				editingProfileId,
				setSelectedProfileId,
				setEditingProfileId,
				loadProfiles,
				addProfile,
				deleteProfile,
				updateProfile,
				setOpenNewProfile,
				handleProfileClick,
				handleEditDialogOpenChange,
				handleExportSelectedProfile,
				handleOpenProfileInFileExplorer,
				validateProfile,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfileContext = () => {
	return useContext(ProfileContext);
};

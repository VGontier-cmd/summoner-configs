import { toast } from '@/components/ui/use-toast';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ProfileProviderProps {
	children: ReactNode;
}

const ProfileContext = createContext<any>(null);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [configPath, setConfigPath] = useState<string | null>(null);
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
	const [editingProfileId, setEditingProfileId] = useState<string | null>();
	const [openNewProfile, setOpenNewProfile] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);

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
		if (!updateProfile) return;
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

	const handleConfigPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setConfigPath(event.target.value);
	};

	const handleGetConfigPath = () => {
		ipcRenderer.invoke('ipcmain-config-path-get').then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				setConfigPath(parsedResult.data);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
			}
		});
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

	return (
		<ProfileContext.Provider
			value={{
				profiles,
				configPath,
				openNewProfile,
				openSettings,
				selectedProfileId,
				editingProfileId,
				setSelectedProfileId,
				setEditingProfileId,
				loadProfiles,
				addProfile,
				deleteProfile,
				setOpenNewProfile,
				setOpenSettings,
				handleProfileClick,
				handleEditDialogOpenChange,
				handleConfigPathChange,
				handleGetConfigPath,
				handleExportSelectedProfile,
				handleOpenProfileInFileExplorer,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfileContext = () => {
	return useContext(ProfileContext);
};

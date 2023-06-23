import { toast } from '@/components/ui/use-toast';
import { ipcRenderer } from 'electron';
import { CreateProfileDto } from 'electron/main/modules/profile-manager/dto/create-profile.dto';
import { UpdateProfileDto } from 'electron/main/modules/profile-manager/dto/update-profile.dto';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ProfileProviderProps {
	children: ReactNode;
}

const ProfileContext = createContext<any>(null);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
	const [profiles, setProfiles] = useState<Profile[]>([]);
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

	return (
		<ProfileContext.Provider
			value={{
				profiles,
				loadProfiles,
				addProfile,
				deleteProfile,
				openNewProfile,
				setOpenNewProfile,
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

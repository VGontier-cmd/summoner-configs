import { useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { useToast } from '@/components/ui/use-toast';

export const useProfileList = () => {
	const { toast } = useToast();
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [openNewProfile, setOpenNewProfile] = useState(false);
	const [openEditProfile, setOpenEditProfile] = useState(false);

	const loadProfiles = () => {
		ipcRenderer
			.invoke('ipcmain-profile-get-all')
			.then((result) => {
				setProfiles(result);
			})
			.catch((error) => {
				toast({
					description: `Error retrieving profiles: ${error}`,
				});
			});
	};

	useEffect(() => {
		loadProfiles();
	}, [profiles]);

	const addProfile = (profile: Profile) => {
		setProfiles((profiles) => [...profiles, profile]);
		setOpenNewProfile(false);
	};

	const updateProfile = (updatedProfile: Profile) => {
		setProfiles((prevProfiles) =>
			prevProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)),
		);
	};

	const deleteProfile = (profileId: string) => {
		setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== profileId));
	};

	return {
		profiles,
		loadProfiles,
		addProfile,
		updateProfile,
		deleteProfile,
		openNewProfile,
		setOpenNewProfile,
		openEditProfile,
		setOpenEditProfile,
	};
};

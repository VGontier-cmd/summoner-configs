import { useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { useToast } from '@/components/ui/use-toast';

export const useProfileList = () => {
	const { toast } = useToast();
	const [profiles, setProfiles] = useState<Profile[]>([]);

	useEffect(() => {
		loadProfiles();
	}, [profiles]);

	const loadProfiles = () => {
		ipcRenderer.invoke('ipcmain-profile-get-all').then((result) => {
			const resultParsed = JSON.parse(result)
			if (resultParsed.success) {
				setProfiles(resultParsed.data);
			} else {
				console.log('erreur')
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

	const deleteProfile = (profileId: string) => {
		if (!profileId) return;
		setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== profileId));
		console.log('profile deleted:', profileId);
	};

	return {
		profiles,
		loadProfiles,
		addProfile,
		updateProfile,
		deleteProfile,
	};
};

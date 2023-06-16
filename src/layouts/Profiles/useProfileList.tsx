import { useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { useToast } from '@/components/ui/use-toast';

export const useProfileList = () => {
	const { toast } = useToast();
	const [profiles, setProfiles] = useState<Profile[]>([]);

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
		loadProfiles(); // Charger les profils lors du montage du composant
	}, []);

	const addProfile = (profile: Profile) => {
		// Ajouter le nouveau profil à la liste des profils
		setProfiles((prevProfiles) => [...prevProfiles, profile]);
	};

	const updateProfile = (updatedProfile: Profile) => {
		// Mettre à jour le profil dans la liste des profils
		setProfiles((prevProfiles) =>
			prevProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile)),
		);
	};

	const deleteProfile = (profileId: string) => {
		// Supprimer le profil de la liste des profils
		setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== profileId));
	};

	return {
		profiles,
		loadProfiles,
		addProfile,
		updateProfile,
		deleteProfile,
	};
};

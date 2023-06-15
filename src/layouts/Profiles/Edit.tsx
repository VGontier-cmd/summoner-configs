import { useRef, useState } from 'react';
import { ipcRenderer } from 'electron';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import Form from './Form';

interface UpdateProps {
	profile: Profile;
}

const Edit = ({ profile }: UpdateProps) => {
	const nameRef = useRef<HTMLInputElement>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (nameRef.current) {
			const name = nameRef.current.value;

			if (!name) {
				setErrorMessage('The profile name cannot be empty...');
				return;
			}

			if (name.length > 20) {
				setErrorMessage('the profile name length cannot exceed 20 characters...');
				return;
			}

			const profileDto = {
				name: nameRef.current.value,
			};

			ipcRenderer
				.invoke('ipcmain-profile-update', profile.id, profileDto)
				.then((result) => {
					window.location.reload();
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	return (
		<>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update profile</DialogTitle>
					<DialogDescription>Update the profile name.</DialogDescription>
				</DialogHeader>
				<Form profile={profile} nameRef={nameRef} message={errorMessage} onSubmit={handleUpdateProfile} />
			</DialogContent>
		</>
	);
};

export default Edit;

import { useRef, useState } from 'react';
import { ipcRenderer } from 'electron';

import { Plus } from 'lucide-react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import Form from './Form';

const New = () => {
	const nameRef = useRef<HTMLInputElement>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleNewProfile = (event: React.FormEvent<HTMLFormElement>) => {
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
				name: name,
			};

			ipcRenderer
				.invoke('ipcmain-profile-create', profileDto)
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
			<Dialog>
				<DialogTrigger asChild>
					<button className="main-btn gold-gradient-border flex items-center gap-3">
						<Plus className="h-4 w-4" />
						Import profile
					</button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add Profile</DialogTitle>
						<DialogDescription>Add a name to your new profile.</DialogDescription>
					</DialogHeader>
					<Form profile={null} nameRef={nameRef} message={errorMessage} onSubmit={handleNewProfile} />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default New;

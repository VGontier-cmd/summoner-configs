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

import { useToast } from '@/components/ui/use-toast';

import Form from './Form';

const New = () => {
	const { toast } = useToast();
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
					toast({
						description: 'The profile has been imported successfully !',
					});
				})
				.catch((error) => {
					toast({
						description: `Error creating profile: ${error}`,
					});
				});
		}
	};

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<button className="main-btn lol-btn gold-gradient-border py-2 px-5 flex items-center gap-3 text-light uppercase">
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

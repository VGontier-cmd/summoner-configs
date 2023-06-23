import React, { useState, useRef } from 'react';

import { ipcRenderer } from 'electron';

import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { DialogFooter } from '@/components/ui/dialog';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { CreateProfileDto } from 'electron/main/modules/profile-manager/dto/create-profile.dto';

interface FormProps {
	profile: Profile | null;
	action: string;
}

const Form = ({ profile, action }: FormProps) => {
	const { toast } = useToast();
	const nameRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState(profile?.name || '');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

			const profileDto: CreateProfileDto = {
				name: name,
				color: '#000000',
				isFav: false,
			};

			if (action == 'create') {
				ipcRenderer
					.invoke('ipcmain-profile-create', profileDto)
					.then((newProfile) => {
						//addProfile(newProfile);
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

			if (action == 'update') {
				if (!profile) return;

				ipcRenderer
					.invoke('ipcmain-profile-update', profile.id, profileDto)
					.then((result) => {
						//updateProfile(profile);
						toast({
							description: 'The profile has been edited successfully !',
						});
					})
					.catch((error) => {
						toast({
							description: `Error editing profile: ${error}`,
						});
					});
			}
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="grid gap-3 py-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name" className="mb-1">
							Name
						</Label>
						<Input
							id="name"
							className="col-span-3"
							value={name}
							ref={nameRef}
							onChange={handleNameChange}
							maxLength={20}
						/>
						{errorMessage && <p className="text-xs text-light">{errorMessage}</p>}
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save</Button>
				</DialogFooter>
			</form>
		</>
	);
};

export default Form;

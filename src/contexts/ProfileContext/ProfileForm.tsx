import React, { useState, useRef } from 'react';

import { ipcRenderer } from 'electron';

import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { DialogFooter } from '@/components/ui/dialog';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { CreateProfileDto } from 'electron/main/modules/profile-manager/dto/create-profile.dto';
import { useProfileContext } from './ProfileContext';
import { UpdateProfileDto } from 'electron/main/modules/profile-manager/dto/update-profile.dto';

interface FormProps {
	profile: Profile | null;
}

const ProfileForm = ({ profile }: FormProps) => {
	const { toast } = useToast();
	const { addProfile, updateProfile, setOpenNewProfile, setEditingProfileId } = useProfileContext();

	const nameRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState(profile?.name || '');

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (nameRef.current) {
			const name = nameRef.current.value;

			if (!name) {
				toast({
					description: 'The profile name cannot be empty...',
				});
				return;
			}

			if (name.length > 20) {
				toast({
					description: 'The profile name length cannot exceed 20 characters...',
				});
				return;
			}

			if (!profile) {
				const profileDto: CreateProfileDto = {
					name: name,
					color: '#000000',
					isFav: false,
				};

				ipcRenderer.invoke('ipcmain-profile-create', profileDto).then((result) => {
					const parsedResult = JSON.parse(result);
					if (parsedResult.success) {
						addProfile(parsedResult.data);
						toast({
							description: 'The profile has been imported successfully !',
						});
						setOpenNewProfile(false);
					} else {
						toast({
							description: `Error creating profile: ${parsedResult.error}`,
						});
					}
				});
			} else {
				const profileDto: UpdateProfileDto = {
					id: profile.id,
					name: name,
				};

				ipcRenderer.invoke('ipcmain-profile-update', profile.id, profileDto).then((result) => {
					const parsedResult = JSON.parse(result);
					if (parsedResult.success) {
						updateProfile(parsedResult.data);
						toast({
							description: 'The profile has been edited successfully !',
						});
						setEditingProfileId(null);
					} else {
						toast({
							description: `Error: ${parsedResult.error}`,
						});
					}
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
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save</Button>
				</DialogFooter>
			</form>
		</>
	);
};

export default ProfileForm;

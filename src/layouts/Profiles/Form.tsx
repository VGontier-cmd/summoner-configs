import React, { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { DialogFooter } from '@/components/ui/dialog';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

interface FormProps {
	profile: Profile | null;
	nameRef: React.RefObject<HTMLInputElement>;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ profile, nameRef, onSubmit }: FormProps) => {
	const [name, setName] = useState(profile?.name || '');

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="grid gap-3 py-4">
					<div className="flex flex-col gap-3">
						<Label htmlFor="name">Name</Label>
						<Input id="name" className="col-span-3" value={name} ref={nameRef} onChange={handleNameChange} />
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

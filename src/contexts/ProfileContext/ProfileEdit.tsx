import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import Form from './ProfileForm';

interface UpdateProps {
	profile: Profile;
}

const ProfileEdit = ({ profile }: UpdateProps) => {
	return (
		<>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update profile</DialogTitle>
					<DialogDescription>Update the profile name.</DialogDescription>
				</DialogHeader>
				<Form profile={profile} />
			</DialogContent>
		</>
	);
};

export default ProfileEdit;

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Form from './ProfileForm';

const ProfileNew = () => {
	return (
		<>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Profile</DialogTitle>
					<DialogDescription>Add a name to your new profile.</DialogDescription>
				</DialogHeader>
				<Form profile={null} />
			</DialogContent>
		</>
	);
};

export default ProfileNew;

import { ipcRenderer } from 'electron';

import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useToast } from '@/components/ui/use-toast';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import { useProfileContext } from './Context';

interface DeleteProps {
	profile: Profile;
}

const Delete = ({ profile }: DeleteProps) => {
	const { toast } = useToast();
	const { deleteProfile } = useProfileContext();

	const handleDeleteProfile = () => {
		if (!profile) return;
		ipcRenderer.invoke('ipcmain-profile-delete', profile.id).then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				deleteProfile(profile);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
			}
		});
	};

	return (
		<>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your selected profile settings.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => handleDeleteProfile()}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</>
	);
};

export default Delete;

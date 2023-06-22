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
import { useProfileList } from './useProfileList';

interface DeleteProps {
	profileId: string;
}

const Delete = ({ profileId }: DeleteProps) => {
	const { toast } = useToast();
	const { deleteProfile } = useProfileList();

	const handleDeleteProfile = () => {
		if (profileId) {
			ipcRenderer
				.invoke('ipcmain-profile-delete', profileId)
				.then((result) => {
					const parsedResult = JSON.parse(result)
					if(parsedResult.success){
						deleteProfile(profileId);
					} else {
						toast({
							description:  `Error: ${parsedResult.error}`,
						});
					}
				})
		}
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

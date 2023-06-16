import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { Icons } from '@/components/Icons';

import { Pen, Trash, Folder } from 'lucide-react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import UpdateProfile from './Edit';

import { useToast } from '@/components/ui/use-toast';

interface ListProfileProps {
	profiles: Profile[];
	selectedProfileId: string | null;
	handleProfileClick: (profileId: string) => void;
}

const List = ({ profiles, selectedProfileId, handleProfileClick }: ListProfileProps) => {
	const { toast } = useToast();
	const handleDeleteProfile = (profileId: string) => {
		if (profileId) {
			ipcRenderer
				.invoke('ipcmain-profile-delete', profileId)
				.then((result) => {
					window.location.reload();
					toast({
						description: 'The profile has been deleted successfully !',
					});
				})
				.catch((error) => {
					console.error(error);
					toast({
						description: `Error deleting profile: ${error}`,
					});
				});
		}
	};

	const handleOpenProfileInFileExplorer = (profileId: string) => {
		if (profileId) {
			ipcRenderer.send('ipcmain-profile-open-folder-in-file-explorer', profileId);
		}
	};

	return (
		<>
			{profiles && profiles.length > 0 ? (
				<ul className="grid grid-cols-3 gap-3 px-4 pb-8 pt-5">
					{profiles.map((profile) => (
						<li
							key={profile.id}
							className="profile-item relative gold-gradient-border border-thin cursor-pointer flex flex-col items-center justify-between text-center border-muted bg-popover p-4 py-5"
							aria-selected={selectedProfileId === profile.id ? 'true' : 'false'}
							onClick={() => handleProfileClick(profile.id)}
						>
							<Dialog>
								<AlertDialog>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button className="absolute outline-none p-2 top-0 right-0 flex items-center justify-center">
												<Icons.moreVertical className="h-4 w-4" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuGroup>
												<DialogTrigger asChild>
													<DropdownMenuItem>
														<Pen className="mr-2 h-4 w-4" />
														<span>Update</span>
													</DropdownMenuItem>
												</DialogTrigger>

												<DropdownMenuItem onClick={() => handleOpenProfileInFileExplorer(profile.id)}>
													<Folder className="mr-2 h-4 w-4" />
													Open Folder
												</DropdownMenuItem>

												<AlertDialogTrigger asChild>
													<DropdownMenuItem>
														<Trash className="mr-2 h-4 w-4" />
														<span>Delete</span>
													</DropdownMenuItem>
												</AlertDialogTrigger>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>

									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete your selected profile settings.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={() => handleDeleteProfile(profile.id)}>Continue</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<UpdateProfile profile={profile} />
							</Dialog>

							<Icons.lol className="mb-3 h-6 w-6" />
							<div className="text-sm line-clamp -lc-1">{profile.name}</div>
						</li>
					))}
				</ul>
			) : (
				<div className="text-center p-4 shadow-md">
					<span className="text-sm text-light">No profile saved...</span>
				</div>
			)}
		</>
	);
};

export default List;

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

interface ListProfileProps {
	profiles: Profile[];
	selectedProfileIndex: number | null;
	handleProfileClick: (index: number) => void;
}

const List = ({ profiles, selectedProfileIndex, handleProfileClick }: ListProfileProps) => {
	const handleDeleteProfile = (profileId: string) => {
		if (profileId) {
			ipcRenderer
				.invoke('ipcmain-profile-delete', profileId)
				.then((result) => {
					window.location.reload();
				})
				.catch((error) => {
					console.error(error);
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
					{profiles.map((profile, index) => (
						<li
							key={profile.id}
							className="profile-item relative glass cursor-pointer flex flex-col items-center justify-between text-center border-muted bg-popover p-4 py-5"
							aria-selected={selectedProfileIndex === index ? 'true' : 'false'}
							onClick={() => handleProfileClick(index)}
						>
							<Dialog>
								<AlertDialog>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button className="absolute outline-none p-2 top-0 right-0 flex items-center justify-center">
												<Icons.dots className="h-4 w-4" />
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

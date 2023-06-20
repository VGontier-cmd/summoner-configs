import { useState } from 'react';

import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { Icons } from '@/components/Icons';
import { Pen, Trash, Folder } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import EditProfile from './Edit';
import DeleteProfile from './Delete';

interface ListProfileProps {
	profiles: Profile[];
	selectedProfileId: string | null;
	handleProfileClick: (profileId: string) => void;
}

const List = ({ profiles, selectedProfileId, handleProfileClick }: ListProfileProps) => {
	const [editingProfileId, setEditingProfileId] = useState<string | null>();

	const handleOpenProfileInFileExplorer = (profileId: string) => {
		if (profileId) {
			ipcRenderer.send('ipcmain-profile-open-folder-in-file-explorer', profileId);
		}
	};

	const handleEditDialogOpenChange = (isOpen: boolean, profileId: string) => {
		if (isOpen) {
			setEditingProfileId(profileId);
		} else {
			setEditingProfileId(null);
		}
	};

	return (
		<>
			{profiles && profiles.length > 0 ? (
				<ul className="grid grid-cols-3 gap-3 px-4 pb-[7rem] pt-5">
					{profiles.map((profile) => (
						<li
							key={profile.id}
							className="profile-item relative gold-gradient-border border-thin cursor-pointer flex flex-col items-center justify-center text-center border-muted bg-popover p-4 py-5"
							aria-selected={selectedProfileId === profile.id ? 'true' : 'false'}
							onClick={() => handleProfileClick(profile.id)}
						>
							<Dialog
								open={editingProfileId === profile.id}
								onOpenChange={(isOpen) => handleEditDialogOpenChange(isOpen, profile.id)}
							>
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
									<DeleteProfile profileId={profile.id} />
								</AlertDialog>
								<EditProfile profile={profile} />
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

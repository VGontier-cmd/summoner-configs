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

import EditProfile from './ProfileEdit';
import DeleteProfile from './ProfileDelete';
import { useProfileContext } from './ProfileContext';

interface ListProfileProps {
	selectedProfileId: string | null;
	handleProfileClick: (profileId: string) => void;
}

const ProfileList = ({ selectedProfileId, handleProfileClick }: ListProfileProps) => {
	const { profiles, editingProfileId, handleEditDialogOpenChange, handleOpenProfileInFileExplorer } =
		useProfileContext();

	if (profiles?.length == 0) {
		return (
			<div className="text-center p-4">
				<span className="text-sm text-light">No profile saved...</span>
			</div>
		);
	}

	return (
		<ul className="grid grid-cols-3 gap-3 px-4 pb-[7rem] pt-5">
			{profiles.map((profile: Profile) => (
				<li
					key={profile.id}
					className="profile-item relative shadow-md cursor-pointer flex flex-col items-center justify-center text-center border-muted bg-popover p-4 py-5"
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

										<DropdownMenuItem onClick={() => handleOpenProfileInFileExplorer(profile)}>
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
							<DeleteProfile profile={profile} />
						</AlertDialog>
						<EditProfile profile={profile} />
					</Dialog>

					<Icons.lol className="mb-3 h-6 w-6" />
					<div className="line-clamp -lc-1">
						<p className="text-sm ">{profile.name}</p>
					</div>
				</li>
			))}
		</ul>
	);
};

export default ProfileList;

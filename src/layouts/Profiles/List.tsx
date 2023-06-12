import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Icons } from '@/components/Icons'

import {
  Pen,
  Trash,
} from "lucide-react"

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"

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
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import UpdateProfile from './Edit'

const List = () => {
	const [profiles, setProfiles] = useState<Profile[]>([]);

	useEffect(() => {
		loadProfiles()
	}, []);

  const loadProfiles = () => {
    ipcRenderer
      .invoke('ipcmain-profile-get-all')
      .then((result) => {
        setProfiles(result);
        console.log('PORFILES ' + profiles.length)
      })
      .catch((error) => {
        console.log('Error retrieving profiles:', error);
      });
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profileId) {
      ipcRenderer
        .invoke('ipcmain-profile-delete', profileId)
        .then((result) => {
          console.log(result);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
	return (
		<>
			{profiles ? (
				<RadioGroup defaultValue="card" className="grid grid-cols-3 gap-3">
					{profiles.map((profile) => (
						<Label
							key={profile.id}
							htmlFor={`profile-${profile.id}`}
							className="reltive glass cursor-pointer flex flex-col items-center justify-between rounded-md border-muted bg-popover p-4 py-5 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-primary"
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

								<UpdateProfile profile={profile}/>
							</Dialog>
							<RadioGroupItem value={`profile-${profile.id}`} id={`profile-${profile.id}`} className="sr-only" />

							<Icons.lol className="mb-3 h-6 w-6" />
							{profile.name}
						</Label>
					))}
				</RadioGroup>
			) : (
				<p>Aucun profile enregistré...</p>
			)}
		</>
	);
};

export default List;

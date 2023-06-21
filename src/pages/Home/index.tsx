import { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Icons } from '@/components/Icons';
import { Settings, Plus, Pen, Trash, Folder } from 'lucide-react';

import backVideo from '@/assets/videos/background-video-d-01.mp4';
import circleLOL from '@/assets/images/decorator-circle.webp';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

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

import line from '@/assets/images/decorator-hr.png';

import { useToast } from '@/components/ui/use-toast';
import { useProfileList } from '@/layouts/Profiles/useProfileList';
import { CreateProfileDto } from 'electron/main/modules/profile-manager/dto/create-profile.dto';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DeleteProfile from '@/layouts/Profiles/Delete';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';
import { UpdateProfileDto } from 'electron/main/modules/profile-manager/dto/update-profile.dto';

const Home = () => {
	const { toast } = useToast();
	const { profiles } = useProfileList();
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
	const [configPath, setConfigPath] = useState<string | null>(null);
	const [openSettings, setOpenSettings] = useState(false);
	const [openNewProfile, setOpenNewProfile] = useState(false);

	useEffect(() => {
		handleGetConfigPath();
	}, []);

	const handleProfileClick = (profileId: string | null): void => {
		setSelectedProfileId(selectedProfileId === profileId ? null : profileId);
	};

	const handleGetConfigPath = () => {
		ipcRenderer
			.invoke('ipcmain-config-path-get')
			.then((result) => {
				setConfigPath(result);
			})
			.catch((error) => {
				toast({
					description: `Error retrieving config path: ${error}`,
				});
			});
	};

	const handleConfigPathRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!configPath) return;

		ipcRenderer
			.invoke('ipcmain-config-path-register', configPath)
			.then(() => {
				toast({
					description: 'Your config path has been set successfully !',
				});
				setOpenSettings(false);
			})
			.catch((error) => {
				toast({
					description: `Error registering config path: ${error}`,
				});
			});
	};

	const handleConfigPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setConfigPath(event.target.value);
	};

	const handleExportSelectedProfile = () => {
		if (!selectedProfileId) return;

		if (!configPath) {
			toast({
				description: 'You must register the config path in your settings',
			});
			return;
		}

		ipcRenderer
			.invoke('ipcmain-profile-export', selectedProfileId)
			.then((result) => {
				if (result) {
					toast({
						description: 'Profile exported successfully !',
					});
				} else {
					toast({
						description: 'Failed to export profile !',
					});
				}
			})
			.catch((error) => {
				toast({
					description: `Error exporting profile: ${error}`,
				});
			});
	};

	const newNameRef = useRef<HTMLInputElement>(null);
	const editNameRef = useRef<HTMLInputElement>(null);
	const { addProfile, updateProfile } = useProfileList();

	const handleCreateProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newNameRef.current) {
			const name = newNameRef.current.value;

			if (!name) {
				toast({
					description: 'The profile name cannot be empty...',
				});
				return;
			}

			if (name.length > 20) {
				toast({
					description: 'The profile name length cannot exceed 20 characters...',
				});
				return;
			}

			const profileDto: CreateProfileDto = {
				name: name,
				color: '#000000',
				isFav: false,
			};

			ipcRenderer
				.invoke('ipcmain-profile-create', profileDto)
				.then((newProfile) => {
					addProfile(newProfile);
					toast({
						description: 'The profile has been imported successfully !',
					});
					setOpenNewProfile(false);
				})
				.catch((error) => {
					toast({
						description: `Error creating profile: ${error}`,
					});
				});
		}
	};

	const [editingProfile, setEditingProfile] = useState<Profile | null>();
	const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
	const [profileName, setProfileName] = useState(editingProfile?.name);

	const handleUpdateProfileSubmit = (event: React.FormEvent<HTMLFormElement>, profile: Profile) => {
		event.preventDefault();

		console.log('PROFILE:', profile.name);

		if (editNameRef.current) {
			const name = editNameRef.current.value;

			if (!name) {
				toast({
					description: 'The profile name cannot be empty...',
				});
				return;
			}

			if (name.length > 20) {
				toast({
					description: 'The profile name length cannot exceed 20 characters...',
				});
				return;
			}

			const profileDto: UpdateProfileDto = {
				id: profile.id,
				name: name,
			};

			if (!profile) return;

			ipcRenderer
				.invoke('ipcmain-profile-update', profile.id, profileDto)
				.then((result) => {
					updateProfile(profile);
					toast({
						description: 'The profile has been edited successfully !',
					});
					setEditingProfileId(null);
				})
				.catch((error) => {
					toast({
						description: `Error editing profile: ${error}`,
					});
				});
		}
	};

	const handleProfileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProfileName(event.target.value);
	};

	const handleOpenProfileInFileExplorer = (profileId: string) => {
		if (profileId) {
			ipcRenderer.send('ipcmain-profile-open-folder-in-file-explorer', profileId);
		}
	};

	const handleEditDialogOpenChange = (isOpen: boolean, profile: Profile) => {
		if (isOpen) {
			setEditingProfile(profile);
			setEditingProfileId(profile.id);
			setProfileName(profile ? profile.name : '');
		} else {
			setEditingProfile(null);
			setEditingProfileId(null);
			setProfileName('');
		}
	};

	return (
		<>
			<div className="background-video">
				<video src={backVideo} autoPlay loop playsInline></video>
			</div>

			<div className="h-screen flex flex-col">
				<div>
					<div className="header sticky top-0 bg-glass shadow-md pt-6 pb-5 px-4 z-[1]">
						<div className="flex items-center justify-between gap-2">
							<h1 className="main-title mb-2">
								Manage
								<br />
								your profiles !
							</h1>
							<Dialog open={openSettings} onOpenChange={setOpenSettings}>
								<DialogTrigger asChild>
									<button className="settings-btn lol-btn rounded-circle">
										<Settings className="h-4 w-4" />
									</button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Settings</DialogTitle>
										<DialogDescription>Enter your config file path.</DialogDescription>
									</DialogHeader>
									<form onSubmit={handleConfigPathRegister}>
										<div className="grid gap-4 py-4">
											<div className="flex flex-col gap-2">
												<Label htmlFor="name">Path</Label>
												<Input
													id="name"
													className="col-span-3"
													value={configPath || ''}
													placeholder="C:\Riot Games\League of Legends\Config"
													onChange={handleConfigPathChange}
												/>
											</div>
										</div>
										<DialogFooter>
											<Button type="submit">Save</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>
						<p className="text text-md mb-6">Add a new profile config to your account.</p>
						<div className="flex items-end justify-between gap-3">
							<span className="text-sm text-light leading-[1]">
								{profiles.length} profile{profiles.length > 1 && 's'}
							</span>
							<div className="flex justify-end gap-3">
								<Dialog open={openNewProfile} onOpenChange={setOpenNewProfile}>
									<DialogTrigger asChild>
										<button className="main-btn lol-btn gold-gradient-border py-2 px-5 flex items-center gap-3 text-light uppercase">
											<Plus className="h-4 w-4" />
											Import profile
										</button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Add Profile</DialogTitle>
											<DialogDescription>Add a name to your new profile.</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleCreateProfileSubmit}>
											<div className="grid gap-3 py-4">
												<div className="flex flex-col gap-2">
													<Label htmlFor="name" className="mb-1">
														Name
													</Label>
													<Input className="col-span-3" ref={newNameRef} maxLength={20} />
												</div>
											</div>
											<DialogFooter>
												<Button type="submit">Save</Button>
											</DialogFooter>
										</form>
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<img src={line} className="absolute left-0 bottom-0 w-full transform translate-y-[100%] px-1" />
					</div>

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
										onOpenChange={(isOpen) => handleEditDialogOpenChange(isOpen, profile)}
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

										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Update profile</DialogTitle>
												<DialogDescription>Update the profile name.</DialogDescription>
											</DialogHeader>
											<form onSubmit={(e) => handleUpdateProfileSubmit(e, profile)}>
												<div className="grid gap-3 py-4">
													<div className="flex flex-col gap-2">
														<Label htmlFor="name" className="mb-1">
															Name
														</Label>
														<Input
															className="col-span-3"
															value={profileName}
															ref={editNameRef}
															onChange={handleProfileNameChange}
															maxLength={20}
														/>
													</div>
												</div>
												<DialogFooter>
													<Button type="submit">Save</Button>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>

									<Icons.lol className="mb-3 h-6 w-6" />
									<div className="line-clamp -lc-1">
										<p className="text-sm ">{profile.name}</p>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="text-center p-4 shadow-md">
							<span className="text-sm text-light">No profile saved...</span>
						</div>
					)}
				</div>
			</div>

			<AlertDialog>
				<div className="export-btn lol-btn rounded-circle">
					<img src={circleLOL} />
					<AlertDialogTrigger asChild>
						<button type="button" className="rounded-circle ctm-shadow" disabled={selectedProfileId === null}>
							<span>Export profile</span>
						</button>
					</AlertDialogTrigger>
				</div>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will load your selected profile settings to your League of Legends
							client.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleExportSelectedProfile()}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default Home;

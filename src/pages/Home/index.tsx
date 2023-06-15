import { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { Profile } from 'electron/main/modules/profile-manager/profile.interface';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Settings } from 'lucide-react';

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

import NewProfile from '@/layouts/Profiles/New';
import ListProfile from '@/layouts/Profiles/List';

import line from '@/assets/images/decorator-hr.png';

const Home = () => {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

	const [configPath, setConfigPath] = useState<string | null>(null);

	useEffect(() => {
		loadProfiles();
		handleGetConfigPath();
	}, []);

	const loadProfiles = () => {
		ipcRenderer
			.invoke('ipcmain-profile-get-all')
			.then((result) => {
				setProfiles(result);
			})
			.catch((error) => {
				console.log('Error retrieving profiles:', error);
			});
	};

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
				console.log('Error retrieving config path:', error);
			});
	};

	const handleConfigPathRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (configPath) {
			ipcRenderer
				.invoke('ipcmain-config-path-register', configPath)
				.then(() => {
					window.location.reload();
				})
				.catch((error) => {
					console.log('Error registering config path:', error);
				});
		}
	};

	const handleConfigPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setConfigPath(event.target.value);
	};

	const handleExportSelectedProfile = () => {
		if (selectedProfileId) {
			ipcRenderer
				.invoke('ipcmain-profile-export', selectedProfileId)
				.then((result) => {
					if (result) {
						// Export successful
						console.log('Profile exported successfully');
						window.location.reload();
					} else {
						// Export failed
						console.log('Failed to export profile');
					}
				})
				.catch((error) => {
					console.error('Error exporting profile:', error);
				});
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
							<Dialog>
								<DialogTrigger asChild>
									<button className="settings-btn rounded-circle">
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
													placeholder="C:\Riot Games\League of Legends\"
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
								{profiles.length} {`profile${profiles.length > 1 ? 's' : ''}`}
							</span>
							<div className="flex justify-end gap-3">
								<NewProfile />
							</div>
						</div>
						<img src={line} className="absolute left-0 bottom-0 w-full transform translate-y-[100%] px-1" />
					</div>

					<ListProfile
						profiles={profiles}
						selectedProfileId={selectedProfileId}
						handleProfileClick={handleProfileClick}
					/>
				</div>
			</div>

			<AlertDialog>
				<div className="export-btn rounded-circle">
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

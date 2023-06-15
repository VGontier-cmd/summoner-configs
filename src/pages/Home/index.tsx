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

const Home = () => {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null);

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

	const handleProfileClick = (index: number | null): void => {
		setSelectedProfileIndex(selectedProfileIndex === index ? null : index);
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

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<button className="settings-btn">
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
									placeholder="/path"
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

			<div className="background-video">
				<video src={backVideo} autoPlay loop playsInline></video>
			</div>

			<div className="overflow-y-auto">
				<div className="py-6 px-4">
					<h1 className="main-title mb-2">
						Manage
						<br />
						your profiles !
					</h1>
					<p className="text text-md mb-6">Add a new profile config to your account.</p>
					<div className="grid gap-6 pb-8">
						<div className="flex items-end justify-between gap-3 mt-5">
							<span className="text-sm text-light">{profiles.length} profiles</span>
							<div className="flex justify-end gap-3">
								<NewProfile />
							</div>
						</div>
						<ListProfile
							profiles={profiles}
							selectedProfileIndex={selectedProfileIndex}
							handleProfileClick={handleProfileClick}
						/>
					</div>
				</div>
			</div>
			<div className="footer relative mt-auto">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<div className="export-btn rounded-circle">
							<img src={circleLOL} />
							<button type="button" className="rounded-circle" disabled={selectedProfileIndex === null}>
								<span>Export profile</span>
							</button>
						</div>
					</AlertDialogTrigger>
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
							<AlertDialogAction>Continue</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</>
	);
};

export default Home;

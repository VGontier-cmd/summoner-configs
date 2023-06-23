import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Settings, Plus } from 'lucide-react';

import backVideo from '@/assets/videos/background-video-d-01.mp4';
import circleLOL from '@/assets/images/decorator-circle.png';

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

import { useProfileContext } from '@/contexts/ProfileContext/ProfileContext';

import ProfileNew from '@/contexts/ProfileContext/ProfileNew';
import ProfileList from '@/contexts/ProfileContext/ProfileList';

const Home = () => {
	const {
		profiles,
		loadProfiles,
		selectedProfileId,
		openNewProfile,
		setOpenNewProfile,
		openSettings,
		setOpenSettings,
		configPath,
		handleProfileClick,
		handleConfigPathChange,
		handleGetConfigPath,
		handleConfigPathRegister,
		handleExportSelectedProfile,
	} = useProfileContext();

	useEffect(() => {
		handleGetConfigPath();
		loadProfiles();
	}, []);

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
									<ProfileNew />
								</Dialog>
							</div>
						</div>
						<img src={line} className="absolute left-0 bottom-0 w-full transform translate-y-[100%] px-1" />
					</div>

					<ProfileList selectedProfileId={selectedProfileId} handleProfileClick={handleProfileClick} />
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

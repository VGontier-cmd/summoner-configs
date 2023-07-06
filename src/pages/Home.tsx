import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Settings, Plus } from 'lucide-react';

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

import { useProfileContext } from '@/contexts/ProfileContext/ProfileContext';

import ProfileNew from '@/contexts/ProfileContext/ProfileNew';
import ProfileList from '@/contexts/ProfileContext/ProfileList';
import { useLeagueContext } from '@/contexts/LeagueContext/LeagueContext';
import { FadeTransition } from '@/transitions/AnimatedPage';

const Home = () => {
	const {
		profiles,
		loadProfiles,
		selectedProfileId,
		openNewProfile,
		setOpenNewProfile,
		handleProfileClick,
		handleExportSelectedProfile,
	} = useProfileContext();

	const {
		configPath,
		handleGetConfigPath,
		handleConfigPathRegister,
		handleConfigPathChange,
		openSettings,
		setOpenSettings,
	} = useLeagueContext();

	useEffect(() => {
		handleGetConfigPath();
		loadProfiles();
	}, []);

	return (
		<FadeTransition>
			<div className="h-screen flex flex-col">
				<div>
					<div className="header sticky top-0 pt-6 pb-5 px-4 z-[1]">
						<div className="flex items-center justify-between gap-2">
							<h1 className="main-title mb-2">Manage your profiles !</h1>
							<Dialog open={openSettings} onOpenChange={setOpenSettings}>
								<DialogTrigger asChild>
									<Button variant={'icon'}>
										<Settings className="h-4 w-4" />
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Settings</DialogTitle>
										<DialogDescription>Enter your config file path.</DialogDescription>
									</DialogHeader>
									<form onSubmit={handleConfigPathRegister}>
										<div className="grid gap-4 py-4">
											<div className="flex flex-col gap-2">
												<Label htmlFor="name" className="text-primary-foreground">
													Path
												</Label>
												<Input
													className="col-span-3"
													value={configPath || ''}
													placeholder="C:\Riot Games\League of Legends\Config"
													onChange={handleConfigPathChange}
												/>
											</div>
										</div>
										<DialogFooter>
											<Button type="submit" variant={'main'}>
												Save
											</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>
						<p className="text-light text-md mb-6">Add a new profile config to your account.</p>
						<div className="flex items-end justify-between gap-3">
							<span className="text-sm text-primary-foreground leading-[1]">
								{profiles.length} profile{profiles.length > 1 && 's'}
							</span>
							<div className="flex justify-end gap-3">
								<Dialog open={openNewProfile} onOpenChange={setOpenNewProfile}>
									<DialogTrigger asChild>
										<button className="main-btn text-sm rounded-[8px] py-2 px-5 flex items-center gap-3">
											<Plus className="h-4 w-4" />
											Import profile
										</button>
									</DialogTrigger>
									<ProfileNew />
								</Dialog>
							</div>
						</div>
					</div>

					<ProfileList selectedProfileId={selectedProfileId} handleProfileClick={handleProfileClick} />
				</div>
			</div>

			<AlertDialog>
				<div className="export-btn lol-btn rounded-circle">
					<img src={circleLOL} />
					<AlertDialogTrigger asChild>
						<button
							type="button"
							className="text-sm text-primary-foreground rounded-circle ctm-shadow"
							disabled={selectedProfileId === null}
						>
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
		</FadeTransition>
	);
};

export default Home;

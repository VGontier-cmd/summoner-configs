import { useToast } from '@/components/ui/use-toast';
import { ipcRenderer } from 'electron';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export const LeagueContext = createContext<any>(null);

interface LeagueProviderProps {
	children: ReactNode;
}

export const LeagueProvider: React.FC<LeagueProviderProps> = ({ children }) => {
	const { toast } = useToast();
	const [isLeagueOfLegendsOpen, setIsLeagueOfLegendsOpen] = useState(false);
	const [configPath, setConfigPath] = useState<string | null>(null);
	const [openSettings, setOpenSettings] = useState(false);
	const timer = 5000;

	useEffect(() => {
		handleLeagueClientCheckStatus();
	}, [isLeagueOfLegendsOpen]);

	const handleLeagueClientGetStatus = () => {
		ipcRenderer.invoke('ipcmain-league-client-get-status').then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				setIsLeagueOfLegendsOpen(parsedResult.isOpen);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
				console.error('Error:', parsedResult.error);
			}
		});
	};

	const handleLeagueClientCheckStatus = async () => {
		while (true) {
			try {
				handleLeagueClientGetStatus();
			} catch (error) {
				toast({
					description: `Error: ${error}`,
				});
				console.error(error);
			}

			await new Promise<void>((resolve) => setTimeout(resolve, timer));
		}
	};

	const handleGetConfigPath = () => {
		ipcRenderer.invoke('ipcmain-config-path-get').then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				setConfigPath(parsedResult.data);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
				console.error('Error:', parsedResult.error);
			}
		});
	};

	const handleConfigPathRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		ipcRenderer.invoke('ipcmain-config-path-register', configPath).then((result) => {
			const parsedResult = JSON.parse(result);
			if (parsedResult.success) {
				parsedResult.data;
				toast({ description: 'Your config path has been set successfully !' });
				setOpenSettings(false);
			} else {
				toast({
					description: `Error: ${parsedResult.error}`,
				});
				console.error('Error:', parsedResult.error);
			}
		});
	};

	const handleConfigPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setConfigPath(event.target.value);
	};

	return (
		<LeagueContext.Provider
			value={{
				isLeagueOfLegendsOpen,
				configPath,
				openSettings,
				setOpenSettings,
				handleGetConfigPath,
				handleConfigPathRegister,
				handleConfigPathChange,
			}}
		>
			{children}
		</LeagueContext.Provider>
	);
};

export const useLeagueContext = () => {
	return useContext(LeagueContext);
};

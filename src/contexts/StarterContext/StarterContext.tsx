import { useToast } from '@/components/ui/use-toast';
import { ipcRenderer } from 'electron';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export const StarterContext = createContext<any>(null);

interface StarterProviderProps {
	children: ReactNode;
}

export const StarterProvider: React.FC<StarterProviderProps> = ({ children }) => {
	const { toast } = useToast();
	const [isLeagueOfLegendsOpen, setIsLeagueOfLegendsOpen] = useState(false);
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

	return <StarterContext.Provider value={{ isLeagueOfLegendsOpen }}>{children}</StarterContext.Provider>;
};

export const useStarterContext = () => {
	return useContext(StarterContext);
};

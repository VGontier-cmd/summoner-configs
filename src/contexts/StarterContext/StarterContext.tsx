import { exec } from 'child_process';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export const StarterContext = createContext<any>(null);

interface StarterProviderProps {
	children: ReactNode;
}

export const StarterProvider: React.FC<StarterProviderProps> = ({ children }) => {
	const [isLeagueOfLegendsOpen, setIsLeagueOfLegendsOpen] = useState(false);
	const time = 5000;
	const execApp = 'LeagueClientUx.exe';
	const execCommand = `tasklist /fi "imagename eq ${execApp}"`;

	useEffect(() => {
		const checkLeagueOfLegendsStatus = () => {
			return new Promise<void>((resolve, reject) => {
				exec(execCommand, (error: Error | null, stdout: string, stderr: string) => {
					if (error) {
						reject(error);
						return;
					}

					const isOpen = stdout.includes(execApp);
					setIsLeagueOfLegendsOpen(isOpen);
					resolve();
				});
			});
		};

		const startChecking = async () => {
			while (true) {
				try {
					await checkLeagueOfLegendsStatus();
				} catch (error) {
					console.error(error);
				}

				await new Promise<void>((resolve) => setTimeout(resolve, time));
			}
		};

		startChecking();
	}, []);

	return <StarterContext.Provider value={{ isLeagueOfLegendsOpen }}>{children}</StarterContext.Provider>;
};

export const useStarterContext = () => {
	return useContext(StarterContext);
};

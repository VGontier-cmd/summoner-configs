import { exec } from 'child_process';

export function isLeagueClientOpen(): Promise<boolean> {
	const execApp = 'LeagueClientUx.exe';
	const execCommand = `tasklist /fi "imagename eq ${execApp}"`;

	return new Promise<boolean>((resolve, reject) => {
		exec(execCommand, (error: Error | null, stdout: string, stderr: string) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout.includes(execApp));
		});
	});
}

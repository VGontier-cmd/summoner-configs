import { ipcRenderer } from 'electron';

import { Icons } from '@/components/Icons';

const Header = () => {
	// On envoie un message à la fenêtre principale pour demander la fermeture de l'application
	const handleCloseButtonClick = () => {
		ipcRenderer.send('close-win');
	};

	// On envoie un message à la fenêtre principale pour minifier l'application
	const handleMinimizeButtonClick = () => {
		ipcRenderer.send('minimize-win');
	};

	return (
		<header className="frame-header">
			<button onClick={handleMinimizeButtonClick} className="btn-minimize frame-action">
				<Icons.minus />
			</button>
			<button onClick={handleCloseButtonClick} className="btn-close frame-action">
				<Icons.close />
			</button>
		</header>
	);
};

export default Header;

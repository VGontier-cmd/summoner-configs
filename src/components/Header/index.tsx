import React from 'react';
import { ipcRenderer } from 'electron';

import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg';
import { ReactComponent as MinimizeIcon } from '@/assets/icons/minimize.svg';
import './header.scss'

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
    <header className='frame-header'>
      <button onClick={handleMinimizeButtonClick} className='btn-minimize frame-action'>
        <MinimizeIcon />
      </button>
      <button onClick={handleCloseButtonClick} className='btn-close frame-action'>
        <CloseIcon />
      </button>
    </header>
  )
};

export default Header;
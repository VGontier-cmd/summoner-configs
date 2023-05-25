import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'

import { ReactComponent as CloseIcon } from './assets/icons/close.svg';
import { ReactComponent as MinimizeIcon } from './assets/icons/minimize.svg';

const { ipcRenderer } = require('electron');

// On envoie un message à la fenêtre principale pour demander la fermeture de l'application
const handleCloseButtonClick = () => {
  ipcRenderer.send('close-win');
};

// On envoie un message à la fenêtre principale pour minifier l'application
const handleMinimizeButtonClick = () => {
  ipcRenderer.send('minimize-win');
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <header className='frame-header'>
      <button onClick={handleMinimizeButtonClick} className='btn-minimize frame-action'>
          <MinimizeIcon />
      </button>
      <button onClick={handleCloseButtonClick} className='btn-close frame-action'>
          <CloseIcon />
      </button>
    </header>

    <App />
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')

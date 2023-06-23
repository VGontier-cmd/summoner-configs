import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Header from '@/layouts/Header';
import './samples/node-api';
import '@/assets/stylesheets/index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Header />
		<App />
	</React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');

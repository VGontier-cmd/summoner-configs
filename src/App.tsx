import { StarterProvider } from './contexts/StarterContext/StarterContext';
import StarterIndex from './contexts/StarterContext/StarterIndex';

function App() {
	return (
		<StarterProvider>
			<StarterIndex />
		</StarterProvider>
	);
}

export default App;

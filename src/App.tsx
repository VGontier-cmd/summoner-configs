import { LeagueProvider } from './contexts/LeagueContext/LeagueContext';
import LeagueIndex from './contexts/LeagueContext/LeagueIndex';

function App() {
	return (
		<LeagueProvider>
			<LeagueIndex />
		</LeagueProvider>
	);
}

export default App;

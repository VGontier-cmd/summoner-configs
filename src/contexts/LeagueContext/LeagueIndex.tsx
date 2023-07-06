import Starter from '@/pages/Starter';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '../ProfileContext/ProfileContext';
import Home from '@/pages/Home';
import { useLeagueContext } from './LeagueContext';

function LeagueIndex() {
	const { isLeagueOfLegendsOpen } = useLeagueContext();

	return (
		<>
			{isLeagueOfLegendsOpen ? (
				<ProfileProvider>
					<Home />
				</ProfileProvider>
			) : (
				<Starter />
			)}
			<Toaster />
		</>
	);
}

export default LeagueIndex;

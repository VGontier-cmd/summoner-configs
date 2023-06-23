import Starter from '@/pages/Starter';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '../ProfileContext/ProfileContext';
import Home from '@/pages/Home';
import { useStarterContext } from './StarterContext';

function StarterIndex() {
	const { isLeagueOfLegendsOpen } = useStarterContext();

	return isLeagueOfLegendsOpen ? (
		<ProfileProvider>
			<Home />
			<Toaster />
		</ProfileProvider>
	) : (
		<Starter />
	);
}

export default StarterIndex;

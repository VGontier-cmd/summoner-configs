import Starter from '@/pages/Starter';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '../ProfileContext/ProfileContext';
import Home from '@/pages/Home';
import { useLeagueContext } from './LeagueContext';

import { AnimatePresence } from 'framer-motion';

function LeagueIndex() {
	const { isLeagueOfLegendsOpen } = useLeagueContext();

	return (
		<AnimatePresence initial={false} wait={'wait'}>
			{isLeagueOfLegendsOpen ? (
				<ProfileProvider>
					<Home />
				</ProfileProvider>
			) : (
				<Starter />
			)}
			<Toaster />
		</AnimatePresence>
	);
}

export default LeagueIndex;

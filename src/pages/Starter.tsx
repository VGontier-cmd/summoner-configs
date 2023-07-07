import Loader from '@/components/Loader';

import { FadeTransition } from '@/transitions/AnimatedPage';

function Starter() {
	return (
		<FadeTransition>
			<div className="starter-container">
				<Loader />
				<div className="starter-message">
					<p className="text-sm text-primary-foreground mt-8">Waiting for League of Legends to open...</p>
				</div>
			</div>
		</FadeTransition>
	);
}

export default Starter;

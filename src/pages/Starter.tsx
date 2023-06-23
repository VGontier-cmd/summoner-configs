import Loader from '@/components/Loader';

import backVideo from '@/assets/videos/background-video-d-01.mp4';

function Starter() {
	return (
		<>
			<div className="background-video">
				<video src={backVideo} autoPlay loop playsInline></video>
			</div>
			<div className="starter-container">
				<Loader />
				<div className="starter-message">
					<p className="text-sm text-light mt-8">Waiting for League of Legends to open...</p>
				</div>
			</div>
		</>
	);
}

export default Starter;

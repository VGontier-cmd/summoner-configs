import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
	children: ReactNode;
}

export const FadeTransition = ({ children }: AnimatedPageProps) => {
	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			>
				{children}
			</motion.div>
		</>
	);
};

export const SlideTransition = ({ children }: AnimatedPageProps) => {
	return (
		<>
			{children}
			<motion.div
				className="slide-in"
				initial={{ scaleY: 0 }}
				animate={{ scaleY: 0 }}
				exit={{ scaleY: 1 }}
				transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
			/>
			<motion.div
				className="slide-out"
				initial={{ scaleY: 1 }}
				animate={{ scaleY: 0 }}
				exit={{ scaleY: 0 }}
				transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
			/>
		</>
	);
};

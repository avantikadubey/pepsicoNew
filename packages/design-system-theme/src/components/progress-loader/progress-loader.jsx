import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		'& .MuiLinearProgress-colorPrimary, & .MuiLinearProgress-colorSecondary': {
			zIndex: 10,
		}
	},
})

export default function ProgressLoader() {
	const classes = useStyles();
	const [completed, setCompleted] = React.useState(0);

	React.useEffect(() => {
		function progress() {
		setCompleted(oldCompleted => {
			if (oldCompleted === 100) {
			return 0;
			}
			const diff = Math.random() * 10;
			return Math.min(oldCompleted + diff, 100);
		});
		}

		const timer = setInterval(progress, 500);
		return () => {
		clearInterval(timer);
		};
	}, []);

	return (
		<div className={classes.root}>
			<LinearProgress color="secondary" variant="determinate" value={completed} />
		</div>
	)
}
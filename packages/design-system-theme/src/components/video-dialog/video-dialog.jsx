import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import { VideoPlayer } from '../video-player'

const styles = theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
})

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const DialogTitle = withStyles(styles)(props => {
	const { children, classes, onClose, ...other } = props
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	)
})

const DialogContent = withStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		minHeight: 300,
	},
}))(MuiDialogContent)

const VideoDialog = ({ showDialog, title, videoURL }) => {
	const [open, setOpen] = useState(false)

	React.useEffect(() => {
		setOpen(showDialog)
	}, [showDialog])

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div>
			<Dialog
				TransitionComponent={Transition}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				maxWidth="lg"
			>
				<DialogTitle id="customized-dialog-title" onClose={handleClose}>
					{title}
				</DialogTitle>
				<DialogContent dividers>
					<VideoPlayer url={videoURL} />
				</DialogContent>
			</Dialog>
		</div>
	)
}

VideoDialog.propTypes = {
	showDialog: PropTypes.bool,
	title: PropTypes.string,
	videoURL: PropTypes.string,
}

VideoDialog.defaultProps = {
	showDialog: false,
	title: '',
}
export default VideoDialog

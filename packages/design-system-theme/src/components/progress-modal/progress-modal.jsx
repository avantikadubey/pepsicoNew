import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles({
	root: {
		display: 'flex',
	},
	content: {
		textAlign: 'center',
		minWidth: 300,
	},
})

export const progressStatusType = {
	HIDDEN: 0,
	LOADING: 1,
	SUCCESS: 2,
	FAILURE: -1,
}

const ProgressModal = props => {
	const [open, setOpen] = useState(false)
	const { status, statusMessage } = props
	const theme = useTheme()
	useEffect(() => {
		if (status === progressStatusType.HIDDEN) {
			setOpen(false)
			return
		}
		if (status === progressStatusType.LOADING) {
			setOpen(true)
		} else {
			setOpen(true)
			setTimeout(() => {
				setOpen(false)
			}, 4000)
		}
	}, [status])

	const classes = useStyles(theme)
	return (
		<Dialog
			TransitionComponent={Transition}
			aria-labelledby="progress-dialog-title"
			aria-describedby="server-modal-description"
			open={open}
			maxWidth="md"
		>
			<DialogTitle id="progress-dialog-title" className={classes.content}>
				{status === progressStatusType.LOADING && (
					<CircularProgress size={50} />
				)}

				{status === progressStatusType.SUCCESS && (
					<Grow in>
						<FontAwesomeIcon
							icon={['far', 'check-circle']}
							size="3x"
							color="green"
						/>
					</Grow>
				)}
				{status === progressStatusType.FAILURE && (
					<Grow in>
						<FontAwesomeIcon
							icon={['far', 'exclamation-triangle']}
							size="3x"
							color={theme.palette.common.red}
						/>
					</Grow>
				)}
			</DialogTitle>
			<DialogContent id="server-modal-description" className={classes.content}>
				<Typography component="h4" variant="body2">{statusMessage}</Typography>
			</DialogContent>
		</Dialog>
	)
}

ProgressModal.propTypes = {
	statusMessage: PropTypes.string.isRequired,
	status: PropTypes.number.isRequired,
}

export default ProgressModal

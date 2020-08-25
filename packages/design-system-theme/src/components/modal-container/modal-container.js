import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
//import { Typography, TextField, Button, Grid } from '@material-ui/core';
//import Modal from '@material-ui/core/Modal';
import { ConfigModal } from '../config-modal'

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.common.white,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}))

const ModalContainer = () => {
	const classes = useStyles()

	// getModalStyle is not a pure function, we roll the style only on the first render
	const [open, setOpen] = React.useState(false)
	const [newconfiguration, setNewConfiguration] = React.useState(null)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const saveNewConfiguration = () => {
		//  console.log('test');
	}

	const handleNewConfiguration = event => {
		setNewConfiguration(event.target.value)
		//   console.log('New COnfiguration:', newconfiguration);
	}

	return (
		<div>
			<p>Click to get the full Modal experience!</p>
			<button type="button" onClick={handleOpen}>
				Open Modal
			</button>
			<ConfigModal
				open={open}
				handleClose={handleClose}
				data={newconfiguration}
				handleNewConfiguration={handleNewConfiguration}
				saveNewConfiguration={saveNewConfiguration}
			/>
		</div>
	)
}

export default ModalContainer

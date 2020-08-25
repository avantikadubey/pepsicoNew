/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField, Grid } from '@material-ui/core'

const InputControl = ({ classes, data, handleIncrement, handleDecrement,color }) => {

	let caret = {
		color:color,
		height: 20,
	  };
	// let field = {
	// 	background:color,
	// };

	return (
		<Fragment>
			<Grid container>
				<Grid item className={classes.controls}>
					<FontAwesomeIcon icon={['fas', 'caret-up']} size="2x" style={caret} 
					onClick={() => handleIncrement(data)} />
					<TextField
						id="standard-name"
						className={classes.textField}
						value={data}
					/>
					<FontAwesomeIcon icon={['fas', 'caret-down']} size="2x" style={caret} 
					onClick={() => handleDecrement(data)} />
				</Grid>
			</Grid>
		</Fragment>
	)
}

InputControl.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.number.isRequired,
	handleIncrement: PropTypes.func.isRequired,
	handleDecrement: PropTypes.func.isRequired,
}


export default withStyles(()=> ({
	controls: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	textField: {
		maxWidth: 50,
		'& input': {
			padding: 0,
			textAlign: 'center',
			//Pcolor:'#fffff'
		},
	},
	// caret: {
	// 	height: 20,
	// },
}))(InputControl)

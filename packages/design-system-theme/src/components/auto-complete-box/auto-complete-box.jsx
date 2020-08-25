/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles(theme => ({
	textBox: {
		width: '300',
		border: '1px solid',
		//borderColor: '#000',
		'& .MuiOutlinedInput-adornedEnd':{
			'&:hover':{
				border: 'none',
				borderRadius: '0px'
			}
		},'& label':{
			backgroundColor: 'white'
		}

	},
}))

const AutoCompleteBox = ({ label, suggestionData, handleOnChange }) => {
	const classes = useStyles()
	return (
		<Autocomplete
			id="combo-box-demo"
			options={suggestionData}
			getOptionLabel={option => option.simName}
			//className={classes.test}
      onChange={handleOnChange}
			renderInput={params => (
				<TextField
					{...params}
					label={label}
					variant="outlined"
					fullWidth
					className={classes.textBox}
				/>
			)}
		/>
	)
}

AutoCompleteBox.propTypes = {
	suggestionData: PropTypes.array,
	label: PropTypes.string,
	handleOnChange: PropTypes.func,
}

export default AutoCompleteBox

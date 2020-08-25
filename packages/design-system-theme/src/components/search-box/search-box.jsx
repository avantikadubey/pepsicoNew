import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

const useStyles = makeStyles(theme =>
	createStyles({
		inputAdor: {
			border: '1px solid',
			borderColor: theme.palette.grey[400],
			backgroundColor: theme.palette.common.white,
			borderRadius: '2px',
		},
		icon: {
			padding: '10px',
			fontSize: '40px',
			color: theme.palette.primary.main,
		},
	})
)

const SearchBox = (filterText, searchHandler) => {
	const classes = useStyles()
	return (
		<TextField
			className={classes.inputAdor}
			label="Search"
			margin="normal"
			variant="filled"
			value={''}
			onChange={searchHandler}
			InputProps={{
				endAdornment: (
					<InputAdornment>
						<FontAwesomeIcon
							icon={['fas', 'search']}
							className={classes.icon}
						/>
					</InputAdornment>
				),
				disableUnderline: true,
			}}
		/>
	)
}

export default SearchBox

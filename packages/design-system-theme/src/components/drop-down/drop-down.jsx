/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const selectTheme = defaultTheme => {
	return createMuiTheme({
		...defaultTheme,
		palette: {
			...defaultTheme.palette,
			primary: {
				main: '#fff',
				light: '#fff',
				dark: '#fff',
				contrastText: 'black',
			},
		},
		overrides: {
			MuiFormControl: {
				root: {
					margin: '0px',
					minWidth: '200px',
					//	boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.54)',
					borderWidth: '1px',
					borderStyle: 'solid',
					borderColor: '#424242',
					borderRadius: '2px',
					'& #select-data:focus': {
						backgroundColor: 'white',
						borderColor: 'transparent',
						borderRadius: '4px',
						color: 'black',
					},
					'& .Mui-focused': {
						color: 'black',
					},
				},
			},
			MuiSelect: {
				select: {
					backgroundColor: defaultTheme.palette.common.white,
					borderColor: 'transparent',
					borderRadius: '2px',
				},
			},
		},
	})
}

const useStyles = makeStyles(theme => ({
	root: {
		flexWrap: 'wrap',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))

const DropDown = ({ type, current, label, values, onChange, disabled }) => {
	const defaultTheme = useTheme()
	const classes = useStyles({})
	const [state, setState] = React.useState({
		data: current,
	})
	const inputLabel = React.useRef(null)
	const [labelWidth, setLabelWidth] = React.useState(0)
	React.useEffect(() => {
		setLabelWidth(inputLabel.current.offsetWidth)
		setState({ data: current })
	}, [current])

	const handleChange = name => event => {
		setState({
			...state,
			[name]: event.target.value,
		})
		if (event.target.value === '__UNSELECTED__') return
		onChange(type, event.target.value)
	}

	return (
		<ThemeProvider theme={selectTheme(defaultTheme)}>
			<section className={classes.root}>
				<FormControl variant="filled" disabled={disabled}>
					<InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
						{label}
					</InputLabel>
					<Select
						value={state.data}
						onChange={handleChange('data')}
						labelWidth={labelWidth}
						inputProps={{
							name: 'data',
							id: 'outlined-age-native-simple',
							'aria-label': 'test',
						}}
						disableUnderline
					>
						
						<MenuItem value={'__UNSELECTED__'} disabled>
							<em>Select</em>
						</MenuItem>
						{values.length === 0 && type === 'simConfig' && (
							<MenuItem value={'__UNSELECTED__'} disabled>
								<em>No Existing Config</em>
							</MenuItem>
						)}
						{values.map((item, key) => (
							<MenuItem key={key} value={item[0]}>
								{item[1]}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</section>
		</ThemeProvider>
	)
}

DropDown.propTypes = {
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	current: PropTypes.string.isRequired,
	values: PropTypes.array.isRequired,
	disabled: PropTypes.bool,
}

DropDown.defaultProps = {
	disabled: false,
}

export default DropDown

/* eslint-disable react/forbid-prop-types */
import 'date-fns'
import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers'

const Calendar = ({labelText, onChange, dateValue, className}) => {
	// The first commit of Material-UI
	const [selectedDate, setSelectedDate] = React.useState(
		 new Date(dateValue)
	)

	React.useEffect(() => {
	    setSelectedDate(dateValue);
	})

	const handleDateChange = date => {
		setSelectedDate(date)
		onChange(labelText, date);
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Grid container justify="space-around">
				<KeyboardDatePicker
				    autoOk
					disableToolbar
					variant="inline"
					format="MM/dd/yyyy"
					margin="normal"
					id="date-picker-inline"
					label={labelText}
					value={selectedDate}
					onChange={handleDateChange}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
					InputProps={{ className: className }}
				/>
			</Grid>
		</MuiPickersUtilsProvider>
	)
}

Calendar.propTypes = {
	labelText: PropTypes.string,
	classes: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	dateValue: PropTypes.instanceOf(Date).isRequired
}

Calendar.defaultProps = {
	labelText: 'Date' 
}

export default Calendar

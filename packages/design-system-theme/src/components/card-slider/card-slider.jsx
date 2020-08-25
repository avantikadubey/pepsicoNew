import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'

const useStyles = makeStyles(theme => ({
	card: {
		padding: '10px 20px',
		border: theme.palette.card.border,
		borderRadius: '11px',
	},
	sliderLabelItem: {
		display: 'flex',
	},
	sliderLabel: {
		fontSize: '20px',
		color: theme.palette.grey[800],
		fontWeight: '500',
	},
	sliderValue: {
		fontSize: '30px',
		fontWeight: '700',
		color: theme.palette.grey[800],
		position: 'relative',
		bottom: '6px',
	},
	valueContainer: {
		textAlign: 'right',
	},
}))

function ValueLabelComponent(props) {
	const { children, open, value } = props

	const popperRef = React.useRef(null)
	React.useEffect(() => {
		if (popperRef.current) {
			popperRef.current.update()
		}
	})

	return (
		<Tooltip
			PopperProps={{
				popperRef,
			}}
			open={open}
			enterTouchDelay={0}
			placement="top"
			title={value}
		>
			{children}
		</Tooltip>
	)
}

ValueLabelComponent.propTypes = {
	children: PropTypes.element.isRequired,
	open: PropTypes.bool.isRequired,
	value: PropTypes.number.isRequired,
}

export default function CardSlider({
	id,
	value,
	label,
	handleSliderState,
	sliderColor,
}) {
	const classes = useStyles()

	const CustomSlider = withStyles(theme => ({
		root: {
			color: sliderColor,
			height: 8,
		},
		thumb: {
			height: 24,
			width: 24,
			backgroundColor: sliderColor,
	//		border: `2px solid ${theme.palette.grey[200]}`,
			boxShadow: '1px 1px 5px 1px rgba(0,0,0,0.54)',
			marginTop: -8,
			marginLeft: -12,
			'&:focus,&:hover,&$active': {
				boxShadow: 'inherit',
			},
		},
		active: {},
		valueLabel: {
			left: 'calc(-50% + 4px)',
		},
		track: {
			height: 10,
			borderRadius: 4,
		},
		rail: {
			height: 8,
			borderRadius: 4,
			color: theme.palette.common.black,
		},
	}))(Slider)

	const handleSliderChange = (event, newValue) => {
		handleSliderState(id, newValue)
	}

	return (
		<Card className={classes.card}>
			<Grid container spacing={0}>
				<Grid item sm={12} className={classes.sliderLabelItem}>
					<Grid item sm={10} xs={12}>
						<Typography className={classes.sliderLabel}>{label}</Typography>
					</Grid>
					<Grid item sm={2} xs={12} className={classes.valueContainer}>
						<Typography className={classes.sliderValue}>{value}%</Typography>
					</Grid>
				</Grid>

				<Grid item sm={12} xs={12} className={classes.sliderValueHolder}>
					<CustomSlider
						valueLabelDisplay="auto"
						onChangeCommitted={handleSliderChange}
						defaultValue={value}
					/>
				</Grid>
			</Grid>
		</Card>
	)
}

CardSlider.propTypes = {
	value: PropTypes.number,
	label: PropTypes.string,
	sliderColor: PropTypes.string,
}

CardSlider.defaultProps = {
	value: 25,
	label: 'Default Label for Threshold',
	sliderColor: 'black',
}

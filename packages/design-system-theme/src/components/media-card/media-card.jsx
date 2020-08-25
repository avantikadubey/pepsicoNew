/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Parser } from 'html-to-react'
import NumberFormat from 'react-number-format';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import planogramImage from '../../../static/store/planogram-store.jpg'

const htmlToReactParser = new Parser()

const useStyles = makeStyles(theme =>
	createStyles({
		card: {
			overflow: 'visible',
			boxShadow: theme.palette.card.boxShadow,
			borderRadius: '11px',
			paddingTop: '16px',
			marginRight: '25px',
			border: theme.palette.card.border,
		},
		description: {
			display: 'flex',
			flexDirection: 'column',
		},
		saleNumber: {
			fontSize: '25px!important',
			color: 'gray!important',
			marginRight: 10,
		},
		salesAllocation: {
			display: 'flex',
			flexDirection: 'row',
			'& h3': {
				color: theme.palette.secondary.main,
				display: 'flex',
				flexDirection: 'row',
				'& input': {
					color: theme.palette.secondary.main,
				},
			},
			'& span': {
				alignSelf: 'flex-end',
				color: theme.palette.secondary.main,
				fontSize: '20px',
				lineHeight: '20px',
				padding: '0',
				fontWeight: '500',
			},
		},
		edit: {
			position: 'relative',
			padding: 0,
		},
		editIcon: {
			position: 'absolute',
			right: '-15px',
			bottom: '-12px',
			padding: 0,
			justifyContent: 'center',
			minWidth: 'auto',
			backgroundColor: 'transparent',
			'&:hover': {
				backgroundColor: 'transparent',
			},
		},
		icon: {
			borderRadius: '50%',
			background: theme.palette.primary.main,
			// boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.54)',
			padding: '10px',
			fontSize: '40px',
			'& path': {
				fill: theme.palette.primary.contrastText,
			},
			'&:hover': {
				backgroundColor: theme.palette.secondary.main,
			},
		},
		planogramName: {
			marginTop: '5',
			fontWeight: '700',
			color: theme.palette.common.black,
			fontSize: '24px',
		},
		media: {
			maxWidth: '100%',
			height: '85px',
			margin: '0 16px',
		},
		textField: {
			// border: 'none',
			color: theme.palette.secondary.main,
			cursor: 'pointer',
			margin: 0,
			fontSize: '1.55555rem',
			'& > div': {
				fontSize: '1.55555rem',
				'&  p': {
					fontSize: '1.55555rem',
				},
				'&:before, &:after': {
					display: 'none',
				},
			},
			'& input': {
				color: theme.palette.secondary.main,
				padding: 0,
				textAlign: 'right',
				fontWeight: '700',
				fontSize: '30px',
				position: 'relative',
				left: '1%',
				'&:active, &:hover, &:focus': {
					textDecoration: 'underline',
					cursor: 'pointer',
				},
			},
			'& .MuiInputAdornment-positionStart': {
				marginRight: 2,
				'& .MuiTypography-root': {
					color: theme.palette.secondary.main,
					fontWeight: '700',
					fontSize: '28px',
				},
			},
		},
		info: {
			display: 'block',
			lineHeight: '29px !important',
			paddingLeft: '16px',
			color: theme.palette.secondary.main,
		},
		boxHeading: {
			width: '30%',
		},
		salesRow: {
			display: 'flex',
			alignSelf: 'center',
		},
	})
)

const NumberFormatCustom = (props) => {
	const { inputRef, onChange, ...other } = props;
  
	return (
	  <NumberFormat
		{...other}
		getInputRef={inputRef}
		onValueChange={values => {
		  onChange({
			target: {
			  value: values.value,
			},
		  });
		}}
		isNumericString
		allowNegative={false}
		format="###"
	  />
	);
}
  
NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

const MediaCard = ({
	labels,
	data,
	handleEditClick,
	handleSalesAllocation,
}) => {
	const classes = useStyles()
	return (
		<Card className={classes.card} raised>
			<CardMedia
				className={classes.media}
				// image="store/planogram-store.jpg"
				image={planogramImage}
				title="Contemplative Reptile"
			/>
			<CardContent className={classes.cardContent}>
				<Grid container className={classes.description}>
					<Grid item xs={12} className={classes.salesAllocation}>
						<Grid item xs={8} className={classes.salesRow}>
							<Typography component="span" className={classes.info}>
								{htmlToReactParser.parse(labels)}
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<TextField
								className={classes.textField}
								defaultValue={data.salesAllocation ? data.salesAllocation : 0}
								onChange={handleSalesAllocation(data.pogId)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="start">%</InputAdornment>
									),
									inputComponent: NumberFormatCustom,
									// inputProps:{ maxLength: 3,}
								}}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography
							color="textSecondary"
							component="h5"
							className={classes.planogramName}
						>
							{data.locationCode}
							{data.positionCode && `-${data.positionCode}`}
							{data.subCategory  && `(${data.subCategory})`}
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions className={classes.edit}>
				<Button className={classes.editIcon}>
					<FontAwesomeIcon
						icon={['fas', 'pencil-alt']}
						size="2x"
						className={classes.icon}
						onClick={() => handleEditClick(data.pogId, data.locationCode)}
					/>
				</Button>
			</CardActions>
		</Card>
	)
}

MediaCard.propTypes = {
	labels: PropTypes.string.isRequired,
	data: PropTypes.object,
	handleEditClick: PropTypes.func.isRequired,
	handleSalesAllocation: PropTypes.func.isRequired,
}

MediaCard.defaultProps = {
	data: {
		saleAllocation: 0,
		planogramName: 'XXX',
	},
}

export default MediaCard

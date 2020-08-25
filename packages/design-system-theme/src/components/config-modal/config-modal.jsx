/* eslint-disable react/require-default-props */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	Typography,
	TextField,
	Button,
	Grid,
	FormHelperText,
	CircularProgress,
	IconButton,
	InputAdornment,
} from '@material-ui/core'
import Modal from '@material-ui/core/Modal'
import { AutoCompleteBox } from './../auto-complete-box'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	paper: {
		width: 500,
		minHeight: '225px',
		backgroundColor: theme.palette.common.white,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		alignSelf: 'center',
		left: 0,
		top: 0,
		margin: '0 auto',
		'& h2': {
			textAlign: 'center',
		},
		'&:focus, &:hover, &:active': {
			outline: 'none',
		},
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		border: '1px solid',
		borderColor: theme.palette.grey[400],
		borderRadius: '2px',
		'& .MuiFilledInput-adornedEnd': {
			//	minWidth: '248px',
			'& .MuiFilledInput-input': {
				padding: '12px',
			},
		},
	},
	button: {
		color: theme.palette.primary.contrastText,
		cursor: 'pointer',
		height: 'auto',
		padding: '10px 35px',
		marginTop: '20px',
		marginRight: '20px',
		backgroundColor: theme.palette.primary.main,
		position: 'relative',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	iconButton: {
		color: theme.palette.primary.contrastText,
		cursor: 'pointer',
		height: 'auto',
		// padding: '10px 35px',
		marginTop: '15px',
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	errorText: {
		color: theme.palette.error.main,
	},
	textFont: {
		fontSize: '1.2rem',
	},
	textAlign: {
		textAlign: 'center',
	},
	flexRow: {
		display: 'flex',
	},
	spinner: {
		margin: '0 auto',
	},
	buttonProgress: {
		color: 'green',
		position: 'absolute',
		top: '50%',
		left: '50%',
		// marginTop: -12,
		// marginLeft: -12
	},
}))

const ConfigModal = ({
	open,
	customPlanoName,
	customPlanoRows,
	handleClose,
	data,
	simData,
	handleOnChange,
	handleOnClick,
	alreadyExistStatus,
	modalType,
	deleteSelectedConfig,
	deleteSelectedTemplate,
	addCustomPlanogram,
	handleCheckNameAvailability,
	loading,
	currentLoadingType,
	isLoadingForDeleteConfiguration,
	isLoadingForGetTemplate,
	isLoadingForSaveAsTemplate,
	isLoadingForSaveAsConfiguration,
	isLoadingForSaveSimulationConfiguration,
	isLoadingForDeleteSimConfiguration,
	isLoadingTemplateDelete,
	configData,
	saveAssocTemplate,
	isLoadingAssociateTemplate
}) => {
	const classes = useStyles()

	return (
		<Modal
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			open={open}
			onClose={handleClose}
			className={classes.root}
		>
			{(() => {
				switch (modalType) {
					case 'saveAsConfig':
						return (
							<div className={classes.paper}>
								<Typography variant="h5" component="h2">
									Enter New Configuration Name
								</Typography>
								<form className={classes.container}>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
									>
										<TextField
											className={classes.textField}
											defaultValue={data}
											onChange={handleOnChange}
											margin="normal"
											variant="filled"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{alreadyExistStatus === false && (
															<FontAwesomeIcon
																className={classes.checkIcon}
																icon={['far', 'check']}
																size="lg"
																padding={15}
																color="green"
															/>
														)}
														{alreadyExistStatus === true && (
															<FontAwesomeIcon
																className={classes.errorText}
																icon={['fas', 'times']}
																size="lg"
																padding={15}
															/>
														)}
													</InputAdornment>
												),
												disableUnderline: true,
												inputProps: { maxLength: 20 },
											}}
										/>
										{alreadyExistStatus === true ? (
											<FormHelperText className={classes.errorText}>
												Configuration already Exist
											</FormHelperText>
										) : (
											''
										)}
										{isLoadingForSaveAsConfiguration(
											loading,
											currentLoadingType
										) ? (
											<Grid container spacing={3} justify="center">
												<Grid item xs={12} className={classes.flexRow}>
													<CircularProgress
														color="secondary"
														className={classes.spinner}
														size={50}
													/>
												</Grid>
											</Grid>
										) : (
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												disabled={
													!!(
														data === null ||
														data === '' ||
														alreadyExistStatus === true
													)
												}
												onClick={handleOnClick}
											>
												Submit
											</Button>
										)}
									</Grid>
								</form>
							</div>
						)
					case 'delete':
						return (
							<div className={classes.paper}>
								<Grid container spacing={3} justify="center">
									<Grid item xs={12}>
										<Typography
											variant="h5"
											component="h3"
											className={classes.textFont}
										>
											Are you Sure You Want To Delete The Configuration
										</Typography>
									</Grid>
									{isLoadingForDeleteConfiguration(
										loading,
										currentLoadingType
									) ? (
										<Grid container spacing={3} justify="center">
											<Grid item xs={12} className={classes.flexRow}>
												<CircularProgress
													color="secondary"
													className={classes.spinner}
													size={50}
												/>
											</Grid>
										</Grid>
									) : (
										<Grid item xs={12} className={classes.textAlign}>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={handleClose}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={deleteSelectedConfig}
											>
												Submit
											</Button>
										</Grid>
									)}
								</Grid>
							</div>
						)
						case 'deleteTemplate':
						return (
							<div className={classes.paper}>
								<Grid container spacing={3} justify="center">
									<Grid item xs={12}>
										<Typography
											variant="h5"
											component="h3"
											className={classes.textFont}
										>
											Are you Sure You Want To Delete The Template
										</Typography>
									</Grid>
									{isLoadingTemplateDelete(
										loading,
										currentLoadingType
									) ? (
										<Grid container spacing={3} justify="center">
											<Grid item xs={12} className={classes.flexRow}>
												<CircularProgress
													color="secondary"
													className={classes.spinner}
													size={50}
												/>
											</Grid>
										</Grid>
									) : (
										<Grid item xs={12} className={classes.textAlign}>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={handleClose}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={deleteSelectedTemplate}
											>
												Submit
											</Button>
										</Grid>
									)}	
								</Grid>
							</div>
						)
					case 'saveAsTemplate':
						return (
							<div className={classes.paper}>
								<Typography variant="h5" component="h2">
									Enter New Template Name
								</Typography>
								<form className={classes.container}>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
									>
										<div>
											<TextField
												className={classes.textField}
												defaultValue={data}
												margin="normal"
												variant="filled"
												onChange={handleOnChange}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															{isLoadingForGetTemplate(
																loading,
																currentLoadingType
															) && (
																<CircularProgress
																	className={classes.progress}
																	color="secondary"
																	size={24}
																	thickness={4}
																/>
															)}

															{(alreadyExistStatus === false ||
																alreadyExistStatus !== null) && (
																<FontAwesomeIcon
																	className={classes.checkIcon}
																	icon={['far', 'check']}
																	size="lg"
																	padding={15}
																	color="green"
																/>
															)}
														</InputAdornment>
													),
													disableUnderline: true,
													inputProps: { maxLength: 20 },
												}}
											/>
											<IconButton
												color="primary"
												className={classes.iconButton}
												aria-label="Directions"
												disabled={data === null || data === ''}
												onClick={handleCheckNameAvailability}
											>
												<FontAwesomeIcon
													className={classes.rightIcon}
													icon={['far', 'arrow-right']}
													// color="#3B3A46"
													// size="md"
												/>
											</IconButton>
										</div>
										{alreadyExistStatus === true ? (
											<FormHelperText className={classes.errorText}>
												Template Name already Exist
											</FormHelperText>
										) : (
											''
										)}
										{isLoadingForSaveAsTemplate(loading, currentLoadingType) ? (
											<CircularProgress
												color="secondary"
												className={classes.spinner}
												size={50}
											/>
										) : (
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												disabled={
													alreadyExistStatus === true ||
													alreadyExistStatus === null
														? true
														: false
												}
												onClick={handleOnClick}
											>
												Submit
											</Button>
										)}
									</Grid>
								</form>
							</div>
						)
					case 'saveSimulationConfig':
						return (
							<div className={classes.paper}>
								<Typography variant="h5" component="h2">
									Enter New Configuration Name
								</Typography>
								<form className={classes.container}>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
									>
										<TextField
											className={classes.textField}
											defaultValue={data}
											onChange={handleOnChange}
											margin="normal"
											variant="filled"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														{alreadyExistStatus === false && (
															<FontAwesomeIcon
																className={classes.checkIcon}
																icon={['far', 'check']}
																size="lg"
																padding={15}
																color="green"
															/>
														)}
														{alreadyExistStatus === true && (
															<FontAwesomeIcon
																className={classes.errorText}
																icon={['fas', 'times']}
																size="lg"
																padding={15}
															/>
														)}
													</InputAdornment>
												),
												disableUnderline: true,
												inputProps: { maxLength: 20 },
											}}
										/>
										{alreadyExistStatus === true ? (
											<FormHelperText className={classes.errorText}>
												Configuration already Exist
											</FormHelperText>
										) : (
											''
										)}
										{isLoadingForSaveSimulationConfiguration(
											loading,
											currentLoadingType
										) ? (
											<Grid container spacing={3} justify="center">
												<Grid item xs={12} className={classes.flexRow}>
													<CircularProgress
														color="secondary"
														className={classes.spinner}
														size={50}
													/>
												</Grid>
											</Grid>
										) : (
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												disabled={
													!!(
														data === null ||
														data === '' ||
														alreadyExistStatus === true
													)
												}
												onClick={handleOnClick}
											>
												Submit
											</Button>
										)}
									</Grid>
								</form>
							</div>
						)
					case 'deleteSimulationConfig':
						return (
							<div className={classes.paper}>
								<Grid container spacing={3} justify="center">
									<Grid item xs={12}>
										<Typography
											variant="h5"
											component="h3"
											className={classes.textFont}
										>
											Are you Sure You Want To Delete The Configuration
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<AutoCompleteBox
											label="Simulation Configuration"
											suggestionData={simData}
											handleOnChange={handleOnChange}
										/>
									</Grid>
									{isLoadingForDeleteSimConfiguration(
										loading,
										currentLoadingType
									) ? (
										<Grid container spacing={3} justify="center">
											<Grid item xs={12} className={classes.flexRow}>
												<CircularProgress
													color="secondary"
													className={classes.spinner}
													size={50}
												/>
											</Grid>
										</Grid>
									) : (
										<Grid item xs={12} className={classes.textAlign}>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={handleClose}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={deleteSelectedConfig}
											>
												Submit
											</Button>
										</Grid>
									)}
								</Grid>
							</div>
						)
					case 'addPlanogram':
						return (
							<div className={classes.paper}>
								<Grid container spacing={3} justify="center">
									<Grid item xs={12}>
										<Typography
											variant="h5"
											component="h3"
											className={classes.textAlign}
										>
											Enter Below Details for New Planogram
										</Typography>
									</Grid>
									<Grid item xs={6} className={classes.textAlign}>
										<TextField
											className={classes.textField}
											label={'Name'}
											onBlur={customPlanoName}
											margin="normal"
											variant="filled"
										/>
									</Grid>
									<Grid item xs={6} className={classes.textAlign}>
										<TextField
											className={classes.textField}
											label={'Row Count'}
											onBlur={customPlanoRows}
											margin="normal"
											variant="filled"
											type="number"
										/>
									</Grid>
									<Grid item xs={12} className={classes.textAlign}>
										<Button
											variant="contained"
											component="span"
											className={classes.button}
											onClick={addCustomPlanogram}
										>
											Submit
										</Button>
									</Grid>
								</Grid>
							</div>
						)
						case 'copyTemplate':
						return (
							<div className={classes.paper}>
								<Grid container spacing={3} justify="center">
									<Grid item xs={12}>
										<Typography
											variant="h5"
											component="h3"
											className={classes.textFont}
										>
											Are you Sure You Want To Copy The Template
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<AutoCompleteBox
											label="Configuration"
											suggestionData={configData}
											handleOnChange={handleOnChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											className={classes.textField}
											label={'New Planogram'}
											onChange={customPlanoName}
											defaultValue={data}
											margin="normal"
											variant="filled"
										/>
									</Grid>
									{isLoadingAssociateTemplate(
										loading,
										currentLoadingType
									) ? (
										<Grid container spacing={3} justify="center">
											<Grid item xs={12} className={classes.flexRow}>
												<CircularProgress
													color="secondary"
													className={classes.spinner}
													size={50}
												/>
											</Grid>
										</Grid>
									) : (
										<Grid item xs={12} className={classes.textAlign}>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={handleClose}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												component="span"
												className={classes.button}
												onClick={saveAssocTemplate}
											>
												Submit
											</Button>
										</Grid>
									)}
								</Grid>
							</div>
						)
					default:
						return <div> </div>
				}
			})()}
		</Modal>
	)
}

ConfigModal.propTypes = {
	data: PropTypes.string,
	simData: PropTypes.array,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	handleCheckNameAvailability: PropTypes.func,
	handleOnChange: PropTypes.func,
	handleOnClick: PropTypes.func,
	alreadyExistStatus: PropTypes.bool,
	modalType: PropTypes.string,
	deleteSelectedConfig: PropTypes.func,
	deleteSelectedTemplate: PropTypes.func,
	loading: PropTypes.bool,
	currentLoadingType: PropTypes.number,
	isLoadingForDeleteConfiguration: PropTypes.func,
	isLoadingForGetTemplate: PropTypes.func,
	isLoadingForSaveAsTemplate: PropTypes.func,
	isLoadingForSaveAsConfiguration: PropTypes.func,
	isLoadingForSaveSimulationConfiguration: PropTypes.func,
}

export default ConfigModal

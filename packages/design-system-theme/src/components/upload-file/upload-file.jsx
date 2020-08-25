import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
	Paper,
	Grid,
	Typography,
	Button,
	CircularProgress,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
	},
	cta: {
		backgroundColor: theme.palette.grey[50],
	},
	dropArea: {
		border: 'solid 40px transparent',
		transition: 'all 250ms ease-in-out 0s',
		'& Over': {
			border: 'solid 40px rgba(0, 0, 0, 0.2)',
		},
	},
	status: {
		background: 'transparent',
		display: 'block',
		transition: 'all 250ms ease-in-out 0s',
	},
	ctaUpload: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		boxShadow: 'none',
		padding: '8px 20px',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	browseText: {
		color: theme.palette.secondary.main,
		cursor: 'pointer',
	},
	responseText: {
		color: 'green',
	},
	spinner: {
		margin: '0 auto',
	},
	flexRow: {
		display: 'flex',
	},
	alignButton:{
		textAlign: 'center',
        marginTop: '20px',
        marginBottom: '20px'
	}
}))

const UploadFile = ({
	onDragEnter,
	onDragLeave,
	onDrop,
	onDragOver,
	status,
	onClickHandler,
	onChangeFile,
	browseOption,
	ctaDisabledStatus,
	currentLoadingType,
	loading,
	isLoadingUploadFile,
}) => {
	const classes = useStyles()
	const fileUploader = React.createRef()

	const openDialogue = () => {
		fileUploader.current.click()
	}

	return (
		<Paper
			className={classes.root}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			onDragOver={onDragOver}
		>
			<Grid
				container
				direction="column"
				justify="space-between"
				alignItems="center"
				spacing={5}
			>
				<Grid item xs={12}>
					<FontAwesomeIcon icon={['fas', 'download']} size="5x" />
				</Grid>
				{isLoadingUploadFile(loading, currentLoadingType) ? (
					<Grid container spacing={3} justify="center">
						<Grid item xs={12} className={classes.flexRow}>
							<CircularProgress color="secondary" className={classes.spinner} size={50} />
						</Grid>
					</Grid>
				) : (
					<Grid>
						<Grid item xs={12}>
							<Typography variant="h5" component="h4" className="Status">
								{browseOption === true ? (
									<span onClick={openDialogue} className={classes.browseText}>
										<input
											type="file"
											ref={fileUploader}
											style={{ display: 'none' }}
											onChange={onChangeFile}
										/>
										Choose{' '}
									</span>
								) : (
									''
								)}
								{status}
							</Typography>
						</Grid>
						<Grid item xs={12} className={classes.alignButton}>
							<Button
								variant="contained"
								className={classes.ctaUpload}
								onClick={onClickHandler}
								disabled={ctaDisabledStatus}
							>
								Upload
							</Button>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Paper>
	)
}

UploadFile.propTypes = {
	onClick: PropTypes.func,
	ctaDisabledStatus: PropTypes.bool,
	loading: PropTypes.bool,
	currentLoadingType: PropTypes.number,
}

export default UploadFile

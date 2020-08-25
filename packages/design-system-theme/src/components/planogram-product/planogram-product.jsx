import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { css, keyframes } from '@emotion/core'
import { Tooltip, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles'
import Zoom from '@material-ui/core/Zoom'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	productUPC: {
		fontSize: '12px',
		fontWeight: '700',
		color: theme.palette.common.black,
	},
	productUPCSpan: {
		backgroundColor: theme.palette.grey[200],
		padding: '2px',
	},
	productSize: {
		color: theme.palette.common.black,
	},
	indicator: {
		height: '12px',
		width: '12px',
		borderRadius: '50%',
		display: 'inline-block',
		marginLeft: '5px',
	},
	indicatorSection: {
		margin: 'auto',
		marginTop: '11px',
	},
	myproductContainer: {
		textAlign: 'center',
		marginTop: '20px',
	},
	imgContainer: {
		display: 'inline-block',
		width: '70px',
		'&:hover': {
			border: '2px solid',
			borderColor: theme.palette.secondary.main,
			padding: '3px 3px 0px 3px',
			borderRadius: '4px',
			width: '90px',
		}
	},
	imageCss: {
		width: '100%',
		height: '100%',
		cursor: 'pointer',
	},
}))

const fadeIn = keyframes`
  0% {
    opacity: 0;
    top: 100px;
  }
  75% {
    opacity: 0.5;
    top: 0px;
  }
  100% {
    opacity: 1;
  }
`

export const gridBox = (tranformScale, index) => css`
	animation: ${fadeIn} 0.75s linear;
	-webkit-animation-delay: ${index * 0.25}s;
	animation-delay: ${index * 0.25}s;

	& :hover {
		transform: ${tranformScale};

		background-color: #fafafa;

		/* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
	}
`

export const productContainer = zoom => {
	// const transform = zoom
	// 	? `scale(
	// 	1.5
	// )`
	// 	: 'none'
	// return gridBox(transform)
}

const PlanogramProduct = React.memo(
	({
		productUPC,
		productBDC,
		category,
		description,
		imageUrl,
		productSize,
		replaceHandler,
		toolTip,
	}) => {
		//	const theme = useTheme();
		const classes = useStyles()

		const toolTipMessage = 'No Product Selected for Replacement';
		
		const toolTipTittle = `${category ? category : ' '} - ${description ? description : ' '} (${productSize ?
			productSize : ' '})`


		const toolTipHtml = (<div>

			<div>
				
			<Grid item xs style={{
						marginBottom: '5px',
						textAlign:'center'
					}}>
						<Typography variant="h5" component="h5">
						{toolTipTittle}
						</Typography>
			</Grid>
			
				<Grid
					container
					spacing={2}
					direction="row"
					justify="center"
					alignItems="center"
				> 
					<Grid item>
						<div
							style={{
								maxWidth: '120px',
								textAlign: 'center',
								display: 'block'
							}}
						>
							<img
								src={imageUrl}
								style={{
									objectFit: 'contain',
									maxWidth: '100%',
									maxHeight: '100%',
								}}
							/>
						</div>
					</Grid>
					<Grid item xs={12} sm container>
						<Grid item xs container>
							<Grid item xs>
								<Typography variant="h6" component="h6">
									UPC: <span>{productUPC}</span>
								</Typography>
								{productBDC ? (
									<Typography variant="h6" component="h6">
										BDC: <span>{productBDC}</span>
									</Typography>
								) : (
										''
									)}

								{/* <Typography variant="h6" component="h6">
                  Available Qty:{' '}
                  <span>{`${currentPosition.availableQty}/10`}</span> */}
								{/* {currentPosition.units} */}
								{/* </Typography> */}
							</Grid>
						</Grid>
					</Grid>
					
					<Grid style={{
						padding: '3px',
						backgroundColor: '#424242',
						color: '#fff',
						borderRadius: '4px',

					}}
					>{toolTip ? toolTipMessage : ' '}</Grid>
				</Grid>
			</div>
		</div>);

		return (
			<div
				className={classes.myproductContainer}
				onClick={() => replaceHandler(productUPC, productBDC)}
			>
				<div css={productContainer({})}>
					<div className={classes.productSize}>{productSize}</div>

					<HtmlTooltip
						title={toolTipHtml}
						placement="right"
						TransitionComponent={Zoom}
					>
						<div className={classes.imgContainer}>
							<img
								src={imageUrl}
								alt={imageUrl}
								onError={e => {
									e.target.onerror = null
									e.target.src = 'pog/0000.jpg'
								}}
								className={classes.imageCss}
								loading="lazy"
							/>
						</div>

					</HtmlTooltip>
					{/* <Tooltip
						title={toolTip ? toolTipMessage : ' '}
						placement="top"
						disableHoverListener={!toolTip}
					>
						
					</Tooltip> */}

					<div className={classes.productUPC}>
						<span className={classes.productUPCSpan}>{productUPC}
						</span>
					</div>
				</div>
			</div>
		)
	}
)

PlanogramProduct.propTypes = {
	productUPC: PropTypes.string.isRequired,
	productBDC: PropTypes.string.isRequired,
	imageUrl: PropTypes.string.isRequired,
	productSize: PropTypes.string.isRequired,
	replaceHandler: PropTypes.func.isRequired,
	toolTip: PropTypes.bool.isRequired,
}


const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		padding: 20,
		fontSize: theme.typography.pxToRem(12),
		border: '1px solid #dadde9',
		// '& img': {
		//   maxWidth: '100%',
		//   backgroundColor: 'red',
		// },
		'& h6': {
			fontSize: '12px',
			fontWeight: 'bold'
		},
		'& h5': {
			fontSize: '14px',
			fontWeight: 'bold'
		},
		'& span': {
			fontWeight: 300
		}
	}
}))(Tooltip);

export default PlanogramProduct

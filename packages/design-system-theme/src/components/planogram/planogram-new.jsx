/* eslint-disable operator-assignment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { withStyles } from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { InputControl } from '../input-control'

export const productStyles = (x, y, w, h, scale, topScale) => css`
	margin-top: ${topScale * 5}px;
	margin-bottom: ${topScale * 5}px;
	margin-left: ${x + 5}px;
	margin-right: ${x + 5}px;
	position: absolute;
	width: ${w * scale}px;
	height: ${h * scale}px;
	top: ${y * scale}px;
	left: ${x * scale}px;

	& img {
		width: 100%;
		height: 100%;
		margin: 0;
	}

	& p {
		text-transform: uppercase;
		font-family: sans-serif;
		font-size: 8px;
		font-weight: 600;
		text-align: center;
		padding: 1px;
		margin: 0;
		padding: 0;
		background-color: lightgrey;
	}
	/* 	& :hover,
	:focus {
		transform: scale(1.5);
		z-index: 9999;
	} */
`

const Product = React.memo(
	({ id, image, x, y, w, h, offset, stackItem, yFacings, thumbNail, zoom }) => {
	//	console.log(zoom)
		const scale = thumbNail ? 1 : zoom

		let topScale = stackItem ? Math.abs(y - offset) : y
		const renderProduct = (yFacings, x, y, w, D, scale, topScale) => {
			let products = []
			for (let i = 0; i < yFacings; i += 1) {
				let top = y + i * h
				const product = (
					<div css={productStyles(x, top, w, h, scale, topScale)}>
						<img
							src={image}
							alt={image}
							onError={e => {
								e.target.onerror = null
								e.target.src = 'pog/00000.jpg'
							}}
							loading="lazy"
						/>
					{/* 	{i === yFacings - 1 && <p style={{ height: '30px' }}><InputControl /></p>} */}
					</div>
				)

				products.push(product)
			}
			return <>{products}</>
		}

		return <div>{renderProduct(yFacings, x, y, w, h, scale, topScale)}</div>
	}
)

Product.propTypes = {
	id: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	w: PropTypes.number.isRequired,
	h: PropTypes.number.isRequired,
	thumbNail: PropTypes.bool,
}

Product.defaultProps = {
	thumbNail: false,
}

const Position = React.memo(({ id, layout, previousLayout, ...other }) => {
	// console.log(`pog/${id.slice(-5)}.jpg`, layout)
	const productLayout = layout
	if (previousLayout !== null && typeof previousLayout !== 'undefined') {
		const { y, h } = previousLayout
		if (productLayout.y === y && productLayout.h > h) {
			// If product height is more then adjust the starting point
			//	productLayout.y = productLayout.y - (productLayout.h - h)
		}
	}
	return (
		<Product
			{...productLayout}
			image={`pog/${id.toString().slice(-5)}.jpg`}
			id={id}
			{...other}
		/>
	)
})

Position.propTypes = {
	id: PropTypes.string.isRequired,
	layout: PropTypes.object.isRequired,
	previousLayout: PropTypes.object,
}

Position.defaultProps = {
	previousLayout: null,
}

const Fixture = React.memo(({ id, prodIds, layouts, ...other }) => {
	//	console.log(id, prodIds, layouts)
	return (
		<>
			{prodIds.map((productId, index) => (
				<Position
					id={productId}
					key={`${id}-${productId}-${index}`}
					layout={layouts[index]}
					previousLayout={layouts[index - 1]}
					{...other}
				/>
			))}
		</>
	)
})

Fixture.propTypes = {
	id: PropTypes.string.isRequired,
	prodIds: PropTypes.array.isRequired,
	layouts: PropTypes.array.isRequired,
}

export const SegmentContainer = styled.div(({ padding }) => ({
	width: '100%',
	height: '100%',
	/* 	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column', */
	margin: 'auto',
	padding,
	position: 'relative',
}))

const Segment = React.memo(({ fixtures, ...other }) => {
	return (
		<SegmentContainer>
			{fixtures.map(item =>
				Object.entries(item).map(entry => {
					const fixtureId = entry[0]
					const fixture = entry[1]
					return (
						<Fixture
							id={fixtureId}
							{...fixture}
							key={fixtureId}
							{...other}
						></Fixture>
					)
				})
			)}
		</SegmentContainer>
	)
})

Segment.propTypes = {
	fixtures: PropTypes.array.isRequired,
}

export const PlanogramContainer = styled.div(({ padding }) => ({
	height: 'auto',
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column',
	margin: 'auto',
	padding,
}))

class PlanogramNew extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			segments: props.data.segments,
			loading: false,
			items: props.data.segments.slice(0, 3),
			currentSlice: 3,
		}
	}

	componentDidMount() {
		/* 		setTimeout(() => {
			const { segments, items, currentSlice } = this.state
			if (currentSlice < segments.length) {
				const nextSlice = segments.length
				const newItems = [
					...items,
					...segments.slice(currentSlice, segments.length),
				]
				this.setState({ items: newItems, currentSlice: nextSlice, loading: false })
			}
		}, 600) */
	}

	render() {
		const { items, loading } = this.state
		const { classes, padding, zoom, ...other } = this.props
		return (
			<>
				{loading && <CircularProgress color="secondary" className={classes.spinner} size={50} />}
				<PlanogramContainer padding={padding}>
					{items.map(segment =>
						Object.entries(segment).map(entry => (
							<Segment {...entry[1]} key={entry[0]} zoom={zoom} {...other} />
						))
					)}
				</PlanogramContainer>
			</>
		)
	}
}

PlanogramNew.propTypes = {
	padding: PropTypes.string.isRequired,
	thumbNail: PropTypes.bool,
	data: PropTypes.object,
	zoom: PropTypes.number,
}

PlanogramNew.defaultProps = {
	thumbNail: false,
	zoom: 6,
	data: { segments: [] },
}

export default withStyles(theme => ({
	spinner: {
		color: theme.palette.primary.main,
	},
}))(PlanogramNew)

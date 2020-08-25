import React from 'react'
import PropTypes from 'prop-types'
import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'

export const ProductShelfContainer = styled.div(({ layout, thumbnail }) => {
	let gridTemplateRows = ''
	let gridTemplateColumns = ''
	const rows = layout.length
	for (let i = 0; i < rows; i += 1) {
		gridTemplateRows += thumbnail
			? `minmax(1px, ${layout[i].h}fr)) `
			: `minmax(1px, ${layout[i].h}fr)) `
	}
	for (let i = 0; i < rows; i += 1) {
		gridTemplateColumns += `minmax(20px, ${layout[i].w}fr) `
	}
	return {
		display: 'grid',
		backgroundColor: '#fff',
		gridTemplateRows,
		gridTemplateColumns,
		justifyItems: 'center',
		gridGap: '0rem 0.1rem',
		width: '100%',
		margin: !thumbnail ? '5px' : '0px',
	}
})

export const Container = styled.div(({ width, padding }) => ({
	width,
	height: 'auto',
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column',
	margin: 'auto',
	backgroundColor: '#fff',
	padding,
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
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	animation: ${fadeIn} 0.75s linear;
	-webkit-animation-delay: ${index * 0.25}s;
	animation-delay: ${index * 0.25}s;

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

	& :hover {
		transform: ${tranformScale}; /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
	}
`

export const productContainer = zoom => {
	const transform = zoom
		? `scale(
		1.5
	)`
		: 'none'
	return gridBox(transform)
}

export const Product = ({ zoom, thumbnail, image, label }) => (
	<div css={productContainer(zoom)}>
		<img src={image} alt={label} />
		{!thumbnail && <p>{label}</p>}
	</div>
)

Product.propTypes = {
	zoom: PropTypes.bool.isRequired,
	thumbnail: PropTypes.bool.isRequired,
	image: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
}

export const Shelf = styled.div(() => {
	return {
		width: '100%',
		height: '4px',
		margin: '1px',
		backgroundColor: 'darkslategrey',
	}
})

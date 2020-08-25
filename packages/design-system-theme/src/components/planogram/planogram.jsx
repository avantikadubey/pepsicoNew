/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import {
	Container,
	ProductShelfContainer,
	Product,
	Shelf,
} from './planogram-styles'

const PlanogramShelf = ({ products, layout, thumbnail }) => {
	return (
		<>
			<ProductShelfContainer layout={layout} thumbnail={thumbnail}>
				{products.map(({ image, label }) => (
					<Product
						key={label}
						image={image}
						label={label}
						thumbnail={thumbnail}
						zoom={!thumbnail}
					/>
				))}
			</ProductShelfContainer>
			{!thumbnail && <Shelf />}
		</>
	)
}

PlanogramShelf.propTypes = {
	products: PropTypes.array.isRequired,
	layout: PropTypes.bool.isRequired,
	thumbnail: PropTypes.bool.isRequired,
}

const Planogram = ({ width, padding, data, thumbnail }) => {
	return (
		<Container width={width} padding={padding}>
			{data.map(({ products, layout }, index) => (
				<PlanogramShelf
					products={products}
					layout={layout}
					thumbnail={thumbnail}
					key={index}
				/>
			))}
		</Container>
	)
}

Planogram.propTypes = {
	width: PropTypes.string.isRequired,
	padding: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	thumbnail: PropTypes.bool.isRequired,
}
export default Planogram

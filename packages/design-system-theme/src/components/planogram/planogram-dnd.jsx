/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd'
import {
	Container,
	ProductShelfContainer,
	productContainer,
	Shelf,
} from './planogram-styles'

export const ProductDnD = ({
	id,
	zoom,
	thumbnail,
	image,
	label,
	type,
	index,
}) => {
	return (
		<Droppable droppableId={id} type={type}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					/* isDraggingOver={snapshot.isDraggingOver} */
				>
					<Draggable draggableId={id} index={index}>
						{(provided, snapshot) => (
							<div
								css={productContainer(zoom, index)}
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								/* 	isDragging={snapshot.isDragging} */
							>
								<img src={image} alt={label} />
								{!thumbnail && <p>{label}</p>}
							</div>
						)}
					</Draggable>
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	)
}

ProductDnD.propTypes = {
	id: PropTypes.string.isRequired,
	zoom: PropTypes.bool,
	thumbnail: PropTypes.bool.isRequired,
	image: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	index: PropTypes.any.isRequired,
}

ProductDnD.defaultProps = {
	zoom: false,
}

const PlanogramDndShelf = ({ products, layout, thumbnail }) => {
	return (
		<>
			<ProductShelfContainer layout={layout} thumbnail={thumbnail}>
				{products.map(({ id, image, label, type }, index) => (
					<ProductDnD
						id={id}
						key={label}
						image={image}
						label={label}
						thumbnail={thumbnail}
						type={type}
						index={index}
					/>
				))}
			</ProductShelfContainer>
			{!thumbnail && <Shelf />}
		</>
	)
}

PlanogramDndShelf.propTypes = {
	products: PropTypes.array.isRequired,
	layout: PropTypes.array.isRequired,
	thumbnail: PropTypes.bool.isRequired,
}

class PlanogramDnD extends React.Component {
	// TODO: Temporary solution
	// This needs to be replaced with better state management
	// as described here https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
	// eslint-disable-next-line react/destructuring-assignment
	state = this.props.data

	onDragStart = start => {
		/* 	console.log(start);
		const shelf = Object.entries(this.state.shelfs).find((shelf) => {
			const key = shelf[0];
			const value = shelf[1];
			//		console.log(key, value);
			if (value.prodIds.includes(start.draggableId)) return true;
			else return false;
		});
		this.setState({
			dragLayout: shelf[1].layout[shelf[1].prodIds.indexOf(start.draggableId)]
		}); */
	}

	onDragEnd = result => {
		const { destination, source, draggableId } = result

		if (!destination) {
			return
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return
		}

		// const start = this.state.products[source.droppableId];
		// const finish = this.state.products[destination.droppableId];

		const start = Object.entries(this.state.shelfs).find(shelf => {
			const key = shelf[0]
			const value = shelf[1]
			//		console.log(key, value);
			if (value.prodIds.includes(source.droppableId)) return true
			return false
		})
		const finish = Object.entries(this.state.shelfs).find(shelf => {
			const key = shelf[0]
			const value = shelf[1]
			if (value.prodIds.includes(destination.droppableId)) return true
			return false
		})
		//		console.log(start);
		//	console.log(finish);
		//		console.log(start[1].prodIds.indexOf(source.droppableId));
		const startIndex = start[1].prodIds.indexOf(source.droppableId)
		const destinationIndex = finish[1].prodIds.indexOf(destination.droppableId)
		//	console.log(startIndex);
		// Moving an item which same shelf
		if (start[0] === finish[0]) {
			const newProdIds = Array.from(start[1].prodIds)
			newProdIds.splice(startIndex, 1, destination.droppableId)
			//		console.log(newProdIds);
			newProdIds.splice(destinationIndex, 1, source.droppableId)
			//		console.log(newProdIds);
			const newShelf = {
				...start[1],
				prodIds: newProdIds,
			}
			//	console.log(newShelf);
			const newState = {
				...this.state,
				shelfs: { ...this.state.shelfs, [newShelf.id]: newShelf },
			}
			//			console.log(newState);
			this.setState(newState)
			return
		}

		// Moving from one shelf to another

		const startProdIds = Array.from(start[1].prodIds)
		startProdIds.splice(startIndex, 1, destination.droppableId)
		const newStart = {
			...start[1],
			prodIds: startProdIds,
		}
		const finishProdIds = Array.from(finish[1].prodIds)
		finishProdIds.splice(destinationIndex, 1, source.droppableId)

		const newFinish = {
			...finish[1],
			prodIds: finishProdIds,
		}

		const newState = {
			...this.state,
			shelfs: {
				...this.state.shelfs,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish,
			},
		}

		this.setState(newState)
	}

	getShelfByProdId = prodId =>
		Object.entries(this.state.shelfs).find(shelf => {
			const value = shelf[1]
			if (value.prodIds.includes(prodId)) return true
			return false
		})

	onDragUpdate = update => {
		/* 		const { source, destination } = update;
		const { dropLayout } = this.state;
		if (typeof source === 'undefined' || source === null) return;
		if (typeof destination === 'undefined' || destination === null) return;

		const sourceShelf = this.getShelfByProdId(source.droppableId);
		const sourceLayout = sourceShelf[1].layout[sourceShelf[1].prodIds.indexOf(source.droppableId)];
		const destinationShelf = this.getShelfByProdId(destination.droppableId);
		const destinationLayout = destinationShelf[1].layout[destinationShelf[1].prodIds.indexOf(destination.droppableId)];
		console.log(JSON.stringify(sourceLayout));
		console.log(JSON.stringify(destinationLayout));
		this.setState({
			isDropDisabled: JSON.stringify(sourceLayout) !== JSON.stringify(destinationLayout)
		}); */
		/*
  this.setState({dropLayout: shelf[1].layout[shelf[1].prodIds.indexOf(destination.droppableId)]});
	console.log(destination);
		const opacity = destination
      ? destination.index / Object.keys(this.state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153,141,217,${opacity})`; */
	}

	render() {
		const { width, padding, thumbnail } = this.props
		//		const { isDropDisabled } = this.state;
		//	console.log(isDropDisabled);
		return (
			<DragDropContext
				onDragEnd={this.onDragEnd}
				onDragStart={this.onDragStart}
				onDragUpdate={this.onDragUpdate}
			>
				<Container width={width} padding={padding}>
					{this.state.shelfOrder.map((shelfId, index) => {
						const shelf = this.state.shelfs[shelfId]
						const products = shelf.prodIds.map(
							prodIds => this.state.products[prodIds]
						)
						return (
							<PlanogramDndShelf
								products={products}
								layout={shelf.layout}
								thumbnail={thumbnail}
								key={index}
							/>
						)
					})}
				</Container>
			</DragDropContext>
		)
	}
}

PlanogramDnD.propTypes = {
	data: PropTypes.object.isRequired,
	width: PropTypes.string.isRequired,
	padding: PropTypes.string.isRequired,
	thumbnail: PropTypes.bool,
}

PlanogramDnD.defaultProps = {
	thumbnail: false,
}

export default PlanogramDnD

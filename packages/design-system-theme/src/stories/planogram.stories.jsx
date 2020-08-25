/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from '@material-ui/styles'
import theme from '../theme'
import {
	Planogram,
	PlanogramDnD,
	PlanogramNew,
} from '../components/planogram'
import pogData from './planogram-data'
import getRenderingData from '../utils/data-flattener'


const initialData = {
	products: {
		'prod-1': { id: 'prod-1', image: '1.jpg', label: '5701', type: 'SINGLE' },
		'prod-2': { id: 'prod-2', image: '2.jpg', label: '5702', type: 'SINGLE' },
		'prod-3': { id: 'prod-3', image: '3.jpg', label: '5703', type: 'SINGLE' },
		'prod-4': { id: 'prod-4', image: '4.jpg', label: '5704', type: 'SINGLE' },
		'prod-5': { id: 'prod-5', image: '5.jpg', label: '5705', type: 'DOUBLE' },
		'prod-6': { id: 'prod-6', image: '6.jpg', label: '5706', type: 'SINGLE' },
		'prod-7': { id: 'prod-7', image: '1.jpg', label: '5707', type: 'SINGLE' },
		'prod-8': { id: 'prod-8', image: '2.jpg', label: '5708', type: 'SINGLE' },
		'prod-9': { id: 'prod-9', image: '3.jpg', label: '5709', type: 'SINGLE' },
		'prod-10': { id: 'prod-10', image: '4.jpg', label: '5710', type: 'SINGLE' },
		'prod-11': { id: 'prod-11', image: '5.jpg', label: '5711', type: 'DOUBLE' },
		'prod-12': { id: 'prod-12', image: '6.jpg', label: '5712', type: 'SINGLE' },
		'prod-13': { id: 'prod-13', image: '1.jpg', label: '5713', type: 'SINGLE' },
		'prod-14': { id: 'prod-14', image: '2.jpg', label: '5714', type: 'SINGLE' },
		'prod-15': { id: 'prod-15', image: '3.jpg', label: '5715', type: 'SINGLE' },
		'prod-16': { id: 'prod-16', image: '4.jpg', label: '5716', type: 'SINGLE' },
		'prod-17': { id: 'prod-17', image: '5.jpg', label: '5717', type: 'DOUBLE' },
		'prod-18': { id: 'prod-18', image: '6.jpg', label: '5718', type: 'SINGLE' },
	},
	shelfs: {
		'shelf-1': {
			id: 'shelf-1',
			title: 'Shelf 1',
			prodIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'],
			layout: [
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 2, h: 1 },
				{ w: 1, h: 1 },
			],
		},
		'shelf-2': {
			id: 'shelf-2',
			title: 'Shelf 2',
			prodIds: ['prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12'],
			layout: [
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 2, h: 1 },
				{ w: 1, h: 1 },
			],
		},
		'shelf-3': {
			id: 'shelf-3',
			title: 'Shelf 3',
			prodIds: [
				'prod-13',
				'prod-14',
				'prod-15',
				'prod-16',
				'prod-17',
				'prod-18',
			],
			layout: [
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 1, h: 1 },
				{ w: 2, h: 1 },
				{ w: 1, h: 1 },
			],
		},
	},
	shelfOrder: ['shelf-1', 'shelf-2', 'shelf-3'],
}

const data = [
	{
		layout: [
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 1, h: 1 },
		],
		products: [
			{ id: 'prod-1', image: '1.jpg', label: '5701' },
			{ id: 'prod-2', image: '2.jpg', label: '5702' },
			{ id: 'prod-3', image: '3.jpg', label: '5703' },
			{ id: 'prod-4', image: '4.jpg', label: '5704' },
			{ id: 'prod-5', image: '5.jpg', label: '5705' },
			{ id: 'prod-6', image: '6.jpg', label: '5706' },
		],
	},
	{
		layout: [
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 1, h: 1 },
		],
		products: [
			{ id: 'prod-7', image: '1.jpg', label: '5701' },
			{ id: 'prod-8', image: '2.jpg', label: '5702' },
			{ id: 'prod-9', image: '3.jpg', label: '5703' },
			{ id: 'prod-10', image: '4.jpg', label: '5704' },
			{ id: 'prod-11', image: '5.jpg', label: '5705' },
			{ id: 'prod-12', image: '6.jpg', label: '5706' },
		],
	},
	{
		layout: [
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 1, h: 1 },
		],
		products: [
			{ id: 'prod-13', image: '1.jpg', label: '5701' },
			{ id: 'prod-14', image: '2.jpg', label: '5702' },
			{ id: 'prod-15', image: '3.jpg', label: '5703' },
			{ id: 'prod-16', image: '4.jpg', label: '5704' },
			{ id: 'prod-17', image: '5.jpg', label: '5705' },
			{ id: 'prod-18', image: '6.jpg', label: '5706' },
		],
	},
	{
		layout: [
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 1, h: 1 },
			{ w: 2, h: 1 },
			{ w: 1, h: 1 },
		],
		products: [
			{ id: 'prod-19', image: '1.jpg', label: '5701' },
			{ id: 'prod-20', image: '2.jpg', label: '5702' },
			{ id: 'prod-21', image: '3.jpg', label: '5703' },
			{ id: 'prod-22', image: '4.jpg', label: '5704' },
			{ id: 'prod-23', image: '5.jpg', label: '5705' },
			{ id: 'prod-24', image: '6.jpg', label: '5706' },
		],
	},
]

class PlanoWithScroll extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			height: props.height,
			width: props.width,
			currentX: 0,
		}
		this.osComponentRef = React.createRef()
	}

	handleScrollLeft = control => {
		const { currentX } = this.state
		const osInstance = control.current.osInstance()
		const position = currentX - 600 > 0 ? currentX - 600 : 0
		osInstance.scroll({ x: position, top: 0 }, 1000)
		this.setState({ currentX: position })
	}

	handleScrollRight = control => {
		const { currentX } = this.state
		const osInstance = control.current.osInstance()
		const position =
			currentX + 600 < osInstance.scroll().max.x
				? currentX + 600
				: osInstance.scroll().max.x
		osInstance.scroll({ x: position, top: 0 }, 1000)
		this.setState({ currentX: position })
	}

	render() {
		const { classes } = this.props
		const { height, width } = this.state
		return (
			<Grid container className={classes.root} spacing={1}>
				<Grid item xs={2}>
					<Paper className={classes.paper} elevation={0}>
						{' '}
						<Button
							variant="contained"
							color="primary"
							onClick={() => this.handleScrollLeft(this.osComponentRef)}
						>
							{'<'}
						</Button>
					</Paper>
				</Grid>
				<Grid item xs={8}>
					<Paper className={classes.paper} elevation={0}>
						<OverlayScrollbarsComponent
							style={{ height, width }}
							ref={this.osComponentRef}
							className="os-theme-round-dark"
						>
							<PlanogramNew padding="10px" data={getRenderingData(true)} />
						</OverlayScrollbarsComponent>
					</Paper>
				</Grid>
				<Grid item xs={2}>
					<Paper className={classes.paper} elevation={0}>
						{' '}
						<Button
							variant="contained"
							color="primary"
							onClick={() => this.handleScrollRight(this.osComponentRef)}
						>
							{'>'}
						</Button>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}
const zoom = 6
const PlanoWithScrollContainer = withStyles(theme => ({
	root: {
		flexGrow: 1,
		width: '1000px',
	},
	paper: {
		minHeight: 140,
		width: 'auto',
		justifyContent: 'center',
		flexDirection: 'column',
		textAlign: 'center',
	},
	control: {
		padding: 2,
	},
}))(PlanoWithScroll)

storiesOf('Planogram/Experiments', module)
	.add('Planogram Large', () => (
		<ThemeProvider theme={theme}>
			<Planogram width="900px" padding="20px" data={data} shelfs />
		</ThemeProvider>
	))
	.add('Planogram DnD', () => (
		<ThemeProvider theme={theme}>
			<PlanogramDnD width="900px" padding="20px" data={initialData} shelfs />
		</ThemeProvider>
	))
	.add('Planogram Thumbnail', () => (
		<ThemeProvider theme={theme}>
			<Planogram width="50px" padding="20px" data={data} thumbnail />
		</ThemeProvider>
	))

storiesOf('Planogram', module)
	.add('Planogram Overlay', () => (
		<ThemeProvider theme={theme}>
			<OverlayScrollbarsComponent style={{ height: '620px', width: '1200px' }}>
				<PlanogramNew padding="1x" data={getRenderingData()} />
			</OverlayScrollbarsComponent>
		</ThemeProvider>
	))
	.add('Planogram Overlay Reversed', () => (
		<ThemeProvider theme={theme}>
			<OverlayScrollbarsComponent
				style={{ height: '620px', width: '1200px' }}
				className="os-theme-round-dark"
			>
				<PlanogramNew padding="1x" data={getRenderingData(true)} />
			</OverlayScrollbarsComponent>
		</ThemeProvider>
	))
	.add('Planogram with scroll', () => (
		<ThemeProvider theme={theme}>
			<PlanoWithScrollContainer height={600} width={700} />
		</ThemeProvider>
	))
	.add('Planogram Thumbnail', () => (
		<ThemeProvider theme={theme}>
			<div
				style={{
					display: 'block',
					width: '150px',
					height: '85px',
					overflow: 'hidden',
					margin: '10px',
				}}
			>
				<PlanogramNew
					width="900px"
					padding="1x"
					data={getRenderingData()}
					thumbNail
				/>
			</div>
		</ThemeProvider>
	))
	.add('CSV Data', () => {
		// console.log(getRenderingData())
		return <div>Check the console for output</div>
	})

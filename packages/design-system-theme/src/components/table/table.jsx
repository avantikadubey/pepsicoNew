/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import NumberFormat from 'react-number-format'
import {
	TableCell,
	TextField,
	Paper,
	Typography,
	Tooltip,
	Zoom,
	Grid,
} from '@material-ui/core'
import { AutoSizer, Column, Table } from 'react-virtualized'

const styles = theme => ({
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		border: 0,
		// borderColor: theme.palette.grey[300],
	},
	tableRow: {
		// cursor: 'pointer',
	},
	tableRowHover: {
		'&:hover': {
			backgroundColor: theme.palette.grey[200],
		},
	},
	tableCell: {
		flex: 1,
		flexDirection: 'row',
	},
	noClick: {
		cursor: 'initial',
	},
	textField: {
		border: '1px solid',
		borderColor: theme.palette.grey[300],
		paddingLeft: 5,
		cursor: 'pointer',
		'& input': {
			fontSize: '12px',
		},
	},
	tableRoot: {
		backgroundColor: 'red',
		'& .ReactVirtualized__Table__headerRow': {
			border: '1px solid',
			background: theme.palette.grey[200],
			borderColor: theme.palette.grey[300],
		},
		'& .ReactVirtualized__Table__headerColumn': {
			backgroundColor: theme.palette.grey[200],
			border: '1px solid',
			borderColor: theme.palette.grey[300],
			borderBottom: 0,
			borderRight: 0,
			'&:first-child': {
				borderLeft: 0,
				borderRight: 0,
			},
			'& span': {
				fontWeight: 'bold',
				fontSize: '14px',
				color: theme.palette.primary.main,
				textAlign: 'left',
			},
		},
		'& .ReactVirtualized__Table__row': {
			border: '1px solid',
			borderColor: theme.palette.grey[300],
		},
		'& .ReactVirtualized__Table__rowColumn': {
			border: '1px solid',
			borderColor: theme.palette.grey[300],
			borderTop: 0,
			borderBottom: 0,
			borderRight: 0,
			'&:first-child': {
				borderLeft: 0,
				borderRight: 0,
			},
		},
	},
})

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						value: values.value,
					},
				})
			}}
			isNumericString
			allowNegative={false}
			format="###"
		/>
	)
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
}

class ReactTable extends React.PureComponent {
	static defaultProps = {
		headerHeight: 48,
		rowHeight: 48,
	}
	constructor(props) {
		super(props)
		// console.log('props1', props.rows);
		// console.log('props', () => {({ index }) => props.rows[index]});
		this.state = {
			rows: props.rows,
		}
	}

	static getDerivedStateFromProps(props, state) {
		// console.log('props', props);
		// console.log('state', state);
		if (props.rows !== state.rows) {
		  return {
			rows: props.rows,
			rowCount: props.rows.length,
		  }
		}
		return null
	}
	onRowClick = ({ rowData }) => {
		return rowData
	}

	onRowMouseOver = ({ rowData }) => {
		return rowData
	}

	getRowClassName = ({ index }) => {
		const { classes, onRowClick } = this.props

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		})
	}

	// handleChange = (event, rowData) => {
	// 	console.log('event', event);
	// 	console.log('rowData', rowData)
	// 	this.setState({
	// 		value: {
	// 			...this.state.value,
	// 			[event.target.name]: event.target.value,
	// 		}
	// 	},()=> {console.log('vale1',this.state.value)})
	// }

	cellRenderer = ({ cellData, columnIndex, rowData }) => {
		const {
			columns,
			classes,
			rowHeight,
			onRowClick,
			onRowMouseOver,
			onChangeHandler,
			displayImage,
		} = this.props
		const { value } = this.state;
		const ImageUrl = displayImage(rowData.upc)
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight }}
				onMouseOver={onRowMouseOver}
				key={rowData.id}
				align={
					(columnIndex != null && columns[columnIndex].numeric) || false
						? 'right'
						: 'left'
				}
			>
				{columns[columnIndex].dataKey === 'title' && (
					<HtmlTooltip
						title={
							<div>
								<Grid
									container
									spacing={2}
									direction="row"
									justify="center"
									alignItems="center"
								>
									<Grid
										item
										style={{
											display: 'flex',
										}}
									>
										<div
											style={{
												width: '120px',
												height: 'auto',
												textAlign: 'center',
												// display: 'block',
												alignSelf: 'center',
											}}
										>
											<img
												src={ImageUrl}
												alt=""
												style={{
													objectFit: 'contain',
													maxWidth: '100%',
													maxHeight: '100%',
												}}
											/>
										</div>
									</Grid>
								</Grid>
							</div>
						}
						TransitionComponent={Zoom}
						placement="right"
					>
						<span>{cellData}</span>
					</HtmlTooltip>
				)}
				{columns[columnIndex].numeric && (
					<TextField
						className={classes.textField}
						defaultValue={cellData}
						// value={cellData}
						name={rowData.id}
						onChange={event => onChangeHandler(event, rowData, 'numberformat')}
						// onChange={event =>
						// 	this.handleChange(event, rowData, 'numberformat')
						// }
						InputProps={{
							inputComponent: NumberFormatCustom,
						}}
					/>
				)}
				{columns[columnIndex].numeric === false &&
					columns[columnIndex].dataKey !== 'title' && <span>{cellData}</span>}
			</TableCell>
		)
	}

	headerRenderer = ({ label, columnIndex }) => {
		const { headerHeight, columns, classes } = this.props
		return (
			<TableCell
				component="div"
				className={clsx(
					classes.tableCell,
					classes.flexContainer,
					classes.noClick
				)}
				variant="head"
				style={{ height: headerHeight }}
				align={columns[columnIndex].numeric || false ? 'right' : 'left'}
			>
				<span>{label}</span>
			</TableCell>
		)
	}

	render() {
		const {
			classes,
			columns,
			rowHeight,
			headerHeight,
			rowData,
			onChangeHandler,
			displayImage,
			...tableProps
		} = this.props
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						className={classes.tableRoot}
						height={height}
						width={width}
						rowHeight={rowHeight}
						headerHeight={headerHeight}
						{...tableProps}
						rowClassName={this.getRowClassName}
						onRowClick={this.onRowClick}
						onRowMouseOver={this.onRowMouseOver}
						onChangeHandler={onChangeHandler}
						displayImage={displayImage}
					>
						{columns.map(({ dataKey, ...other }, index) => {
							return (
								<Column
									key={dataKey}
									headerRenderer={headerProps =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index,
										})
									}
									className={classes.flexContainer}
									cellRenderer={this.cellRenderer}
									dataKey={dataKey}
									{...other}
								/>
							)
						})}
					</Table>
				)}
			</AutoSizer>
		)
	}
}

ReactTable.propTypes = {
	classes: PropTypes.object.isRequired,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			dataKey: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			numeric: PropTypes.bool,
			width: PropTypes.number.isRequired,
		})
	).isRequired,
	headerHeight: PropTypes.number,
	onRowClick: PropTypes.func,
	onRowMouseOver: PropTypes.func,
	displayImage: PropTypes.func,
	rowHeight: PropTypes.number,
	onChangeHandler: PropTypes.func,
	rowData: PropTypes.object,
}

const VirtualizedTable = withStyles(styles)(ReactTable)

const HtmlTooltip = withStyles(theme => ({
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
			fontSize: '14px',
			fontWeight: 'bold',
		},
		'& span': {
			fontWeight: 300,
		},
	},
}))(Tooltip)

// ---

export default function ReactVirtualizedTable({
	rows,
	onChangeHandler,
	displayImage,
}) {
	// console.log('rows', rows)
	return (
		<Paper style={{ height: 350, width: '100%' }}>
			{rows.length === 0 && (
				<Typography
					component="p"
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 100,
						margin: '0 auto',
						textAlign: 'center',
					}}
				>
					No Record found
				</Typography>
			)}
			<VirtualizedTable
				rowCount={rows.length}
				rows={rows}
				rowGetter={({ index }) => rows[index]}
				columns={[
					{
						width: 600,
						label: 'Title',
						dataKey: 'title',
						numeric: false,
					},
					{
						width: 300,
						label: 'UPC',
						dataKey: 'upc',
						numeric: false,
					},
					{
						width: 300,
						label: 'BDC',
						dataKey: 'bdc',
						numeric: false,
					},
					{
						width: 300,
						label: 'Back Stock Quantity',
						dataKey: 'backstockQty',
						numeric: true,
					},
				]}
				onChangeHandler={onChangeHandler}
				displayImage={displayImage}
			/>
		</Paper>
	)
}

ReactVirtualizedTable.propTypes = {
	rows: PropTypes.array.isRequired,
	onChangeHandler: PropTypes.func.isRequired,
	displayImage: PropTypes.func,
}

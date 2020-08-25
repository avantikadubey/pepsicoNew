import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import { Paper, CircularProgress, Typography, Grid } from '@material-ui/core'
import { AutoSizer, Column, Table } from 'react-virtualized'

const styles = theme => ({
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
	},
	table: {
		'& .ReactVirtualized__Table__headerRow': {
			flip: false,
			paddingRight: theme.direction === 'rtl' ? '0px !important' : undefined,
			border: '1px solid',
			background: theme.palette.grey[200],
			borderColor: theme.palette.grey[300],
		},
		'& .ReactVirtualized__Table__row': {
			border: '1px solid',
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
				[theme.breakpoints.down('md')]: {
					fontSize: '12px',
				},
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
	tableRow: {
		cursor: 'pointer',
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
		fontSize: '14px',
		[theme.breakpoints.down('md')]: {
			fontSize: '12px',
			wordBreak: 'break-word',
		},
	},
})

class DataUploadTable extends React.PureComponent {
	static defaultProps = {
		headerHeight: 48,
		rowHeight: 48,
	}

	getRowClassName = ({ index }) => {
		const { classes, onRowClick } = this.props

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		})
	}

	cellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight }}
				align={
					(columnIndex != null && columns[columnIndex].numeric) || false
						? 'right'
						: 'left'
				}
			>
				{cellData}
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
			...tableProps
		} = this.props
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						height={height}
						width={width}
						rowHeight={rowHeight}
						gridStyle={{
							direction: 'inherit',
						}}
						headerHeight={headerHeight}
						className={classes.table}
						{...tableProps}
						rowClassName={this.getRowClassName}
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

DataUploadTable.propTypes = {
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
	rowHeight: PropTypes.number,
}

const VirtualizedTable = withStyles(styles)(DataUploadTable)

// ---

export default function ReactVirtualizedTable({
	rows,
	loading,
	currentLoadingType,
	isLoadingUploadedFileStatus,
}) {
	return (
		<Paper style={{ height: 400, width: '100%' }}>
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
			{isLoadingUploadedFileStatus(loading, currentLoadingType) ? (
				<Grid style={{textAlign: 'center'}}><CircularProgress color="secondary" size={50} /></Grid>
			) : (
				<VirtualizedTable
					rowCount={rows.length}
					rowGetter={({ index }) => rows[index]}
					columns={[
						// {
						// 	width: 400,
						// 	label: 'Request ID',
						// 	dataKey: 'requestId',
						// },
						{
							width: 400,
							label: 'File Name',
							dataKey: 'fileName',
							// numeric: true,
						},
						{
							width: 150,
							label: 'File Type',
							dataKey: 'fieldName',
							// numeric: true,
						},
						{
							width: 200,
							label: 'Status',
							dataKey: 'status',
							// numeric: true,
						},
						{
							width: 300,
							label: 'Time Stamp',
							dataKey: 'processTime',
							//  numeric: true,
						},
					]}
				/>
			)}
		</Paper>
	)
}

ReactVirtualizedTable.propTypes = {
	rows: PropTypes.array.isRequired,
	loading: PropTypes.bool,
	currentLoadingType: PropTypes.number,
	isLoadingUploadedFileStatus: PropTypes.func,
}

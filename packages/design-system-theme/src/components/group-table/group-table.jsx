/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import clsx from 'clsx'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core'
import { SearchBox } from '../search-box'


const StyledTableHeaderCell = withStyles(theme => ({
	root: {
		borderStyle: 'solid',
		display: 'flex',
		justifyContent: 'center',
		padding: '1rem',
		borderWidth: '.15rem',
		borderRadius: '2px',
		backgroundColor: theme.palette.grey['50'],
	},
}))(TableSortLabel)

const StyledTableCell = withStyles(theme => ({
	body: {
		borderStyle: 'solid',
		borderColor: 'white',
		borderWidth: '.15rem',
	},
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
	root: {
		borderStyle: 'none',
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.grey['50'],
		},
	},
}))(TableRow)

const StyledTableHeadRow = withStyles(theme => ({
	root: {
		borderStyle: 'none',
	},
}))(TableRow)

const tableStyle = () => ({
	red: {
		backgroundColor: 'red',
	},
	green: {
		backgroundColor: 'green',
	},
	yellow: {
		backgroundColor: 'yellow',
	},
})

function getSorting(order, orderBy) {
	return order === 'desc'
		? (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
		: (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
}

class GroupedTable extends React.Component {
	state = {
		groupBy: 'city',
		sortBy: '',
		sortOrder: 'asc',
		expandedGroups: ['Las Vegas'],
	}

	getColumnData = columns => {
		const { groupBy } = this.state
		return columns.filter(item => item.dataKey !== groupBy)
	}

	getGroupedData = rows => {
		const { groupBy } = this.state
		const groupedData = rows.reduce((acc, item) => {
			const key = item[groupBy]
			const groupData = acc[key] || []
			acc[key] = groupData.concat([item])
			return acc
		}, {})

		const expandedGroups = {}
		const { sortBy, sortOrder } = this.state
		Object.keys(groupedData).forEach(item => {
			// eslint-disable-next-line react/destructuring-assignment
			expandedGroups[item] = this.state.expandedGroups.indexOf(item) !== -1
			groupedData[item] = groupedData[item].sort(getSorting(sortOrder, sortBy))
		})

		this.groups = expandedGroups
		return groupedData
	}

	handleRequestSort = property => {
		const sortBy = property
		let sortOrder = 'desc'

		if (this.state.sortBy === property && this.state.sortOrder === 'desc') {
			sortOrder = 'asc'
		}

		this.setState({ sortOrder, sortBy })
	}

	expandRow = groupVal => {
		const curr = this.groups[groupVal]
		let expandedGroups = this.state.expandedGroups
		if (curr) {
			expandedGroups = expandedGroups.filter(item => item !== groupVal)
		} else if (expandedGroups.indexOf(groupVal) === -1) {
			// Maintain all open groups ever!!
			expandedGroups = expandedGroups.concat([groupVal])
		}
		this.setState({ expandedGroups })
	}

	render() {
		const { rows, columns, classes } = this.props
		const columnData = this.getColumnData(columns)
		const groupedData = this.getGroupedData(rows)
		const { sortBy, sortOrder } = this.state
		return (
			<Table>
				<TableHead>
					<StyledTableHeadRow>
						{columnData.map((item, index) => (
							<TableCell 	style={{ padding:'2px'}}>
								{index === 0 && (
									<SearchBox
										filterText=""
										searchHandler={text => console.log(text)}
									/>
								)}
								{index > 0 && (
									<StyledTableHeaderCell
										active={sortBy === item.dataKey}
										direction={sortOrder}
										onClick={this.handleRequestSort.bind(null, item.dataKey)}
										key={item.title}
									>
										{item.title}
									</StyledTableHeaderCell>
								)}
							</TableCell>
						))}
					</StyledTableHeadRow>
				</TableHead>
				<TableBody>
					{Object.keys(groupedData).map(key => {
						return (
							<React.Fragment>
								<StyledTableHeadRow>
									<StyledTableCell
										colSpan={columnData.length}
										style={{ fontWeight: 'bold', cursor: 'pointer' }}
										onClick={this.expandRow.bind(null, key)}
									>
										{this.groups[key] ? (
											<FontAwesomeIcon
												icon={['fas', 'caret-down']}
												size="lg"
												padding={15}
												color="green"
											/>
										) : (
											<FontAwesomeIcon
												icon={['fas', 'caret-right']}
												size="lg"
												padding={15}
												color="green"
											/>
										)}
										<span style={{ marginLeft: '.5rem' }}>{key}</span>
									</StyledTableCell>
								</StyledTableHeadRow>
								{this.groups[key] &&
									groupedData[key].map(item => (
										<StyledTableRow >
											{columnData.map((col, index) => (
												<StyledTableCell
													className={clsx({
														[classes.red]: index === 1,
														[classes.green]: index === 2,
														[classes.green]: index === 3,
														[classes.green]: index === 4,	
														[classes.yellow]: index === 5,	
														[classes.red]: index === 6,	
													})}
													padding="checkbox"
													size="small"
													variant="body"
												>
													{item[col.dataKey]}
												</StyledTableCell>
											))}
										</StyledTableRow>
									))}
							</React.Fragment>
						)
					})}
				</TableBody>
			</Table>
		)
	}
}
export default withStyles(tableStyle, { withTheme: true })(GroupedTable)

import * as React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, Grid, ScrollSync } from 'react-virtualized'
import scrollbarSize from 'dom-helpers/scrollbarSize'
import { withStyles } from '@material-ui/core/styles'
import { Tooltip, Zoom, Typography } from '@material-ui/core'
import deliveryIcon from './delivery-truck.png';

const styles = theme => ({
  GridRow: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  GridColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    width: '100%',
    background: '#e0e0e0', 
    // marginLeft: '90px',
    '& > div > div > div > div': {
      // paddingLeft: '90px',
      // marginLeft: '90px',
      // border: '2px solid red',
    },
   
  },
  LeftSideGridContainer: {
    flex: '0 0 90px',
    zIndex: '10',
    backgroundColor: '#eeeeee',
    position: 'absolute',
    left: 0,
    // adding conditons for hiding product name in fixed body cells when product is not available in all uploaded files
    '& .load-type-1 + .load-type-2 span:first-child':{
      visibility: 'hidden',
    },
    '& .load-type-2 + .load-type-3 span:first-child':{
      visibility: 'hidden',
    },
    '& .load-type-1 + .load-type-3 span:first-child':{
      visibility: 'hidden',
    }
  },
  LeftSideGrid: {
    overflow: 'hidden !important',
  },
  HeaderGrid: {
    width: '100%',
    overflow: 'hidden !important',
  },
  BodyGrid: {
    width: '100%',
    color: '#000',
  },
  cell: {
    width: '100%',
    height: '100%',
    borderLeft: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0',
  },
  cellLeft: {
    width: '100%',
    height: '100%',
    borderLeft: '1px solid #e0e0e0',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
  },
  cellProductName: {
    color: '#424242',
    fontWeight: 'bold',
    // fontSize: '10px',
    lineHeight: '1rem',
    width: '75%',
    display: 'block',
    float: 'left',
    textAlign: 'center',
    padding: '2px',
    fontSize: '10px',
    
  },
  cellSimName: {
    fontSize: '10px',
    width: '25%',
    display: 'block',
    float: 'right',
    textAlign: 'center',
    padding: '2px',
    borderLeft: '1px dotted grey',
  },
  headerCell: {
    width: '100%',
    height: '100%',
    display: 'flex',
    borderLeft: '1px solid #e0e0e0',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#424242',
    color: '#eeeeee',
    cursor: 'pointer',
    '& img':{
      maxWidth: '20px',
      marginLeft: '5px'
    }
  },
  tooltipContainer: {
    width: '240px',
    height: 'auto',
  },
  tooltipInnerContainer: {
    textAlign: 'center',
    alignSelf: 'center',
    display: 'flex',
  },
  tooltipHeading: {
    width: '100%',
    textAlign: 'center',
    display: 'block',
    marginBottom: '10px'
  },
  tooltipLeftContainer: {
    marginRight: '20px',
    maxWidth: '100px',
    width: '100%',
    textAlign: 'center',
    display: 'block',
    height: '80px'
  },
  tooltipRightContainer: {
    maxWidth: '145px',
    textAlign: 'left',
    display: 'block',
  },
})
/*
  [

    {
      bdc: 'abc',
      indicator: 0,
      qty: 5,
      date: 'date1'
    },
        {
      bdc: 'def',
      indicator: 1,
      qty: 15,
      date: 'date2'
    },
  ]
  const gridData= [];
  // group by BDC
    Object Entries
        key -> values
          const tempArray = [];
          for each key
              -> Add first entry as the product ID/name
            001 -> [map of values for all dates]
                    ->
                    // do computation of qty, color, header
                      header => the current date
                      color
                      qty
                      push it tempArray
          ---------------------------------
          push tempArray -> gridData (Add array to gridData)
    )

    map bdcuniq = bdc+simname (sorted by bdc+simname)
  0001_Sim1
  0001_Sim2
      Group BY BDC-UNIQ
        Iterate Values
        Create Array
    Create Array of Arrays

    https://stackoverflow.com/questions/28860526/lodash-sortby-then-groupby-is-order-maintained

*/

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 20,
    fontSize: '12px',
    border: '1px solid #dadde9',
    // '& img': {
    //   maxWidth: '100%',
    //   backgroundColor: 'red',
    // },
    '& h6': {
      fontSize: '12px',
      fontWeight: 'bold',
    },
    '& h5': {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    '& span': {
      fontWeight: 300,
    },
  },
}))(Tooltip)

let MyList = []
let result = 0
let selectedDate = []
let simulations =[]

class ScrollableTable extends React.Component {
  constructor(props, context) {
    result = props.comparisonArray
    selectedDate =result.filteredDates
    simulations =result.simulations
    MyList = result.data
   // console.log("simulations",simulations)
    super(props, context)
    //  console.log("asfdasf",this.props.comparisonArray)
    this.state = {
      // fixedcolWidth: 210,
      fixedcolWidth: 145,
      // columnWidth: 200,
      columnWidth: 145,
      autoWidth: true,
      columnCount: result.colLength,
      height: 300,
      overscanColumnCount: 50,
      overscanRowCount: 150,
      rowHeight: 40,
      rowCount: MyList.length,
      masterData: [],
    }

    this.regularBodyCell = this.regularBodyCell.bind(this)
    this.regularHeaderCell = this.regularHeaderCell.bind(this)
    this.fixedBodyCell = this.fixedBodyCell.bind(this)
    this.fixedHeaderCell = this.fixedHeaderCell.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    // console.log('props', props);
    // console.log('state', state);
    if (props.comparisonArray !== state.prevComparisonArray) {
      MyList = props.comparisonArray.data
      return {
        prevComparisonArray: props.comparisonArray,
        columnCount: props.comparisonArray.colLength,
        rowCount: props.comparisonArray.data.length,
      }
    }
    return null
  }
  // getData = () => {
  //   this.setState({
  //     masterData: comparisonDataTransform(),
  //   })
  // }

  // regularBodyCell({ columnIndex, key, rowIndex, style }) {
  //   if (columnIndex < 1) {
  //     return
  //   }
  //   return this.fixedBodyCell({ columnIndex, key, rowIndex, style })
  // }

  regularBodyCell({ columnIndex, key, rowIndex, style }) {
    const { classes, getOptimizedImage, images } = this.props

    if (columnIndex < 1) {
      return
    }
    if (!MyList[rowIndex][columnIndex]) {
   //   console.info('table has no Data')
      return (
        <div
          className={classes.cell}
          key={key}
          style={{ ...style, background: '#e0e0e0' }}
        >
          -
				</div>
      )
    }
    const {
      upc,
      bdc,
      storeCellValue,
      cellColor,
      currentKeys,
      displayQtyAfterSales,
      displayQtyAfterRepService,
      displayQtyBeforeRepService,
      displayTotalHoldingPower,
      combineName,
    } = MyList[rowIndex][columnIndex]

    const imageUrl =
      upc &&
      getOptimizedImage(images, `${upc.toString().slice(-5)}.jpg`).fluid.src

    let displayQtyAsPerDropdown = 0

    if (currentKeys.cellValue2 === 'displayQtyAfterSales') {
      displayQtyAsPerDropdown = displayQtyAfterSales
    } else if (currentKeys.cellValue2 === 'displayQtyAfterRepService') {
      displayQtyAsPerDropdown = displayQtyAfterRepService
    } else if (currentKeys.cellValue2 === 'displayQtyBeforeRepService') {
      displayQtyAsPerDropdown = displayQtyBeforeRepService
    }
    // console.log('MyList', MyList);
    // console.log('displayTotalHoldingPower', displayTotalHoldingPower);
    return (
      <HtmlTooltip
        key={key}
        title={
          <div className={classes.tooltipContainer}>
            <div className={classes.tooltipHeading}>
              <Typography variant="h5" component="h5">
                {combineName}
              </Typography>
            </div>
            <div className={classes.tooltipInnerContainer}>
              {imageUrl && (
                <div className={classes.tooltipLeftContainer}>
                  <img
                    src={imageUrl}
                    alt=""
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  />
                </div>
              )}
              <div className={classes.tooltipRightContainer}>
                {upc && (
                  <Typography variant="h6" component="h6">
                    UPC: <span>{upc}</span>
                  </Typography>
                )}

                {bdc && (
                  <Typography variant="h6" component="h6">
                    BDC: <span>{bdc}</span>
                  </Typography>
                )}

                <Typography variant="h6" component="h6">
                  Available Qty:{' '}
                  <span>
                    {displayQtyAsPerDropdown}/{displayTotalHoldingPower}
                  </span>
                </Typography>
              </div>
            </div>
          </div>
        }
        TransitionComponent={Zoom}
        placement="right"
      >
        <div
          className={classes.cell}
          style={{ ...style, background: `${cellColor}` }}
        >
          <span>{storeCellValue}</span>
        </div>
      </HtmlTooltip>
    )
  }

  // regularHeaderCell({ columnIndex, key, rowIndex, style }) {
  //   if (columnIndex < 1) {
  //     return
  //   }

  //   return this.fixedHeaderCell({ columnIndex, key, rowIndex, style })
  // }

  regularHeaderCell({ columnIndex, key, rowIndex, style }) {
    // const changeTableDataToSpecificDate = (value) => {
    //   console.log('test1', value);
    // }

    const { classes, handleDate } = this.props
    if (columnIndex < 1) {
      return
    }
    if (!MyList[rowIndex]) {
      return
    }
    // handling side efffect when we have data of different number of dates in uploaded files
    if (!MyList[rowIndex][columnIndex]) {
      let index =0;
      if(MyList[rowIndex+1][columnIndex]){
        index=1;
      }
      else if(MyList[rowIndex+2][columnIndex]){
        index=2;
      }
      return (
        <div
          className={classes.headerCell}
          key={key}
          style={style}
          onClick={() =>
            handleDate( MyList[index][columnIndex].simulationDate)
          }
        >
          {selectedDate[0].includes(MyList[index][columnIndex].simulationDate) ?
          <img src={deliveryIcon} alt="Delivery" />:""}
          {MyList[index][columnIndex].header }
        </div>
      )
    }

    else{

      return (
        <div
          className={classes.headerCell}
          key={key}
          style={style}
          onClick={() => handleDate(MyList[rowIndex][columnIndex].simulationDate)}
        >
          {selectedDate[0].includes(MyList[rowIndex][columnIndex].simulationDate)?
          <img src={deliveryIcon} alt="Delivery" />:""}
          {MyList[rowIndex][columnIndex] && MyList[rowIndex][columnIndex].header}
        </div>
      )
    }

    
  }

  fixedHeaderCell({ columnIndex, key, rowIndex, style }) {
    const { classes } = this.props
    return (
      <div className={classes.headerCell} key={key} style={style}>
        {MyList[rowIndex][columnIndex].header}
      </div>
    )
  }

  fixedBodyCell({ columnIndex, key, rowIndex, style }) {
    const { classes, search } = this.props
    let productName
    if (!MyList[rowIndex]) {
      return
    }
    if (!MyList[rowIndex][columnIndex]) {
      return 
    }
  
    //productName =MyList[rowIndex][columnIndex].simulation === 'SIM1'? MyList[rowIndex][columnIndex].productName: null
    productName=MyList[rowIndex][columnIndex].productName
		const cssClass = MyList[rowIndex][columnIndex] ? classes.cellLeft + ' ' + MyList[rowIndex][columnIndex].className: classes.cellLeft;
    return (
      <div
        // className={classes.cell}
        className={cssClass}
        key={key}
        style={{ ...style, color: `${MyList[rowIndex][columnIndex].color}` }}
      >
        <span
          className={classes.cellProductName}
        // style={{ color: '#424242', fontWeight: 'bold', fontSize: '10px' }}
        >
          {productName}{' '}
        </span>
        <span
          className={classes.cellSimName}
        // style={{ fontSize: '11px' }}
        >
          {MyList[rowIndex][columnIndex].simulation}
        </span>
      </div>
    )
  }

  render() {
    const {
      columnCount,
      columnWidth,
      fixedcolWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
    } = this.state
    const { classes } = this.props
    //console.log("scorable",scrollbarSize())
    return (
      <ScrollSync>
        {({ onScroll, scrollLeft, scrollTop }) => {
          return (
            <div className={classes.GridRow}>
              <div className={classes.LeftSideGridContainer} style={{ top: 0 }}>
                <Grid
                  cellRenderer={this.fixedHeaderCell}
                  className={classes.HeaderGrid}
                  width={fixedcolWidth}
                  height={rowHeight}
                  rowHeight={rowHeight}
                  columnWidth={fixedcolWidth}
                  rowCount={1}
                  columnCount={1}
                />
              </div>
              <div
                className={classes.LeftSideGridContainer}
                style={{ top: rowHeight }}
              >
                <Grid
                  overscanColumnCount={overscanColumnCount}
                  overscanRowCount={overscanRowCount}
                  cellRenderer={this.fixedBodyCell}
                  columnWidth={fixedcolWidth}
                  columnCount={1}
                  className={classes.LeftSideGrid}
                  height={height - scrollbarSize()}
                 // height={height}
                  rowHeight={rowHeight}
                  rowCount={rowCount}
                  scrollTop={scrollTop}
                  width={fixedcolWidth}
                />
              </div>
              <div className={classes.GridColumn}>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <div>
                      <div
                        style={{
                          height: rowHeight,
                          width: width - scrollbarSize(),
                          outline: '0 !important',                          
                        }}
                      >
                        <Grid
                          className={classes.HeaderGrid}
                          columnWidth={columnWidth}
                          columnCount={columnCount}
                          height={rowHeight}
                          overscanColumnCount={overscanColumnCount}
                          cellRenderer={this.regularHeaderCell}
                          rowHeight={rowHeight}
                          rowCount={1}
                          scrollLeft={scrollLeft}
                          width={width - scrollbarSize() }
                          // width={width - scrollbarSize()- '90px'}
                          // style={{border: '2px solid blue'}}
                        />
                      </div>
                      <div
                        style={{
                          height,
                          width,
                          outline: '0 !important',
                        }}
                      >
                        <Grid
                          className={classes.BodyGrid}
                          columnWidth={columnWidth}
                          columnCount={columnCount}
                          height={height}
                          onScroll={onScroll}
                          overscanColumnCount={overscanColumnCount}
                          overscanRowCount={overscanRowCount}
                          cellRenderer={this.regularBodyCell}
                          rowHeight={rowHeight}
                          rowCount={rowCount}
                          // width={width}
                          width={width}
                          // style={{border: '2px solid red'}}
                        />
                      </div>
                    </div>
                  )}
                </AutoSizer>
              </div>
            </div>
          )
        }}
      </ScrollSync>
    )
  }
}

ScrollableTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ScrollableTable)

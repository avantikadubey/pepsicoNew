import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import {
  AppBar,
  InputAdornment,
  Tabs,
  Tab,
  Typography,
  Box
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropDown } from '@planogram/design-system';
import TextField from '@material-ui/core/TextField';
import * as actions from '../../@planogram/store/state/actions';
import { dropDownType } from '../../shared/utils';
import {
  filterBy,
  sortBy,
  serviceConfig,
  comparisonTableType,
  comparisonDataTransform,
  getFilteredData,
  getOptimizedImage,
  DynamicTabs,
  comparisonDataTransformForDisplay,
  backStockServiceConfig
} from '../../@planogram/store/state/utility';
import { ScrollableTable } from '@planogram/design-system';
import * as _ from 'lodash';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '0px !important',
    width: '100%',
    // backgroundColor: theme.palette.grey[300],
    '& .MuiAppBar-colorPrimary': {
      backgroundColor: theme.palette.grey[50],
      boxShadow: 'none',
      '& .MuiTabs-root': {
        '& .MuiTabs-scrollButtons': {
          color: theme.palette.common.black
        }
      }
    },
    height: '120vh',
    '& .MuiTypography-root': {
      '& .MuiBox-root': {
        padding: '0px !important'
      }
    }
  },
  tabPanel: {
    '& .MuiBox-root': {
      padding: '0px !important'
    }
  },

  simulationIndicators: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
  },
  InIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.common.green
  },
  lsIndicator: {
    height: '11px',
    width: '11px',
    marginLeft: '25px',
    backgroundColor: theme.palette.common.amber
  },
  indicatorsLabel: {
    fontSize: '12px',
    color: theme.palette.primary.main,
    marginLeft: '2px',
    position: 'relative'
  },
  OosIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.common.red,
    marginLeft: '25px'
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    marginTop: '10px'
  },
  inputAdor: {
    border: '1px solid',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.common.white,
    borderRadius: '2px',
    margin: '0px'
  },
  icon: {
    padding: '10px',
    fontSize: '40px',
    color: theme.palette.primary.main
  },
  dropDown: {
    '&>section>div': {
      borderWidth: '2px',
      borderColor: theme.palette.grey[400],
      [theme.breakpoints.down('md')]:{
        minWidth: '100%',
        maxWidth: '100%',
      }
    },
    marginRight: '20px'
  },
  search: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.grey[500],
    '& .MuiFilledInput-adornedEnd input': {
      padding: '20px 12px 5px'
    },
    '& svg.fa-search': {
      width: '20px',
      height: '20px',
      '& path': {
        fill: theme.palette.grey[500]
      }
    },
    [theme.breakpoints.down('sm')]:{
      fontSize: '14px',
    },
  },
  progress: {
    zIndex: 9999,
    verticalAlign: 'middle',
    position: 'absolute',
    background: '#fff',
    borderRadius: '5px',
    padding: '5px',
    opacity: 0.75,
    left: '0',
    right: '0',
    top: '50%'
  },
  spinner: {
    zIndex: 99999
  },
  temp: {
    padding: '0px !important'
  },
  placeHolder: {
    display: 'flex',
    height: '50vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 25,
    border: `4px solid`,
    borderColor: theme.palette.grey[400],
    padding: 10,
    backgroundColor: theme.palette.common.white
  }
}));

const ComparisonTabs = React.memo((comparisonArray) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const searchData = useSelector(({ pog }) => pog.products);
  const currentComparison = useSelector(({ pog }) => pog.current.comparison);
  const tableSelected = useSelector(
    ({ pog }) => pog.current.comparison.selectedTabValue
  );
  const tableStatus = useSelector(
    ({ pog }) => pog.current.comparison.tableView
  );
  let comparisonDataLength = useSelector(
    ({ pog }) => pog.current.comparison.comparisonDataCount
  );
  let filterById = currentComparison.filterById;
  let sortById = currentComparison.sortById;
  let compareById = currentComparison.compareById;
  let [compareByData, setCompareByData] = useState(serviceConfig);
  const images = useSelector(({ pog }) => pog.images);
  const tabs = DynamicTabs(currentComparison.comparisonData);
  let tableData = currentComparison.transformComparisonData;
  let [searchItems, setSearchItems] = useState([]);
  let [searchActive, setSearchActive] = useState(false);
  let [filterText, setFilterText] = useState('');
  let [filteredList, setFilteredList] = useState([]);
  let [displayTableData, setDisplayTableData] = useState(
    currentComparison.transformComparisonData
  );
  const [value, setValue] = React.useState(currentComparison.comparisonTabIndex);

  let comparisonPogID = currentComparison.comparisonPogID;
  const comparisonPreviewJson = currentComparison.comparisonData;

  const handleChange = (event, newValue) => {
    setCompareByData(serviceConfig);
    setValue(newValue);
    if (tabs[newValue].pogId !== currentComparison.comparisonPogID) {
      if (newValue === 0) {
        dispatch(
          actions.setComparisonTable({
            table: comparisonTableType.STORE,
            pogID: tabs[newValue].pogId,
            tabIndex:newValue
          })
        );
      } else if (newValue + 1 === tabs.length) {
        setCompareByData(backStockServiceConfig);
        dispatch(
          actions.setComparisonTable({
            table: comparisonTableType.BACKSTOCK,
            pogID: tabs[newValue].pogId,
            tabIndex:newValue
          })
        );
      } else if (newValue !== -1) {
        dispatch(
          actions.setComparisonTable({
            table: comparisonTableType.DISPLAY,
            pogID: tabs[newValue].pogId,
            tabIndex:newValue
          })
        );
      }
    }
    setSearchActive(false);
    setFilteredList([]);
    //  dispatch(actions.setSearchResultForTable([]));
  };

  const handleDropdownChange = (type, value) => {
    if (type === 'filterBy') {
      filterById = value;
      dispatch(actions.setFilterByDropdown(value));
    } else if (type === 'sortBy') {
      sortById = value;
      dispatch(actions.setSortByDropdown(value));
    } else if (type === 'compareBy') {
      compareById = value;
      dispatch(actions.setCompareByDropdown(value));
    }
    let filteredData = getFilteredData(
      currentComparison,
      filterById,
      sortById,
      compareById
    );
    dispatch(actions.setComparisonFilterData(filteredData));
  };

  useEffect(() => {
    let tableInput = [];
    const tableTransformData = {
      comparisonData:
        comparisonDataLength === 1
          ? currentComparison.comparisonFilterData
          : currentComparison.comparisonData,
      searchData,
      tableType: currentComparison.selectedTabValue,
      serviceDropdown: currentComparison.compareById
    };
    const tableTransformDataDisplay = {
      comparisonData:
        comparisonDataLength === 1
          ? currentComparison.comparisonFilterData
          : currentComparison.comparisonData,
      searchData,
      pogID: currentComparison.comparisonPogID,
      serviceDropdown: currentComparison.compareById
    };

    if (
      currentComparison.selectedTabValue === comparisonTableType.STORE ||
      currentComparison.selectedTabValue === comparisonTableType.BACKSTOCK
    ) {
      tableInput = comparisonDataTransform(tableTransformData);
    } else {
      tableInput = comparisonDataTransformForDisplay(tableTransformDataDisplay);
    }
    dispatch(actions.setTransformDataForTable(tableInput));
  }, [
    tableSelected,
    currentComparison.comparisonPogID,
    currentComparison.compareById,
    currentComparison.comparisonFilterData
  ]);

  useEffect(() => {
    setDisplayTableData(currentComparison.transformComparisonData);
    if (searchActive && searchItems.length > 0) {
      setDisplayTableData(currentComparison.searchResult);
    } else if (currentComparison.transformComparisonData.length > 0) {
      setDisplayTableData(currentComparison.transformComparisonData);
    }
  });

  const handleSearch = (event) => {
    let productList = currentComparison.transformComparisonData.data;
    let colLength = currentComparison.transformComparisonData.colLength;
    let filteredDates = currentComparison.transformComparisonData.filteredDates;
    let newProductList = [];
    setFilterText(event.target.value);
    let item = event.target.value.toLowerCase();
    let lastIndex = null;

    if (item.length > 0) {
      productList.map((obj, index) => {
        for (var key in obj[1]) {
          if (
            key === 'productName' ||
            key === 'combineName' ||
            key === 'bdc' ||
            key === 'upc'
          ) {
            if (
              obj[1][key] &&
              obj[1][key]
                .toString()
                .toLowerCase()
                .indexOf(item) !== -1 &&
              index !== lastIndex
            ) {
              newProductList.push(obj);
              lastIndex = index;
            }
          }
        }
        return null;
      });
      setSearchActive(true);
      setFilteredList({ data: newProductList, length: newProductList.length });
      setSearchItems({ data: newProductList, length: newProductList.length });
      dispatch(
        actions.setSearchResultForTable({
          data: newProductList,
          length: newProductList.length,
          colLength: colLength,
          filteredDates:filteredDates

        })
      );
    } else {
      setSearchActive(false);
      setFilteredList([]);
      dispatch(actions.setSearchResultForTable([]));
    }
  };

  // const backStockHandler = () => {
  //   dispatch(actions.setComparisonTable(comparisonTableType.BACKSTOCK));
  // };
  // const storeHandler = () => {
  //   dispatch(actions.setComparisonTable(comparisonTableType.STORE));
  // };

  const getInStockOutStock = (groupByDate, date, stockFlag) => {
    let inStock = 0,
      outStock = 0;
      groupByDate[date] &&  groupByDate[date].forEach((element) => {
      if (element[stockFlag] === 0) {
        inStock = inStock + 1;
      }
      if (element[stockFlag] === 1 || element[stockFlag] === 2) {
        outStock = outStock + 1;
      }
    });
    return {
      inStock,
      outStock
    };
  };

  const getComparedDeliveryData = (date,storeOutput,displayOutput) => {
    // let groupByDate = tableSelected===comparisonTableType.STORE ||tableSelected === comparisonTableType.BACKSTOCK? 
    //   _.groupBy(storeOutput, item => item.simulationDate) : _.groupBy(displayOutput, item => item.simulationDate);
    let groupByDate = comparisonPogID ? 
      _.groupBy(storeOutput, item => item.simulationDate) : _.groupBy(displayOutput, item => item.simulationDate);
    let deliveryData;
    if (compareById === 0) {
      deliveryData = getInStockOutStock(
        groupByDate,
        date,
        'inventoryFlagBeforeDelivery'
      );
      console.info('Before delivery');
    }
    if (compareById === 1) {
      deliveryData = getInStockOutStock(
        groupByDate,
        date,
        'inventoryFlagAfterDelivery'
      );
      console.info('After delivery');
    }
    if (compareById === 2) {
      deliveryData = getInStockOutStock(
        groupByDate,
        date,
        'inventoryFlagAfterSales'
      );
      console.info('After sales');
    }
    return deliveryData;
  };

  const handleTotalInventory = (date) => {
    let deliveryArray = [];
    comparisonPreviewJson.forEach((element) => {
      const {
        previewJson: { storeOutput, displayOutput }
      } = element;
      deliveryArray.push(
        getComparedDeliveryData(date, storeOutput, displayOutput)
      );
    });
    dispatch(actions.setComparisonInventoryData(deliveryArray));
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary" className={classes.temp}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          {tabs.map((tabName, index) => (
            <Tab
              label={tabName.locationCode}
              key={index}
              {...a11yProps({ index })}
            />
          ))}
        </Tabs>
      </AppBar>

      <TabPanel index={value} value={value}>
        <Grid item xs={12} className={classes.tabHeader}>
          <Grid item sm={4} className={classes.searchArea}>
            {/* <TextField
              className={classes.search}
              label="Search Product"
              margin="normal"
              variant="filled"
              value={filterText}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <FontAwesomeIcon
                      icon={['fas', 'search']}
                      size="1x"
                      className={classes.icon}
                    />
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
            /> */}
            <TextField
              className={classes.inputAdor}
              label="Search Product"
              margin="normal"
              variant="filled"
              value={filterText}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <FontAwesomeIcon
                      icon={['fas', 'search']}
                      className={classes.icon}
                    />
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
            />
          </Grid>

          {comparisonDataLength === 1 && (
            <Grid item xs={2} className={classes.dropDown}>
              <DropDown
                label="Filter By"
                key="filter By"
                type={dropDownType.filterBy}
                values={filterBy}
                current={currentComparison.filterById.toString()}
                onChange={handleDropdownChange}
              />
            </Grid>
          )}
          {comparisonDataLength === 1 && (
            <Grid item xs={2} className={classes.dropDown}>
              <DropDown
                label="Sort By"
                key="sort By"
                type={dropDownType.sortBy}
                values={sortBy}
                current={currentComparison.sortById.toString()}
                onChange={handleDropdownChange}
              />
            </Grid>
          )}
          <Grid item xs={2} className={classes.dropDown}>
            <DropDown
              label="Compare By"
              key="compare By"
              type={dropDownType.compareBy}
              values={compareByData}
              current={currentComparison.compareById.toString()}
              onChange={handleDropdownChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            {!(searchActive && searchItems.length === 0) &&
              displayTableData.length > 0 && (
                <ScrollableTable
                  images={images}
                  getOptimizedImage={getOptimizedImage}
                  comparisonArray={displayTableData}
                  handleDate={handleTotalInventory}
                  search={searchActive}
                />
              )}
            {((searchActive && searchItems.length === 0) ||
              currentComparison.transformComparisonData.length === 0) && (
              <div className={classes.placeHolder}>
                No Data For Selected Value
              </div>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.simulationIndicators}>
          <div className={classes.InIndicator}></div>
          <span className={classes.indicatorsLabel}>In Stock</span>
          <div className={classes.lsIndicator}></div>
          <span className={classes.indicatorsLabel}>Low Stock</span>
          <div className={classes.OosIndicator}></div>
          <span className={classes.indicatorsLabel}>Out of Stock</span>
        </Grid>
      </TabPanel>
    </div>
  );
});

export default ComparisonTabs;

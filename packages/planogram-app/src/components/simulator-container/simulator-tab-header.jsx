import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  formatDate,
  serviceConfig,
  isLoadingPosForPlanogram
} from '../../@planogram/store/state/utility';
import { dropDownType } from '../../shared/utils';
import * as actions from '../../@planogram/store/state/actions';
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropDown } from '@planogram/design-system';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  productUPC: {
    fontSize: '12px',
    fontWeight: '700',
    color: theme.palette.common.black
  },
  panelHeader: {
    display: 'flex',
    padding: '5px',
    borderTop: '1px solid #e0e0e0'
  },
  totalInventory: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontWeight: '500',
    // paddingRight: '20px',    
    padding: '5px',
  },
  totalInventoryRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    borderColor: theme.palette.grey[800],
    backgroundColor: theme.palette.grey[800],
    border: '1px solid',
    borderRadius: '4px',
    borderWidth: '2px',
    '& div': {
      // margin: '0 10px'
    },
    '& span': {
      fontWeight: '500'
    }
  },
  totalInventoryValues: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  totalInventoryLabel:{
    '& p,& span':{
      color: theme.palette.common.white,
    },
  },
  date: {
    alignSelf: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]:{
      fontSize: '10px'
    }
  },
  slider: {
    display: 'flex',
    alignSelf: 'center',
    paddingTop: '10px',
    maxWidth: '140px'
  },
  serviceConfig: {
    textAlign: 'right',
    '& section': {
      marginLeft: 'auto'
    }
  },
  icon: {
    cursor: 'pointer',
    border: 'none',
    position: 'relative',
    top: '5px',
    background: theme.palette.grey[50]
  },
  serviceConfig: {
    '&>section>div': {
      borderWidth: '2px',
      borderColor: theme.palette.grey[400],
      [theme.breakpoints.down('md')]:{
        maxWidth: '100%',
        minWidth: '100%',
      }
    }
  },
  totalInventoryText: {
    // marginRight: '10%',
    fontWeight: 'bold',
    color: theme.palette.common.white,
    // paddingLeft: 20,
  },
  btnBack:{
    backgroundColor: 'transparent',
    position: 'absolute',
    left: '-40px',
    top: '-60px',
    zIndex: '9999',
    border: '0',
    cursor: 'pointer',
    color: theme.palette.grey[800],
    [theme.breakpoints.down('md')]:{
      left: '-20px',
      top: '-30px',
    }
  },
  spinner: {
    '& svg': {
      color: theme.palette.common.white,
      fill: theme.palette.common.white,
    }
  }
}));

const SimulatorTabHeader = React.memo(() => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editBackDisable, setEditBackDisable] = useState(true);
  const [editFrontDisable, setEditFrontDisable] = useState(false);
  const zoom = useSelector(({ pog }) => pog.current.zoom);
  const stimulationProducts = useSelector(
    ({ pog }) =>
      pog.current.simulate.viewConfiguration.viewSimulationData.displayOutput
  );
  const pogID = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.pogId
  );
  const dateFilter = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.selectedDate
  );
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const currentLoading = useSelector(({ pog }) => pog.loading);
  const dateDetails = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration
  );
  const serviceConfigType = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.serviceConfigName
  );
  const totalInventory = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.totalInventory
  );
  const currentSimulate = useSelector(({ pog }) => pog.current.simulate);

  const totalInventoryData = {
    pogID,
    dateFilter,
    serviceConfigType
  };

  const handleDropdownChange = (type, value) => {
    dispatch(actions.setServicesConfig(value));
    // dispatch(actions.calculateTotalInventory(totalInventoryData));
  };

  useEffect(() => {
    if (dateDetails.dateArray && dateDetails.dateArray.length > 0) {
      dateDetails.dateArray[dateDetails.dateIndex - 1] === undefined
        ? setEditBackDisable(true)
        : setEditBackDisable(false);
      dateDetails.dateArray[dateDetails.dateIndex + 1] === undefined
        ? setEditFrontDisable(true)
        : setEditFrontDisable(false);
    }
  });

  useEffect(() => {
    if (
      pogID !== '__UNSELECTED__' &&
      currentLoading === false &&
      typeof dateFilter !== 'undefined' &&
      dateFilter !== '__UNSELECTED__'
    ) {
      // dispatch(actions.clearTotalInventory());
      dispatch(actions.calculateTotalInventory(totalInventoryData));
    }
  }, [dateFilter, currentLoading, pogID, serviceConfigType]);

  const handleBackClick = () => {
    let dateObj = {
      selectedDate: dateDetails.dateArray[dateDetails.dateIndex - 1],
      dateIndex: dateDetails.dateIndex - 1
    };
    dispatch(actions.setSelectedDate(dateObj));
  };

  const handleFrontClick = () => {
    let dateObj = {
      selectedDate: dateDetails.dateArray[dateDetails.dateIndex + 1],
      dateIndex: dateDetails.dateIndex + 1
    };
    dispatch(actions.setSelectedDate(dateObj));
  };

  const handleZoom = (event, value) => {
    dispatch(actions.setZoomForPlanogram(value));
  };

  const handleBackToSimulationScreen = () => {
    dispatch(actions.unSelectPlanogramPosition());
    dispatch(actions.setSimulationView(false));
    dispatch(actions.setCurrentSubActivityType(-1));
    dispatch(actions.clearSimulationViewTab());
  };

  const filterType = currentSimulate.viewConfiguration.serviceConfigName;
  return (
    <Grid container className={classes.panelHeader} spacing={2}>
      <Grid item xs={2} className={classes.date}>
        <button
            className={classes.btnBack}
            variant="contained"
            onClick={() => handleBackToSimulationScreen()}
            color="primary"
          >
          <FontAwesomeIcon icon={['fas', 'arrow-alt-circle-left']} size="2x" />
        </button>
        <button
          disabled={editBackDisable}
          onClick={() => handleBackClick()}
          className={classes.icon}
        >
          <FontAwesomeIcon icon={['fas', 'caret-left']} size="2x" />
        </button>
        {formatDate(dateDetails.selectedDate)}
        <button
          disabled={editFrontDisable}
          onClick={() => handleFrontClick()}
          className={classes.icon}
        >
          <FontAwesomeIcon icon={['fas', 'caret-right']} size="2x" />
        </button>
      </Grid>
      <Grid item xs={2} className={classes.date}>
        <span className={classes.slider}>
          <Slider
            defaultValue={zoom}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={0.1}
            marks
            min={0.4}
            max={1}
            onChange={handleZoom}
          />
        </span>
      </Grid>
      <Grid item xs={6} className={classes.totalInventory}>
        <Grid container className={classes.totalInventoryRoot}>
          <Grid item xs={3}>
            <Typography component="h5" className={classes.totalInventoryText} >
              Inventory Status
            </Typography>
          </Grid>
          {
            isLoadingPosForPlanogram(currentLoading, currentLoadingType) ? (
              <Grid item xs={9}>
                <div className={classes.progress}>
                  <CircularProgress
                    className={classes.spinner}
                    size={24}
                  />
                </div>
              </Grid>
            ) : (
              <Grid item className={classes.totalInventoryValues} xs={9}>
                <Grid item className={classes.totalInventoryLabel}>
                  <Typography component="p"
                    title="% of total stock which is their in the display at that moment">% Fullness</Typography>
                  <Typography component="span">{`${totalInventory.fullNess.toFixed(
                    2
                  )}%`}</Typography>
                </Grid>
                <Grid item className={classes.totalInventoryLabel}>
                  <Typography component="p" fontWeight="fontWeightBold"
                    title="% of unique SKU that are good in stock">
                    Instock @SKU
                  </Typography>
                  <Typography component="span">{`${totalInventory.instockSKU.toFixed(
                    2
                  )}%`}</Typography>
                </Grid>
                <Grid item className={classes.totalInventoryLabel}>
                  <Typography component="p" fontWeight="fontWeightBold"
                    title="% of facing that are good in stock (irrespective of repeatness of the product)">
                    Instock @Facing
                  </Typography>
                  <Typography component="span">{`${totalInventory.instockFacing.toFixed(
                    2
                  )}%`}</Typography>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      </Grid>
      {/* <Grid item xs={1}></Grid> */}
      <Grid item xs={2} className={classes.serviceConfig}>
        <DropDown
          label="Service Config"
          key="Sales Sources"
          type={dropDownType.serviceConfig}
          values={serviceConfig}
          current={currentSimulate.viewConfiguration.serviceConfigName.toString()}
          onChange={handleDropdownChange}
        />
      </Grid>
    </Grid>
  );
});

export default SimulatorTabHeader;

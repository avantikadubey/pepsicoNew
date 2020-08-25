import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import {
  isLater,
  isLoadingForRunSimulation,
  isLoadingForDeleteSimConfiguration,
  simSuggestionData
} from '../../@planogram/store/state/utility';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DropDown, Calendar } from '@planogram/design-system';
import * as actions from '../../@planogram/store/state/actions';
import moment from 'moment';
import { ConfigModal } from '@planogram/design-system';
import InfographicSimulation from '../../../static/infographics/Infographic_Simulation.png';

const useStyles = makeStyles((theme) => ({
  SimulatorRunContainer: {
    display: 'flex',
    alignItems: 'start',
    //    paddingBottom: '10px',
    marginTop: '1rem',
    marginBottom: '1rem',
    // borderBottom: '1px solid #e0e0e0',
    borderColor: theme.palette.grey[300]
  },
  bgImage: {
    '& img': {
      maxWidth: '100%',
      margin: '0 auto',
      display: 'block'
    }
  },
  dropDown: {
    '&>section>div': {
      borderWidth: '2px',
      borderColor: theme.palette.grey[400],
      [theme.breakpoints.down('md')]:{
        minWidth: '100%',
        maxWidth: '100%',
      },
      '& >div>div':{
        [theme.breakpoints.down('sm')]:{
          paddingTop: '37px',
        }
      }
    }
  },
  marginLeft: {
    marginLeft: '15px',
    '& :first-child':{
      marginLeft: '0',
    },
    [theme.breakpoints.down('sm')]:{
      marginLeft: '10px',
      '& :first-child':{
        marginLeft: '0',
      },
    },
  },
  productUPC: {
    fontSize: '12px',
    fontWeight: '700',
    color: theme.palette.common.black
  },
  dateField: {
    [theme.breakpoints.down('md')]:{
      fontSize: '14px',
    },
    '& > div > button': {
      [theme.breakpoints.down('md')]:{
        padding: '10px',
      },
      [theme.breakpoints.down('sm')]:{
        padding: '0',
      },
    }
  },
  marginLeftButton: {
    marginLeft: '25px'
  },
  btnRun: {
    position: 'relative',
    marginLeft: '25px',
    alignSelf: 'center',
    '& button': {
      width: '100%'
    }
  },

  buttonProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    top: 5
  },
  alignment: {
    flexDirection: 'column'
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    marginLeft: '15px',
    marginTop: '-15px'
  }
}));

const dropDownType = {
  simConfig: 'simConfig',
  storeConfig: 'storeConfig',
  saleSource: 'saleSource'
};

const SimulateRunContainer = React.memo(({ handleSimulationRun }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const simConfigSelectList = [];
  const [simStoresConfig, setSimStoresConfig] = useState([]);
  const [flag, setFlag] = useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [alreadyExistStatus, setAlreadyExistStatus] = React.useState(null);
  const [newconfigureValue, setNewconfigureValue] = React.useState(null);
  const [deleteSimConfig, setDeleteSimConfig] = React.useState(null);
  const runSimulation = useSelector(({ pog }) => pog.runSimulation);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const storeId = useSelector(({ pog }) => pog.current.config.storeId);
  const loading = useSelector(({ pog }) => pog.loading);
  const success = useSelector(({ pog }) => pog.success);
  const notificationMessageSuccess = useSelector(
    ({ pog }) => pog.notificationMessage
  );
  const [ctaStatus, setCtaStatus] = useState(false);
  const configSelectList = []; // data for configuration dropdown
  const saleSourceList = [
    ['1', 'POS'],
    ['2', 'FORECAST']
  ]; // data for sales source
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  const currentSimulation = useSelector(
    ({ pog }) => pog.current.simulate.runConfiguration
  );
  const simulationConfig = useSelector(
    ({ pog }) => pog.current.simulate.runConfiguration.simulationConfig
  );
  const storeConfigs = useSelector(({ pog }) => pog.storeConfigs);
  const suggestionData = simSuggestionData(simulationConfig);
  _.forEach(simulationConfig, function(value) {
    simConfigSelectList.push([
      value.id,
      value.simconfigName,
      value.configId,
      value.dataType,
      value.fromDate,
      value.toDate
    ]);
  });

  _.forEach(storeConfigs, function(value) {
    configSelectList.push([value.configId, value.configName]);
  });

  useEffect(() => {
    if (
      //currentSimulation.simConfigId !== '__UNSELECTED__' ||
      currentSimulation.storeConfigId !== '__UNSELECTED__' &&
      currentSimulation.saleSourceId !== '__UNSELECTED__'
    ) {
      setCtaStatus(true);
    } else {
      setCtaStatus(false);
    }
    if (!flag) {
      setSimStoresConfig(configSelectList);
    }
  }, [currentSimulation, currentActivity]);

  const handleOpen = (type) => {
    console.log('type', type);
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (
      success &&
      notificationMessageSuccess.type === 'success' &&
      notificationMessageSuccess.loadingType === 18
    ) {
      console.log('done');
      handleClose();
    }
  }, [success, notificationMessageSuccess]);

  const getStoresConfigForSimulate = (value) => {
    setFlag(true);
    const refsConfigId =
      value === '__UNSELECTED__'
        ? '__UNSELECTED__'
        : simConfigSelectList.find((conf) => conf[0] === value)[2];
    if (refsConfigId !== '__UNSELECTED__') {
      const foundStore = configSelectList.find(
        (storeConfig) => storeConfig[0] === refsConfigId
      );
      setSimStoresConfig([foundStore]);
    } else {
      setSimStoresConfig(configSelectList);
    }

    dispatch(actions.selectSimulationStoreConfig({ id: refsConfigId }));
  };

  const handleDropdownChange = (type, value) => {
    if (type === dropDownType.simConfig) {
      setFlag(true);
      let StimulationValues = simConfigSelectList.find(
        (conf) => conf[0] === value
      );
      dispatch(
        actions.selectSimulationConfig({
          id: value,
          name: StimulationValues[1]
        })
      );
      getStoresConfigForSimulate(value);
      let saleSourceName =
        StimulationValues[3] === '__UNSELECTED__'
          ? '__UNSELECTED__'
          : StimulationValues[3].toUpperCase();
      let saleSourceId =
        saleSourceName === '__UNSELECTED__'
          ? '__UNSELECTED__'
          : saleSourceList.find((sales) => sales[1] === saleSourceName)[0];
      dispatch(
        actions.selectSimulationSaleSource({
          id: saleSourceId,
          name: saleSourceName
        })
      );
      handleCalendarChange('From Date', StimulationValues[4], true);
      handleCalendarChange('To Date', StimulationValues[5], true);
    } else if (type === dropDownType.storeConfig) {
      dispatch(actions.selectSimulationStoreConfig({ id: value }));
    } else if (type === dropDownType.saleSource) {
      dispatch(
        actions.selectSimulationSaleSource({
          id: saleSourceList.find((conf) => conf[0] === value)[0],
          name: saleSourceList
            .find((conf) => conf[0] === value)[1]
            .toUpperCase()
        })
      );
    }
  };

  const handleCalendarChange = (type, value, intialVal) => {
    const date = moment(value).format('MM/DD/YYYY');

    if (
      !intialVal &&
      type === 'To Date' &&
      !isLater(date, currentSimulation.fromDate)
    ) {
      //add snack bar
      alert('To date can not less then from date');
      return;
    }
    dispatch(actions.setCalendarValue({ type: type, date: date }));
  };

  const handleDeleteSimulationConfig = (event, value) => {
    setDeleteSimConfig(value.id);
  };
  const deleteSelectedSimConfig = () => {
    let data = {
      csId: storeId,
      simConfigId: deleteSimConfig
    };
    dispatch(actions.deleteSimulationConfiguration(data));
  };

  return (
    <>
      <Grid item xs={12} className={classes.SimulatorRunContainer}>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          className={[
            classes.dropDown,
            classes.marginLeft,
            classes.alignment
          ].join(' ')}
        >
          <DropDown
            label="Simulation Config"
            onChange={handleDropdownChange}
            key="Simulation Config"
            type={dropDownType.simConfig}
            values={simConfigSelectList}
            current={currentSimulation.simConfigId}
            disabled={simConfigSelectList.length === 0}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          className={classes.dropDown}
          className={[classes.dropDown, classes.marginLeft].join(' ')}
        >
          <DropDown
            label="Store Configuration"
            onChange={handleDropdownChange}
            current={currentSimulation.storeConfigId}
            values={simStoresConfig}
            type={dropDownType.storeConfig}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          className={[classes.dropDown, classes.marginLeft].join(' ')}
        >
          <DropDown
            label="Sales Sources"
            onChange={handleDropdownChange}
            key="Sales Sources"
            type={dropDownType.saleSource}
            values={saleSourceList}
            current={currentSimulation.saleSourceId}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          className={[classes.dropDown, classes.marginLeft].join(' ')}
        >
          <Calendar
            labelText="From Date"
            className={classes.dateField}
            onChange={handleCalendarChange}
            dateValue={new Date(currentSimulation.fromDate)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          className={[classes.dropDown, classes.marginLeft].join(' ')}
        >
          <Calendar
            labelText="To Date"
            className={classes.dateField}
            onChange={handleCalendarChange}
            dateValue={new Date(currentSimulation.toDate)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2} className={classes.btnRun}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSimulationRun}
            className={classes.btn}
            disabled={
              ctaStatus === false || isLoadingForRunSimulation(runSimulation)
            }
          >
            Run
          </Button>
          {isLoadingForRunSimulation(runSimulation) && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.SimulatorRunContainer}>
        <div
          className={classes.link}
          onClick={() => handleOpen('deleteSimulationConfig')}
        >
          Delete Configuration
        </div>
      </Grid>
      <Grid item md={12} className={classes.bgImage}>
        <img src={InfographicSimulation} alt="Infographic Simulation" />
      </Grid>
      <ConfigModal
        open={open}
        handleClose={handleClose}
        handleOnChange={handleDeleteSimulationConfig}
        simData={suggestionData}
        alreadyExistStatus={alreadyExistStatus}
        modalType={modalType}
        deleteSelectedConfig={deleteSelectedSimConfig}
        loading={loading}
        currentLoadingType={currentLoadingType}
        isLoadingForDeleteSimConfiguration={isLoadingForDeleteSimConfiguration}
      />
    </>
  );
});

export default SimulateRunContainer;

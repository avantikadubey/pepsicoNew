import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
//import { CSVLink } from 'react-csv';
import * as actions from '../../@planogram/store/state/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  isLoadingPosForPlanogram,
  isLoadingForSaveSimulationConfiguration,
  isSuccessForSaveSimulationConfiguration,
  exportToXLS
} from '../../@planogram/store/state/utility';
import { PlanogramContainer } from '../planogram-container';
import SimulatorTabHeader from './simulator-tab-header';
import { ConfigModal } from '@planogram/design-system';
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
    height: '120vh'
  },
  tabPanel: {
    '& .MuiBox-root': {
      padding: '0px !important'
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    paddingTop: '0px'
  },
  btnSave: {
    marginLeft: '15px'
  },
  simulationIndicators: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '24px'
  },
  lsIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.common.amber
  },
  backStockIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: '#800080',
    marginLeft: '25px'
  },
  indicatorsLabel: {
    fontSize: '12px',
    color: theme.palette.primary.main,
    marginLeft: '2px',
    position: 'relative',
    top: '2px'
  },
  OosIndicator: {
    height: '11px',
    width: '11px',
    backgroundColor: theme.palette.common.red,
    marginLeft: '25px'
  },
  csvLink: {
    textDecoration: 'none',
    color: theme.palette.common.white
  },
  flexRow:{
    width: '100px',
    margin: '0 auto',
    marginTop: '35px'
  },
  spinner: {
    zIndex: 99999,
  },
  planogramHead: {
    position: 'relative',
    marginTop: '20px',
  },
  flna: {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: '-16px',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  FLNALabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    position: 'relative',
    padding: '10px',
    paddingBottom: 0,
    background: theme.palette.background.default,
    [theme.breakpoints.down('sm')]:{
      padding: '8px',
      lineHeight: '1',
    },
    '& span': {
      fontSize: '16px',
      marginLeft: '5px',
      [theme.breakpoints.down('md')]:{
        fontSize: '14px',
      },
      [theme.breakpoints.down('sm')]:{
        fontSize: '12px',
      }
    }
  },
}));

export default function SimulateTabs(tabs) {
  // console.log("tabs",tabs)

  const classes = useStyles();

  const currentConfig = useSelector(({ pog }) => pog.current.config);
  const viewSimulate = useSelector(({ pog }) => pog.current.simulate.viewConfiguration);
  const [
    newSimulationConfigureValue,
    setNewSimulationConfigureValue
  ] = React.useState(null);
  const [alreadyExistStatus, setAlreadyExistStatus] = React.useState(null);
  const currentSimulationConfigList = useSelector(
    ({ pog }) => pog.current.simulate.runConfiguration
  );
  const loading = useSelector(({ pog }) => pog.loading);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const success = useSelector(({ pog }) => pog.success);
  const runResponse = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.viewSimulationData
  );

  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  //const [tabName, setTabName] = React.useState(tabs.tabs[viewSimulate.tabIndex].locationCode);



  const handleOpen = (type) => {
    setNewSimulationConfigureValue(null);
    setAlreadyExistStatus(null);
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccessForSaveSimulationConfiguration(success, currentLoadingType)) {
      setOpen(false);
    }
  }, [success, currentLoadingType]);

  useEffect(() => {
      //handle error for API response
  dispatch(actions.simulationDataTransform(runResponse));
  }, []);

  const handleNewSimulationConfiguration = (event) => {
    let simulationConfigNameArray = _.map(
      currentSimulationConfigList.simulationConfig,
      'simconfigName'
    );
    let simConfigNameArrayLowerCase = _.mapValues(
      simulationConfigNameArray,
      _.method('toLowerCase')
    );
    let simulationConfigNameTrim = event.target.value.trim();
    let simConfigNameLowerCase = simulationConfigNameTrim.toLowerCase();

    setAlreadyExistStatus(
      !_.find(simConfigNameArrayLowerCase, function(value) {
        return value === simConfigNameLowerCase;
      })
        ? false
        : true
    );

    if (simConfigNameLowerCase === null || simConfigNameLowerCase === '') {
      setAlreadyExistStatus(null);
    }
    setNewSimulationConfigureValue(simulationConfigNameTrim);
  };

  const saveNewSimulationConfiguration = () => {
    let data = {
      csId: currentConfig.storeId,
      configId: currentSimulationConfigList.storeConfigId,
      dataType: currentSimulationConfigList.saleSourceName,
      fromDate: currentSimulationConfigList.fromDate,
      toDate: currentSimulationConfigList.toDate,
      simconfigName: newSimulationConfigureValue
    };
    dispatch(actions.saveSimulationConfiguration(data));
  };

  const handleChange = (event, newValue) => {
    dispatch(actions.clearSimulationViewTab());
    let tabId = tabs.tabs[newValue].pogId;
    setSelectedTab(newValue);

    const data = {
      pogId: tabId,
      configId: currentConfig.configId
    };
    dispatch(actions.selectSimulationViewTab({ id: tabId, index: newValue }));
    dispatch(actions.setPosForPlanogram(data));
    dispatch(actions.simulationDataTransform(runResponse));
  };
  const currentPOS = useSelector(({ pog }) => pog.current.planogram);

  function generateXLandJSON(runResponse, fileName) {
    exportToXLS(runResponse, fileName);
  }

  const countFLNA = (type) => {
    const pos = currentConfig.pos
    const filterPos = pos.filter((item) => item.upc.startsWith('0028400'));
    let count;
    if(type === 'flna'){
      count = filterPos.length;
      console.log('count1', count);
    } else {
      count = pos.length - filterPos.length
      console.log('count2', count);
    }
    return count;
  }

  return (
    <div className={classes.root}>
      
      <AppBar position="static" color="primary">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          {tabs.tabs.map((tabName, index) => (
            <Tab
              label={tabName.locationCode}
              key={tabName.pogId}
              {...a11yProps({ index })}
            />
          ))}
        </Tabs>
      </AppBar>

      <SimulatorTabHeader />

      {isLoadingPosForPlanogram(loading, currentLoadingType) ? (
        <Grid item xs={12} className={classes.flexRow}>
          <Grid item xs={12}>
            <CircularProgress
              color="primary"
              className={classes.spinner}
              size={50}
            />
          </Grid>
        </Grid>
      ) : (
        <TabPanel
          index={selectedTab}
          value={selectedTab}
          className={classes.tabPanel}
        >
          {currentPOS !== null && 
            <Grid container className={classes.planogramHead}>
              <Grid item xs={12} className={classes.flna}>
                <div className={classes.FLNALabel}><span>Planogram Position Summary</span></div>
                <div className={classes.FLNALabel}>FLNA occupied position:<span>{`${countFLNA('flna')}`}</span></div>
                <div className={classes.FLNALabel}>Non-FLNA occupied position:<span>{`${countFLNA()}`}</span></div>
                <div className={classes.FLNALabel}>Unique FLNA Products across this display:<span>{`${viewSimulate.totalInventory.totalBDC}`}</span></div>
              </Grid>
              <PlanogramContainer data={currentPOS} simulationView/>
            </Grid>
          }
          <Grid item xs={12} className={classes.simulationIndicators}>
            <div className={classes.lsIndicator}></div>
            <span className={classes.indicatorsLabel}>Low Stock</span>
            <div className={classes.OosIndicator}></div>
            <span className={classes.indicatorsLabel}>Out of Stock</span>
            <div className={classes.backStockIndicator}></div>
            <span className={classes.indicatorsLabel}>Back Stock</span>
          </Grid>
          <Grid item xs={12} className={classes.buttons}>
        
        <Button
              color="primary"
              variant="contained"
              onClick={(e) => generateXLandJSON(runResponse, 'SimulationResult')}
            >
              Export Output
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.btnSave}
              onClick={() => handleOpen('saveSimulationConfig')}
            >
              Save Configuration
            </Button>
      </Grid>
          
        </TabPanel>
       
      )}

      <ConfigModal
        open={open}
        handleClose={handleClose}
        data={newSimulationConfigureValue}
        handleOnChange={handleNewSimulationConfiguration}
        handleOnClick={saveNewSimulationConfiguration}
        alreadyExistStatus={alreadyExistStatus}
        modalType={modalType}
        loading={loading}
        currentLoadingType={currentLoadingType}
        isLoadingForSaveSimulationConfiguration={
          isLoadingForSaveSimulationConfiguration
        }
      />
    </div>
  );
}

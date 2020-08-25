import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress } from '@material-ui/core';
import {
  activityType,
  subActivityType,
  isLoadingForRunSimulation,
  isSuccessForRunSimulation,
  formatDate
} from '../../@planogram/store/state/utility';
import * as actions from '../../@planogram/store/state/actions';
import SimulatorRunContainer from './simulator-run-container';
import SimulatorViewContainer from './simulator-view-container';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  productUPC: {
    fontSize: '12px',
    fontWeight: '700',
    color: theme.palette.common.black
  },
  placeHolder: {
    display: 'flex',
    height: '74vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 25,
    border: `4px solid #bdbdbd`,
    padding: 10,
    backgroundColor: theme.palette.common.white
  }
}));

const SimulatorContainer = React.memo(() => {
  const currentActivity = useSelector(({ pog }) => pog.current.activity);
  const currentConfig = useSelector(({ pog }) => pog.current.config);
  const tabs = useSelector(({ pog }) => pog.current.config.pogs);
  const currentStoreId = useSelector(({ pog }) => pog.current.config.storeId);
  const currentSimulate = useSelector(({ pog }) => pog.current.simulate);
  const loading = useSelector(({ pog }) => pog.loading);
  const runSimulation = useSelector(({ pog }) => pog.runSimulation);
  const runSimulationPass = useSelector(({ pog }) => pog.runSimulationPass);
  const success = useSelector(({ pog }) => pog.success);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const runResponse = useSelector(
    ({ pog }) => pog.current.simulate.viewConfiguration.viewSimulationData
  );

  const dispatch = useDispatch();

  // if (currentActivity === activityType.SIMULATION) {
  //   console.log('Simulator Rendered');
  //   // dispatch(actions.loadPlanogramsForConfiguration(config.configId))
  // }

  useEffect(() => {
    dispatch(actions.setSimulationView(true));
    if(tabs.length > 0){
      dispatch(actions.setCurrentSubActivityType(subActivityType.SUCCESS_SIMULATION));
    }
  }, [runResponse]);

  const classes = useStyles();

  const handleSimulationRun = () => {
    dispatch(actions.unSelectPlanogramPosition());
    let tabId =
      currentSimulate.viewConfiguration.pogId != '__UNSELECTED__'
        ? currentSimulate.viewConfiguration.pogId
        : currentConfig.pogs[0].pogId;

    const data = {
      pogId: tabId,
      configId: currentConfig.configId
    };
    dispatch(actions.selectSimulationViewTab({ id: tabId, index: 0 }));
    let runData = {
      csId: currentStoreId,
      configId: currentSimulate.runConfiguration.storeConfigId,
      dataType: currentSimulate.runConfiguration.saleSourceName.toLowerCase(),
      fromDate: formatDate(currentSimulate.runConfiguration.fromDate),
      toDate: formatDate(currentSimulate.runConfiguration.toDate)
    };

    dispatch(actions.runSimulation(runData));
    dispatch(actions.setCurrentSubActivityType(subActivityType.RUN_SIMULATION));

    dispatch(actions.setPosForPlanogram(data));
  };

  return (
    <>
      <Fragment>
        {currentActivity === activityType.SIMULATION && !currentSimulate.simulationView && (
          <Fragment>
            <SimulatorRunContainer handleSimulationRun={handleSimulationRun} />
            {/* {  (runSimulationPass === false && runSimulation === false ) &&
            (
              <Grid item xs={12} className={classes.placeHolder}>
                Click on Run to View Simulation
              </Grid>
            )
          } */}
            {/* {
            isLoadingForRunSimulation(runSimulation, currentLoadingType) && (
              <Grid item xs={12} className={classes.placeHolder}>
                <CircularProgress
                  color="primary"
                  className={classes.spinner}
                  size={50}
                />
              </Grid>
            )
          }
          { isSuccessForRunSimulation(runSimulationPass) && currentSimulate.simulationView && tabs.length>0 && (
              <SimulatorViewContainer tabs={tabs}/>
            )
          } */}
            {/* {currentSimulate.simulationView && tabs.length>0?  
          <SimulatorViewContainer tabs={tabs}/>:
          <Grid item xs={12} className={classes.placeHolder}>
             Click on Run to View Simulation
          </Grid>
           } */}
          </Fragment>
        )}
        {isSuccessForRunSimulation(runSimulationPass) && currentSimulate.simulationView && tabs.length > 0 && (
          <SimulatorViewContainer tabs={tabs} />
        ) }
      </Fragment>
    </>
  );
});

export default SimulatorContainer;

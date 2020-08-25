import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Button } from '@material-ui/core';
import { ConfigModal } from '@planogram/design-system';
import * as _ from 'lodash';
import {
  isLoadingForDeleteConfiguration,
  isLoadingForSaveAsConfiguration,
  activityType
} from '../../@planogram/store/state/utility';


const useStyles = makeStyles((theme) =>
  createStyles({
    cta: {
      textAlign: 'center',
      padding: '35px 20px'
    },
    ctaSaveAs: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      //	boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.54)',
      padding: '10px 35px',
      height: 'auto',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main
      },
      marginRight: '20px'
    },
    ctaSave: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      //	boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.54)',
      padding: '10px 30px',
      height: 'auto',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main
      },
      marginRight: '20px'
    },
    spinner: {
      color: theme.palette.secondary.main
    }
    
    
  })
);


const ButtonContainer = ({ labels }) => {
  let SaveAsButtonStatus = true;
  let SaveButtonStatus = false;

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [newconfigureValue, setNewconfigureValue] = React.useState(null);
  const [alreadyExistStatus, setAlreadyExistStatus] = React.useState(null);
  const [customPlanoDetails, setCustomPlanoDetails] = React.useState({name:null,rows:null});
  const dispatch = useDispatch();
  const configDetails = useSelector(({ pog }) => pog.current.config);
  const storeConfigs = useSelector(({ pog }) => pog.storeConfigs);
  const loading = useSelector(({ pog }) => pog.loading);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const currentActivityType = useSelector(({ pog }) => pog.current.activity);
  const classes = useStyles();
  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveNewConfiguration = () => {
    let data = {
      csId: configDetails.storeId,
      refConfigId: configDetails.configId,
      configName: newconfigureValue,
      lowInventory: configDetails.lowInventory,
      outOfStock: configDetails.outOfStock,
      pogs: configDetails.pogs
    };
    dispatch(actions.saveAsCurrentConfiguration(data));
  };

  const saveCurrentConfiguration = () => {
    let data = {
      csId: configDetails.storeId,
      configId: configDetails.configId,
      lowInventory: configDetails.lowInventory,
      outOfStock: configDetails.outOfStock,
      pogs: configDetails.pogs
    };
    dispatch(actions.saveCurrentConfiguration(data));
  };

  let planogramSalesAllocationCount = _.sumBy(configDetails.pogs, function(
    sum
  ) {
    return parseInt(sum.salesAllocation) ? parseInt(sum.salesAllocation) : 0;
  });
  
  SaveButtonStatus =
    planogramSalesAllocationCount === 100 &&
    currentActivityType === activityType.CONFIGURATION &&
    configDetails.dirty === true
      ? true
      : false;
  SaveAsButtonStatus = planogramSalesAllocationCount === 100 ? true : false;
  const handleNewConfiguration = (event) => {
    let configNameArray = _.map(storeConfigs, 'configName');
    let configNameArrayLowerCase = _.mapValues(
      configNameArray,
      _.method('toLowerCase')
    );
    let configNameTrim = event.target.value.trim();
    let configNameLowerCase = configNameTrim.toLowerCase();

    setAlreadyExistStatus(
      !_.find(configNameArrayLowerCase, function(value) {
        return value === configNameLowerCase;
      })
        ? false
        : true
    );

    if (configNameLowerCase === null || configNameLowerCase === '') {
      setAlreadyExistStatus(null);
    }
    setNewconfigureValue(configNameTrim);
  };

  const deleteSelectedConfig = () => {
    let data = {
      configId: configDetails.configId,
      storeId: configDetails.storeId
    };
    dispatch(actions.deleteCurrentConfiguration(data));
  };


  //add planos
  const addCustomPlanogram = () => {
    //console.log("new planos&&*&",customPlanoDetails)
    dispatch(actions.addPlanogram(customPlanoDetails));
    setOpen(false);
  };
  const customPlanoName = (event) => {
      setCustomPlanoDetails({...customPlanoDetails,name:event.target.value})
  };
  const customPlanoRows = (event) => {
    setCustomPlanoDetails({...customPlanoDetails,rows:event.target.value})
};

  return (
    <Grid container>
      <Grid item xs={12} className={classes.cta}>
        <Button
          className={classes.ctaSaveAs}
          variant="contained"
          color="primary"
          onClick={() => handleOpen('saveAsConfig')}
          disabled={SaveAsButtonStatus === false ? true : false}
        >
          {labels.buttonLabel1}
        </Button>
        {/* {configDetails.configName !== 'Default' ? (
        <Button
          className={classes.ctaSaveAs}
          variant="contained"
          color="primary"
          onClick={() => handleOpen('addPlanogram')}
        >
          {labels.buttonLabel4}
        </Button>
        ) : (
          ''
        )} */}
        {/* {configDetails.configName !== 'Default' ? ( */}
          <Button
            className={classes.ctaSave}
            variant="contained"
            color="primary"
            onClick={() => saveCurrentConfiguration()}
            disabled={SaveButtonStatus === false ? true : false}
          >
            {labels.buttonLabel2}
          </Button>
        {/* ) : (
          ''
        )} */}
        {configDetails.configName !== 'Default' ? (
          <Button
            className={classes.ctaSave}
            variant="contained"
            color="primary"
            onClick={() => handleOpen('delete')}
          >
            {labels.buttonLabel3}
          </Button>
        ) : (
          ''
        )}
      </Grid>
      <ConfigModal
       open={open}
        customPlanoName={customPlanoName}
        customPlanoRows={customPlanoRows}
        handleClose={handleClose}
        data={newconfigureValue}
        handleOnChange={handleNewConfiguration}
        handleOnClick={saveNewConfiguration}
        alreadyExistStatus={alreadyExistStatus}
        modalType={modalType}
        deleteSelectedConfig={deleteSelectedConfig}
        addCustomPlanogram={addCustomPlanogram}
        loading={loading}
        currentLoadingType={currentLoadingType}
        isLoadingForDeleteConfiguration={isLoadingForDeleteConfiguration}
        isLoadingForSaveAsConfiguration={isLoadingForSaveAsConfiguration}
      />
    </Grid>
  );
};

ButtonContainer.propTypes = {
  //classes: PropTypes.object.isRequired,
  labels: PropTypes.object.isRequired
};


export default ButtonContainer;
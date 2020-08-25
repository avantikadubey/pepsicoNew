/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import * as actions from '../../@planogram/store/state/actions';
import { DropDown } from '@planogram/design-system';
import * as _ from 'lodash';
import InventorySliders from '../inventory-sliders/inventory-sliders';
import CardContainer from '../card-container/card-container';
import {
  isSuccesForPlanogramsForConfig,
  isLoadingPlanogramsForConfig,
  activityType,
  subActivityType
} from '../../@planogram/store/state/utility';
import EditCardContainer from '../edit-card-container/edit-card-container';
import ButtonContainer from '../button-container/button-container';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import axios from '../../shared/axios-planogram';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '1rem',
    },
    inventorySpinner: {
      textAlign: 'center',
      marginTop: '7vh'
    },
    planoSpinner: {
      textAlign: 'center',
      padding: '15vh'
    },
    spinner: {
      color: theme.palette.primary.main
    },
    configureItem: {
      marginTop: '1rem',
      marginBottom: '1rem'
    }
  })
);

const dropDownType = {
  config: 'config'
};

const ConfigureContainer = React.memo(
  ({ labels, configCallback, labelforCardContainer }) => {
    const classes = useStyles();

    // data for configuration dropdown
    const configSelectList = [];
    const dispatch = useDispatch();
    const storeConfigs = useSelector(({ pog }) => pog.storeConfigs);
    const currentConfig = useSelector(({ pog }) => pog.current.config);
    const currentSubActivityType = useSelector(
      ({ pog }) => pog.current.subActivity
    );
    const currentActivityType = useSelector(({ pog }) => pog.current.activity);
    const loading = useSelector(({ pog }) => pog.loading);
    const success = useSelector(({ pog }) => pog.success);
    const currentLoadingType = useSelector(({ pog }) => pog.loadingType);

    _.forEach(storeConfigs, function(value) {
      configSelectList.push([value.configId, value.configName]);
    });

    // renderComponent to update slider value on change of config dropdown
    const handleDropDownChange = (type, configId) => {
      if (configId) {
        configCallback(configId);

        const newConfig = storeConfigs.find(
          (config) => config.configId === configId
        );

        if (typeof newConfig !== 'undefined') {
          dispatch(actions.setCurrentConfigurationInventory(newConfig));
        }
      }
    };
    return (
      <Fragment>
        {currentActivityType === activityType.CONFIGURATION &&
          currentSubActivityType !== subActivityType.EDIT_CONFIGURATION && (
            <Fragment>
              <Grid container className={classes.configureContainer}>
                <Grid item className={classes.configureItem} xs={12}>
                  <DropDown
                    label="Configuration"
                    current={currentConfig.configId}
                    values={configSelectList}
                    type={dropDownType.config}
                    onChange={handleDropDownChange}
                  />
                </Grid>

                {isLoadingPlanogramsForConfig(loading, currentLoadingType) ? (
                  <Grid item xs={12} className={classes.inventorySpinner}>
                    <CircularProgress
                      color="secondary"
                      className={classes.spinner}
                      size={50}
                    />
                  </Grid>
                ) : (
                  <InventorySliders
                    labels={labels}
                    thresholdValues={currentConfig}
                  />
                )}
              </Grid>

              {isLoadingPlanogramsForConfig(loading, currentLoadingType) ? (
                <Grid item xs={12} className={classes.inventorySpinner}>
                  <CircularProgress
                    color="secondary"
                    className={classes.spinner}
                    size={50}
                  />
                </Grid>
              ) : (
                <Fragment>
                  <CardContainer labels={labelforCardContainer} />
                  <ButtonContainer labels={labelforCardContainer} />
                </Fragment>
              )}
            </Fragment>
          )}
        {currentSubActivityType === subActivityType.EDIT_CONFIGURATION && (
          <EditCardContainer />
        )}
      </Fragment>
    );
  }
);

ConfigureContainer.propTypes = {
  labels: PropTypes.object.isRequired,
  storeConfigs: PropTypes.array
};

ConfigureContainer.defaultProps = {
  data: {}
};

const HandlerWrapperConfigureContainer = withErrorHandler(
  ConfigureContainer,
  axios
);

export default HandlerWrapperConfigureContainer;

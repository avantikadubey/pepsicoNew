/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import ConfigureContainer from '../configure-container/configure-container';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import UploadFileContainer from '../upload-file-container/upload-file-container';
import SimulatorContainer from '../simulator-container/simulator-container';
import BackStockContainer from '../back-stock-container/back-stock-container';
import ComparisonContainer from '../comparison-container/comparison-container';
import HandleTemplateContainer from '../handle-template-container/handle-template-container';
import { isLoadingConfigurationsForStore } from '../../@planogram/store/state/utility';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import axios from '../../shared/axios-planogram';

const useStyles = makeStyles((theme) =>
  createStyles({
    spinner: {
      color: theme.palette.secondary.main
    },
    configureSpinner: {
      marginTop: '7vh',
      marginLeft: '10vw'
    }
  })
);
const TabSelector = React.memo(({ labels, value }) => {
  const classes = useStyles();
  const selectedTabValue = {
    configure: 0,
    upload: 1,
    backStock: 2,
    simulate: 3,
    comparison:4,
    template:5
  };
  const loading = useSelector(({ pog }) => pog.loading);
  const currentLoadingType = useSelector(({ pog }) => pog.loadingType);
  const dispatch = useDispatch();

  // Load the planograms and allocation when there is a change
  function handleChange(id) {
    dispatch(actions.loadPlanogramsForConfiguration(id));
  }
  return (
    <>
      {value === selectedTabValue.configure && (
        <Fragment>
          {isLoadingConfigurationsForStore(loading, currentLoadingType) ? (
            <div className={classes.configureSpinner}>
              <CircularProgress color="secondary" className={classes.spinner} size={50} />
            </div>
          ) : (
            <ConfigureContainer
              labels={labels[value].labels.inventoryContainer}
              configCallback={handleChange}
              labelforCardContainer={labels[value].labels.mediaCardContainer}
            />
          )}
        </Fragment>
      )}
      {value === selectedTabValue.simulate && <SimulatorContainer />}
      {value === selectedTabValue.upload && <UploadFileContainer />}
      {value === selectedTabValue.backStock && <BackStockContainer />}
      {value === selectedTabValue.comparison && <ComparisonContainer />}
      {value === selectedTabValue.template && <HandleTemplateContainer />}
    </>
  );
});

TabSelector.propTypes = {
  labels: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired
};

const HandlerWrapperTabSelector = withErrorHandler(TabSelector,axios);

export default HandlerWrapperTabSelector;
/* eslint-disable react/forbid-prop-types */
import React, { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../@planogram/store/state/actions';
import withErrorHandler from '../hoc/with-error-handler/with-error-handler';
import axios from '../../shared/axios-planogram';
import * as _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const StoreSelector = React.memo(({ labels, classes }) => {
  const { headerLabels } = labels;
  const [storeCSID, setStoreCSID] = useState([]);
  const [newValue, setNewValue] = useState(null);
  const chains = useSelector(({ pog }) => pog.chains);
  const dispatch = useDispatch();
  const uniqueChain = _.uniqBy(chains, 'chId');
  const chainDropDown=(e,value)=>{
    setNewValue(null);
    if(value) {
      dispatch(
        actions.selectChain({
          id: value.chId,
          name: value.chName
        })
      );
     const allStores = _.filter(chains, function(c) {
        return c.chId === value.chId;
      });
      const uniqueStore = _.uniqBy(allStores, 'csId');
      setStoreCSID(uniqueStore);
      dispatch(actions.clearSelections());
    }
  }

  const storeDropDown = (e,value)=>{
    if(value) {
      dispatch(
        actions.selectStore({
          id: value.csId,
          name: value.csName
        })
      );
      setNewValue(value);
      dispatch(actions.loadConfigurationsForStore(value.csId));
      dispatch(actions.loadPlanogramsForConfiguration(value.csId));
      dispatch(actions.setCurrentConfigurationLowInventory({lowInventory: 0}));
      dispatch(actions.setCurrentConfigurationOOSInventory({outOfStock: 0}));
      dispatch(actions.loadProductsForSearch(value.csId));
      dispatch(actions.loadProductsForBackStock(value.csId));
      dispatch(actions.loadSimulationConfiguartion(value.csId));
      dispatch(actions.loadUploadedFileStatus());
      dispatch(actions.getTemplateName({mode:'templateMode'}));
    }
  }
  
  return (
    <Fragment>
      <Autocomplete 
        id="chain-dropdown"
        options={uniqueChain}
        getOptionLabel={option => option.chName}
        onChange={chainDropDown}
        disableClearable
        renderInput={params => (
          <TextField {...params} label={headerLabels.storeNameLabel} variant="outlined" fullWidth className={classes.dropDown}
          InputProps={{
            ...params.InputProps,
            classes: {
              notchedOutline: classes.notchedOutline
            }
          }} />
        )}
      />
      
      <Autocomplete 
        id="store-dropdown"
        options={storeCSID}
        getOptionLabel={option => (`(${option.csName} #${option.csId}) ${option.address}`)}
        onChange={storeDropDown}
        disableClearable
        value={newValue}
        disableOpenOnFocus
        disabled={storeCSID.length === 0}
        renderInput={params => (
          <TextField {...params} label={headerLabels.storeNumberLabel} variant="outlined" fullWidth
          className={classes.dropDown}
          InputProps={{
            ...params.InputProps,
            classes: {
              notchedOutline: classes.notchedOutline
            }
          }} />
        )}
      />
    </Fragment>
  );
});

const HandlerWrapperStoreSelector = withErrorHandler(StoreSelector,axios);

export default withStyles(() => ({
  dropDown: {
    '& > div':{
      paddingRight:'32px !important'
    }
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: '#000'
  }
}))(HandlerWrapperStoreSelector);
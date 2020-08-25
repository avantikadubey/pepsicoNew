import { put, call } from 'redux-saga/effects';
import axios from '../../../../shared/axios-planogram';
import * as actions from '../actions';
import * as _ from 'lodash';
import runSimulationJson from '../../../../../data/simulation-run-response.json';
import { getRenderingPosData } from '@planogram/design-system';

const mockAPIs = process.env.MOCK_APIS || 'false';

/* export function* selectPlanogramForEdit(id) {
  yield put(actions.selectPlanogram(id));
} */

export function* setPosForPlanogram(action) {
  const { configId, pogId } = action.data;
  yield put(actions.startSettingPosForPlanogram());
  const response = yield axios.get('/positions', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      configId: configId,
      pogId: pogId
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.setPosForPlanogramSuccess(result[0].positions));
    yield put(actions.startFlatteningPosForPlangram());
    const positions = yield call(
      getRenderingPosData,
      true,
      result[0].positions
    );
    yield put(actions.flatteningPosForPlanogramSuccess(positions));
  } catch (err) {
    yield put(actions.setPosForPlanogramFailure(err));
  }
}

export function* loadPlanogramsForConfiguration(action) {
  const { id } = action;
  yield put(actions.startLoadingPlanogramForConfiguration());
  const response = yield axios.get('/pogs', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      configId: id
    }
  });
  try {
    const pogs = [];
    let result = getResponse(response);
    pogs.push(result);
    yield put(actions.loadPlanogramForConfigurationSuccess(pogs));
  } catch (err) {
    yield put(actions.loadPlanogramForConfigurationFailure(err));
  }
}

export function* loadChainsAndStores(action) {
  yield put(actions.startLoadingChainsAndStores());
  const response = yield axios.get('/stores');
  try {
    const chains = [];
    let result = getResponse(response);
    for (let key in result) {
      chains.push({
        ...result[key],
        id: key
      });
    }
    yield put(actions.loadChainsAndStoresSuccess(chains));
  } catch (err) {
    yield put(actions.loadChainsAndStoresFailure(err));
  }
}

/**
 * Load the Configurations for a given store
 * And set the default config if present
 * @param {*} action
 */
export function* loadConfigurationsForStore(action) {
  const { id } = action;
  yield put(actions.startLoadingConfigurationsForStore());
  const response = yield axios.get('/configs', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      csId: id
    }
  });
  try {
    const configurations = [];
    let result = getResponse(response);
    for (let key in result) {
      configurations.push({
        ...result[key],
        id: key
      });
    }
    yield put(actions.loadConfigurationsForStoreSuccess(configurations));
    const defaultConfiguration = configurations.find(
      (config) => config.configName.toLowerCase() === 'default'
    );

    if (typeof defaultConfiguration !== 'undefined') {
      yield put(actions.setCurrentConfigurationInventory(defaultConfiguration));
      yield put(
        actions.loadPlanogramsForConfiguration(defaultConfiguration.configId)
      );
    }
  } catch (err) {
    yield put(actions.loadConfigurationsForStoreFailure(err));
  }
}

// save file upload
export function* saveUploadFile(action) {
  const obj = action.file;
  const response = yield axios.post('/upload', obj);
  try {
    let result = getResponse(response);
    yield put(actions.saveUploadFileSuccess(result));
    yield put(actions.loadUploadedFileStatus());
  } catch (err) {
    yield put(actions.saveUploadFileFailure(err));
  }
}

// delete current configuration
export function* deleteCurrentConfiguration(action) {
  const id = action.data.configId;
  const response = yield axios.delete('/configs', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      configId: id
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.deleteCurrentConfigurationSuccess(result));
    yield put(actions.loadConfigurationsForStore(action.data.storeId));
  } catch (err) {
    yield put(actions.deleteCurrentConfigurationFailure(err));
  }
}

//search products
export function* loadProductsForSearch(action) {
  const { id } = action;
  yield put(actions.startLoadingProductsForSearch());
  const response = yield axios.get('/search', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      csId: id
    }
  });
  try {
    const searchData = [];
    let result = getResponse(response);
    for (let key in result) {
      searchData.push({
        ...result[key],
        id: key
      });
    }
    yield put(actions.loadProductsForSearchSuccess(searchData));
  } catch (err) {
    yield put(actions.loadProductsForSearchFailure(err));
  }
}

// Save current Configuration
export function* saveCurrentConfiguration(action) {
  const obj = action.data;
  yield put(actions.saveCurrentConfigurationStart());
  yield axios.put('/configs', obj);
  try {
    yield put(actions.saveCurrentConfigurationSuccess(obj));
    yield put(actions.loadPlanogramsForConfiguration(obj.configId));
  } catch (err) {
    yield put(actions.saveCurrentConfigurationFailure(err));
  }
}

// Save As New Configuration
export function* saveAsNewConfiguration(action) {
  const obj = action.data;
  yield put(actions.saveAsCurrentConfigurationStart());
  const response = yield axios.post('/configs', obj);
  try {
    let result = getResponse(response);
    yield put(actions.saveAsCurrentConfigurationSuccess(result));
    yield put(actions.loadConfigurationsForStore(action.data.csId));
  } catch (err) {
    yield put(actions.saveAsCurrentConfigurationFailure(err));
  }
}

// Save As Template
export function* saveAsTemplate(action) {
  const obj = action.data;
  yield put(actions.saveAsTemplateStart());
  const response = yield axios.post('/templates', obj);
  try {
    let result = getResponse(response);
    yield put(actions.saveAsTemplateSuccess(result));
  } catch (err) {
    yield put(actions.saveAsTemplateFailure(err));
  }
}

// Get Template Name

export function* getTemplateName(action) {
  const { data } = action;
  let params = data && data.mode === "editMode" ? {tmplName: data.templateName} : '' ;
  yield put(actions.getTemplateNameStart());
  const response = yield axios.get('/templates', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: params
  });
  try {
    let result = getResponse(response);
    yield put(actions.getTemplateNameSuccess(result));
  } catch (err) {
    yield put(actions.getTemplateNameFailure(err));
  }
}

// Save Planogram
export function* savePlanogramForPos(action) {
  const obj = action.data;
  yield put(actions.savePlanogramForPosStart());
  const response = yield axios.put('/positions', obj);
  try {
    let result = getResponse(response);
    yield put(actions.savePlanogramForPosSuccess(result));
  } catch (err) {
    yield put(actions.savePlanogramForPosFailure(err));
  }
}

//get products for back stock
export function* loadProductsForBackStock(action) {
  const { id } = action;
  yield put(actions.startLoadingProductsForBackStock());
  const response = yield axios.get('/backstock', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      csId: id
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.loadProductsForBackStockSuccess(result));
  } catch (err) {
    yield put(actions.loadProductsForBackStockFailure(err));
  }
}

// update products for back stock
export function* updateProductsForBackStock(action) {
  const obj = action.data;
  yield put(actions.startUpdatingProductsForBackStock());
  const response = yield axios.put('/backstock', obj);
  try {
    let result = getResponse(response);
    yield put(actions.updateProductsForBackStockSuccess(result));
  } catch (err) {
    yield put(actions.updateProductsForBackStockFailure(err));
  }
}

const getResponse = (response) => {
  if (mockAPIs !== 'true') {
    // API is returning the response inside the "data" attribute
    // hence we need to add a further indirection
    return response.data.data;
  }
  return response.data;
};

//get simulation configuration
export function* loadSimulationConfiguartion(action) {
  const { id } = action;
  yield put(actions.startLoadingSimulationConfiguartion());
  const response = yield axios.get('/simconfig', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      csId: id
    }
  });
  try {
    //const backStockData = [];
    let result = getResponse(response);
    yield put(actions.loadSimulationConfiguartionSuccess(result));
  } catch (err) {
    yield put(actions.loadSimulationConfiguartionFailure(err));
  }
}

// Save simulation Configuration
export function* saveSimulationConfiguration(action) {
  const obj = action.data;
  yield put(actions.saveSimulationConfigurationStart());
  const response = yield axios.post('/simconfig', obj);
  try {
    let result = getResponse(response);
    yield put(actions.saveSimulationConfigurationSuccess(result));
    yield put(actions.loadSimulationConfiguartion(obj.csId));
  } catch (err) {
    yield put(actions.saveSimulationConfigurationFailure(err));
  }
}

// run simulation
export function* runSimulation(action) {
  const obj = action.data;
  yield put(actions.runSimulationStart());
  const response = yield axios.post('/simulation', obj);
  try {
    let result = getResponse(response);
    let date = [];
    const simulationDate = _.sortBy(
      _.uniq(_.map(result.displayOutput, 'simulationDate'))
    );
    _.forEach(simulationDate, function(value) {
      date.push(value);
    });
    yield put(actions.runSimulationSuccess(result));
    yield put(actions.setInititalDate(date));
  } catch (err) {
    yield put(actions.runSimulationFailure(err));
  }
}

// delete current configuration
export function* deleteSimulationConfiguration(action) {
  const id = action.data.simConfigId;
  yield put(actions.deleteSimulationConfigurationStart());
  const response = yield axios.delete('/simconfig', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      id: id
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.deleteSimulationConfigurationSuccess(result));
    yield put(actions.loadSimulationConfiguartion(action.data.csId));
  } catch (err) {
    yield put(actions.deleteSimulationConfigurationFailure(err));
  }
}

//get data uploaded table status
export function* loadUploadedFileStatus(action) {
  yield put(actions.loadUploadedFileStatusStart());
  const response = yield axios.get('/uploadStatus', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.loadUploadedFileStatusSuccess(result));
  } catch (err) {
    yield put(actions.loadUploadedFileStatusFailure(err));
  }
}


// delete selected template
export function* deleteSelectedTemplate(action) {
  const id = action.data.templateId;
  yield put(actions.deleteSelectedTemplateStart());
  const response = yield axios.delete('/templates', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    params: {
      tmplId: id
    }
  });
  try {
    let result = getResponse(response);
    yield put(actions.deleteSelectedTemplateSuccess(result));
    yield put(actions.getTemplateName({mode:'templateMode'}));
  } catch (err) {
    yield put(actions.deleteSelectedTemplateFailure(err));
  }
}

// save associate template
export function* saveAssociateTemplate(action) {
  console.log('saga', action);
  let obj = action.data ;
  yield put(actions.saveAssociateTemplateStart());
  const response = yield axios.post('/associate', obj);
  try {
    let result = getResponse(response);
    yield put(actions.saveAssociateTemplateSuccess(result));
    yield put(actions.getTemplateName({mode:'templateMode'}));
  } catch (err) {
    yield put(actions.saveAssociateTemplateFailure(err));
  }
}

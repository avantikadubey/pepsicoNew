import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import * as actionTypes from '../actions/action-types';

import { incrementSaga, decrementSaga } from './count';
import {
  loadPlanogramsForConfiguration,
  loadChainsAndStores,
  loadConfigurationsForStore,
  saveUploadFile,
  setPosForPlanogram,
  loadProductsForSearch,
  deleteCurrentConfiguration,
  saveAsTemplate,
  getTemplateName,
  savePlanogramForPos,
  saveAsNewConfiguration,
  saveCurrentConfiguration,
  loadProductsForBackStock,
  updateProductsForBackStock,
  loadSimulationConfiguartion,
  runSimulation,
  saveSimulationConfiguration,
  deleteSimulationConfiguration,
  loadUploadedFileStatus,
  deleteSelectedTemplate,
  saveAssociateTemplate
} from './pog';

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchCounter() {
  yield all([
    takeEvery(actionTypes.INCREMENT_ASYNC, incrementSaga),
    takeEvery(actionTypes.DECREMENT_ASYNC, decrementSaga)
  ]);
}

export function* watchPog() {
  yield takeLatest(actionTypes.SET_POS_FOR_PLANOGRAM_ASYNC, setPosForPlanogram);
  yield takeLatest(
    actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_ASYNC,
    loadPlanogramsForConfiguration
  );
  yield takeLatest(
    actionTypes.LOAD_CHAINS_AND_STORES_ASYNC,
    loadChainsAndStores
  );
  yield takeLatest(
    actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_ASYNC,
    loadConfigurationsForStore
  );
  yield takeLatest(
    actionTypes.LOAD_PRODUCTS_FOR_SEARCH_ASYNC,
    loadProductsForSearch
  );
  yield takeLatest(actionTypes.FILE_UPLOAD_START_ASYNC, saveUploadFile);
  yield takeLatest(
    actionTypes.DELETE_CURRENT_CONFIGURATION_ASYNC,
    deleteCurrentConfiguration
  );
  yield takeLatest(
    actionTypes.SAVE_AS_CURRENT_CONFIGURATION_ASYNC,
    saveAsNewConfiguration
  );
  yield takeLatest(
    actionTypes.SAVE_CURRENT_CONFIGURATION_ASYNC,
    saveCurrentConfiguration
  );
  yield takeLatest(
    actionTypes.SAVE_AS_TEMPLATE_ASYNC, 
    saveAsTemplate
  );
  yield takeLatest(
    actionTypes.GET_TEMPLATE_NAME_ASYNC,
    getTemplateName
  );
  yield takeLatest(
    actionTypes.SAVE_PLANOGRAM_FOR_POS_ASYNC,
    savePlanogramForPos
  );
  yield takeLatest(
    actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_ASYNC,
    loadProductsForBackStock
  );
  yield takeLatest(
    actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_ASYNC,
    updateProductsForBackStock
  );
  yield takeLatest(
    actionTypes.LOAD_SIMULATION_CONFIG_ASYNC,
    loadSimulationConfiguartion
  );
  yield takeLatest(
    actionTypes.RUN_SIMULATION_ASYNC,
    runSimulation
  );
  yield takeLatest(
    actionTypes.SAVE_SIMULATION_CONFIGURATION_ASYNC,
    saveSimulationConfiguration
  );
  yield takeLatest(
    actionTypes.DELETE_SIMULATION_CONFIGURATION_ASYNC,
    deleteSimulationConfiguration
  );
  yield takeLatest(
    actionTypes.LOAD_UPLOADED_FILE_STATUS_ASYNC,
    loadUploadedFileStatus
  );
  yield takeLatest(
    actionTypes.DELETE_SELECTED_TEMPLATE_ASYNC,
    deleteSelectedTemplate
  );
  yield takeLatest(
    actionTypes.SAVE_ASSOCIATE_TEMPLATE_ASYNC,
    saveAssociateTemplate
  );
}

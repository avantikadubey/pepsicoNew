import * as actionTypes from './action-types';

// Load POS for Planogram
export const loadPosForPlanogram = (id) => {
  // console.log(id);
  return {
    type: actionTypes.LOAD_POS_FOR_PLANOGRAM_ASYNC,
    id
  };
};

export const startFlatteningPosForPlangram = () => {
  return {
    type: actionTypes.FLATTEN_POS_FOR_PLANOGRAM_START
  };
};

export const flatteningPosForPlanogramSuccess = (data) => {
  return {
    type: actionTypes.FLATTEN_POS_FOR_PLANOGRAM_SUCCESS,
    error: null,
    data
  };
};

export const flatteningPosForPlanogramFailure = (error) => {
  return {
    type: actionTypes.FLATTEN_POS_FOR_PLANOGRAM_FAILURE,
    error
  };
};

// Set POS for Planogram
export const setPosForPlanogram = (data) => {
  return {
    type: actionTypes.SET_POS_FOR_PLANOGRAM_ASYNC,
    data
  };
};

export const setZoomForPlanogram = (data) => {
  return {
    type: actionTypes.SET_ZOOM_FOR_PLANOGRAM,
    data
  };
};

// Set POS for Planogram
export const flattenPosForPlanogram = () => {
  return {
    type: actionTypes.FLATTEN_POS_FOR_PLANOGRAM
  };
};

export const startSettingPosForPlanogram = () => {
  return {
    type: actionTypes.SET_POS_FOR_PLANOGRAM_START
  };
};

export const setPosForPlanogramSuccess = (data) => {
  return {
    type: actionTypes.SET_POS_FOR_PLANOGRAM_SUCCESS,
    error: null,
    data
  };
};

export const setPosForPlanogramFailure = (error) => {
  return {
    type: actionTypes.SET_POS_FOR_PLANOGRAM_FAILURE,
    error
  };
};

// Load Planogram Types
export const loadPlanogramsForConfiguration = (id) => {
  return {
    type: actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_ASYNC,
    id
  };
};

export const startLoadingPlanogramForConfiguration = () => {
  return {
    type: actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_START
  };
};

export const loadPlanogramForConfigurationSuccess = (data) => {
  return {
    type: actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_SUCCESS,
    error: null,
    data
  };
};

export const loadPlanogramForConfigurationFailure = (error) => {
  return {
    type: actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_FAILURE,
    error
  };
};

// Load all Chains and Stores
export const loadChainsAndStores = () => {
  return {
    type: actionTypes.LOAD_CHAINS_AND_STORES_ASYNC
  };
};

export const startLoadingChainsAndStores = () => {
  return {
    type: actionTypes.LOAD_CHAINS_AND_STORES_START
  };
};

export const loadChainsAndStoresSuccess = (data) => {
  return {
    type: actionTypes.LOAD_CHAINS_AND_STORES_SUCCESS,
    error: null,
    data
  };
};

export const loadChainsAndStoresFailure = (error) => {
  return {
    type: actionTypes.LOAD_CHAINS_AND_STORES_FAILURE,
    error
  };
};

// Select Chain
export const selectChain = (data) => {
  return {
    type: actionTypes.SELECT_CHAIN,
    data
  };
};

// Select Store
export const selectStore = (data) => {
  return {
    type: actionTypes.SELECT_STORE,
    data
  };
};

// Clear all Selections

export const clearSelections = () => {
  return {
    type: actionTypes.CLEAR_SELECTIONS
  };
};

// Select Planogram
export const selectPlanogram = (data) => {
  return {
    type: actionTypes.SELECT_PLANOGRAM,
    data
  };
};

// Clear Selected Planogram
export const clearSelectedPlanogram = () => {
  return {
    type: actionTypes.CLEAR_SELECTED_PLANOGRAM
  };
};

// Select Tab for Simulation
export const selectSimulationViewTab = (data) => {
  return {
    type: actionTypes.SELECT_TAB_SIMULATION,
    data
  };
};

// Clear Tab for Simulation
export const clearSimulationViewTab = () => {
  return {
    type: actionTypes.CLEAR_TAB_SIMULATION_VIEW
  };
};

// Clear Tab for Simulation
export const clearSimulationTab = () => {
  return {
    type: actionTypes.CLEAR_TAB_SIMULATION
  };
};

// Load Configuration
export const loadConfigurationsForStore = (id) => {
  return {
    type: actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_ASYNC,
    id
  };
};

export const startLoadingConfigurationsForStore = () => {
  return {
    type: actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_START
  };
};

export const loadConfigurationsForStoreSuccess = (data) => {
  return {
    type: actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_SUCCESS,
    error: null,
    data
  };
};

export const loadConfigurationsForStoreFailure = (error) => {
  return {
    type: actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_FAILURE,
    error
  };
};

// Set Product Images
export const setProductImages = (data) => {
  return {
    type: actionTypes.SET_PRODUCT_IMAGES,
    data
  };
};

// Set Activity
export const setCurrentActivityType = (data) => {
  return {
    type: actionTypes.SET_CURRENT_ACTIVITY_TYPE,
    data
  };
};

// Set Activity
export const setCurrentSubActivityType = (data) => {
  return {
    type: actionTypes.SET_CURRENT_SUB_ACTIVITY_TYPE,
    data
  };
};

// Select Configuration
export const selectCurrentConfiguration = (id) => {
  return {
    type: actionTypes.SELECT_CURRENT_CONFIGURATION,
    id
  };
};

// Set Inventory
export const setCurrentConfigurationInventory = (data) => {
  return {
    type: actionTypes.SET_CURRENT_CONFIGURATION_INVENTORY,
    data
  };
};

// Set Inventory
export const setCurrentConfigurationLowInventory = (data) => {
  return {
    type: actionTypes.SET_CURRENT_CONFIGURATION_LOW_INVENTORY,
    data
  };
};

// Set Inventory
export const setCurrentConfigurationOOSInventory = (data) => {
  return {
    type: actionTypes.SET_CURRENT_CONFIGURATION_OOS_INVENTORY,
    data
  };
};

// Set Service Config
export const setServicesConfig = (data) => {
  return {
    type: actionTypes.SELECT_SERVICE_CONFIG,
    data
  };
};

// Set Comparison data
export const setComparisonData = (data) => {
  return {
    type: actionTypes.SET_COMPARISON_DATA,
    data
  };
};

// Set Planogram Sales Allocation
export const setPlanogramSalesAllocation = (data) => {
  return {
    type: actionTypes.SET_CURRENT_CONFIGURATION_PLANOGRAM_SALES_ALLOCATION,
    data
  };
};

// Set Planogram Sales Allocation
export const setSelectedDate = (data) => {
  return {
    type: actionTypes.SELECT_DATE,
    data
  };
};

// Set new configuration
// export const setNewConfiguration = (data) => {
//     console.log('action:',data);
//   return {
//     type: actionTypes.SET_NEW_CONFIGURATION,
//     data
//   };
// };

// Set Save Configuration
export const saveCurrentConfiguration = (data) => {
  return {
    type: actionTypes.SAVE_CURRENT_CONFIGURATION_ASYNC,
    data
  };
};

export const saveCurrentConfigurationStart = () => {
  return {
    type: actionTypes.SAVE_CURRENT_CONFIGURATION_START
  };
};

export const saveCurrentConfigurationSuccess = (data) => {
  return {
    type: actionTypes.SAVE_CURRENT_CONFIGURATION_SUCCESS,
    data
  };
};

export const saveCurrentConfigurationFailure = (error) => {
  return {
    type: actionTypes.SAVE_CURRENT_CONFIGURATION_FAILURE,
    error
  };
};

// Set Save As Configuration
export const saveAsCurrentConfiguration = (data) => {
  return {
    type: actionTypes.SAVE_AS_CURRENT_CONFIGURATION_ASYNC,
    data
  };
};

export const saveAsCurrentConfigurationStart = () => {
  return {
    type: actionTypes.SAVE_AS_CURRENT_CONFIGURATION_START
  };
};

export const saveAsCurrentConfigurationSuccess = (data) => {
  return {
    type: actionTypes.SAVE_AS_CURRENT_CONFIGURATION_SUCCESS,
    data
  };
};

export const saveAsCurrentConfigurationFailure = (error) => {
  return {
    type: actionTypes.SAVE_AS_CURRENT_CONFIGURATION_FAILURE,
    error
  };
};

// Delete Current Configuration
export const deleteCurrentConfiguration = (data) => {
  return {
    type: actionTypes.DELETE_CURRENT_CONFIGURATION_ASYNC,
    data
  };
};

export const deleteCurrentConfigurationSuccess = (data) => {
  return {
    type: actionTypes.DELETE_CURRENT_CONFIGURATION_SUCCESS,
    data
  };
};

export const deleteCurrentConfigurationFailure = (error) => {
  return {
    type: actionTypes.DELETE_CURRENT_CONFIGURATION_FAILURE,
    error
  };
};

// Save  uploaded file
export const saveUploadFile = (file) => {
  return {
    type: actionTypes.FILE_UPLOAD_START,
    file
  };
};

export const saveUploadFileSuccess = (data) => {
  return {
    type: actionTypes.FILE_UPLOAD_SUCCESS,
    error: null,
    data
  };
};

export const saveUploadFileFailure = (error) => {
  return {
    type: actionTypes.FILE_UPLOAD_FAILURE,
    error
  };
};

export const uploadedFileSuccess = (data) => {
  return {
    type: actionTypes.SET_UPLOADED_FILE_SUCCESS,
    error: null,
    data
  };
};

export const uploadedFileFailure = (error) => {
  return {
    type: actionTypes.SET_UPLOADED_FILE_FAILURE,
    error
  };
};

//set edit mode for planogram
export const setEditModeForPlanogram = (data) => {
  return {
    type: actionTypes.SET_EDIT_MODE_FOR_PLANOGRAMS,
    data
  };
};

//set selected position of planogram
export const setSelectedPlanogramPosition = (data) => {
  return {
    type: actionTypes.SET_SELECTED_PLANOGRAM_POSITION,
    data
  };
};

// replace planogram product at position
// provide X, Y, upc, BDC
export const replacePlanogramPosition = (data) => {
  return {
    type: actionTypes.REPLACE_PLANOGRAM_POSITION,
    data
  };
};

// update the available qty for position
export const updatePlanogramPositionAvailableQty = (data) => {
  return {
    type: actionTypes.UPDATE_PLANOGRAM_POSITION_AVAILABLE_QTY,
    data
  };
};

// update the units for a position
export const updatePlanogramPositionUnits = (data) => {
  return {
    type: actionTypes.UPDATE_PLANOGRAM_POSITION_UNITS,
    data
  };
};

//set selected position of planogram
export const unSelectPlanogramPosition = () => {
  return {
    type: actionTypes.UNSELECT_PLANOGRAM_POSITION
  };
};

// search products
export const loadProductsForSearch = (id) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_SEARCH_ASYNC,
    id
  };
};

export const startLoadingProductsForSearch = () => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_SEARCH_START
  };
};

export const loadProductsForSearchSuccess = (data) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_SEARCH_SUCCESS,
    error: null,
    data
  };
};

export const loadProductsForSearchFailure = (error) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_SEARCH_FAILURE,
    error
  };
};

// Get Template Name Types
export const getTemplateName = (data) => {
  return {
    type: actionTypes.GET_TEMPLATE_NAME_ASYNC,
    data
  };
};

export const getTemplateNameStart = () => {
  return {
    type: actionTypes.GET_TEMPLATE_NAME_START
  };
};

export const getTemplateNameSuccess = (data) => {
  return {
    type: actionTypes.GET_TEMPLATE_NAME_SUCCESS,
    error: null,
    data
  };
};

export const getTemplateNameFailure = (error) => {
  return {
    type: actionTypes.GET_TEMPLATE_NAME_FAILURE,
    error
  };
};

// Save As Template Types
export const saveAsTemplate = (data) => {
  return {
    type: actionTypes.SAVE_AS_TEMPLATE_ASYNC,
    data
  };
};

export const saveAsTemplateStart = () => {
  return {
    type: actionTypes.SAVE_AS_TEMPLATE_START
  };
};

export const saveAsTemplateSuccess = (data) => {
  return {
    type: actionTypes.SAVE_AS_TEMPLATE_SUCCESS,
    error: null,
    data
  };
};

export const saveAsTemplateFailure = (error) => {
  return {
    type: actionTypes.SAVE_AS_TEMPLATE_FAILURE,
    error
  };
};

// Clear Template
export const clearTemplate = () => {
  return {
    type: actionTypes.CLEAR_TEMPLATE
  };
};

// Save Planogram
export const savePlanogramForPos = (data) => {
  return {
    type: actionTypes.SAVE_PLANOGRAM_FOR_POS_ASYNC,
    data
  };
};

export const savePlanogramForPosStart = () => {
  return {
    type: actionTypes.SAVE_PLANOGRAM_FOR_POS_START
  };
};

export const savePlanogramForPosSuccess = (data) => {
  return {
    type: actionTypes.SAVE_PLANOGRAM_FOR_POS_SUCCESS,
    error: null,
    data
  };
};

export const savePlanogramForPosFailure = (error) => {
  return {
    type: actionTypes.SAVE_PLANOGRAM_FOR_POS_FAILURE,
    error
  };
};

// Clear Template
export const clearPlanogramForPos = () => {
  return {
    type: actionTypes.CLEAR_PLANOGRAM_FOR_POS
  };
};

// get products for back stock
export const loadProductsForBackStock = (id) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_ASYNC,
    id
  };
};

export const startLoadingProductsForBackStock = () => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_START
  };
};

export const loadProductsForBackStockSuccess = (data) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_SUCCESS,
    error: null,
    data
  };
};

export const loadProductsForBackStockFailure = (error) => {
  return {
    type: actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_FAILURE,
    error
  };
};

// update products for back stock
export const updateProductsForBackStock = (data) => {
  return {
    type: actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_ASYNC,
    data
  };
};

export const startUpdatingProductsForBackStock = () => {
  return {
    type: actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_START
  };
};

export const updateProductsForBackStockSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_SUCCESS,
    error: null,
    data
  };
};

export const updateProductsForBackStockFailure = (error) => {
  return {
    type: actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_FAILURE,
    error
  };
};

// update product back stock quantity
export const updateProductBackStockQuantity = (data) => {
  return {
    type: actionTypes.UPDATE_PRODUCT_BACK_STOCK_QUANTITY,
    data
  };
};

// Clear Product Back Stock Quantity
export const clearProductBackStockQuantity = () => {
  return {
    type: actionTypes.CLEAR_PRODUCT_BACKSTOCK_QUANTITY
  };
};

// set Notification
export const setNotification = (data) => {
  return {
    type: actionTypes.SET_NOTIFICATION,
    data
  };
};

// Load Simulation Configuration
export const loadSimulationConfiguartion = (id) => {
  return {
    type: actionTypes.LOAD_SIMULATION_CONFIG_ASYNC,
    id
  };
};

export const startLoadingSimulationConfiguartion = () => {
  return {
    type: actionTypes.LOAD_SIMULATION_CONFIG_START
  };
};

export const loadSimulationConfiguartionSuccess = (data) => {
  return {
    type: actionTypes.LOAD_SIMULATION_CONFIG_SUCCESS,
    error: null,
    data
  };
};

export const loadSimulationConfiguartionFailure = (error) => {
  return {
    type: actionTypes.LOAD_SIMULATION_CONFIG_FAILURE,
    error
  };
};

// Select simulate Config
export const selectSimulationConfig = (data) => {
  return {
    type: actionTypes.SELECT_SIMULATION_CONFIG,
    data
  };
};

// Select simulate Store Config
export const selectSimulationStoreConfig = (data) => {
  return {
    type: actionTypes.SELECT_SIMULATION_STORE_CONFIG,
    data
  };
};

// Select simulate Sale Source
export const selectSimulationSaleSource = (data) => {
  return {
    type: actionTypes.SELECT_SIMULATION_SALES_SOURCE,
    data
  };
};

// Set calendar value
export const setCalendarValue = (data) => {
  return {
    type: actionTypes.SET_CALENDAR_VALUE,
    data
  };
};

// Set Save Simulation Configuration
export const saveSimulationConfiguration = (data) => {
  return {
    type: actionTypes.SAVE_SIMULATION_CONFIGURATION_ASYNC,
    data
  };
};

export const saveSimulationConfigurationStart = () => {
  return {
    type: actionTypes.SAVE_SIMULATION_CONFIGURATION_START
  };
};

export const saveSimulationConfigurationSuccess = (data) => {
  return {
    type: actionTypes.SAVE_SIMULATION_CONFIGURATION_SUCCESS,
    data
  };
};

export const saveSimulationConfigurationFailure = (error) => {
  return {
    type: actionTypes.SAVE_SIMULATION_CONFIGURATION_FAILURE,
    error
  };
};

// Set RUn Simulation
export const runSimulation = (data) => {
  return {
    type: actionTypes.RUN_SIMULATION_ASYNC,
    data
  };
};

export const runSimulationStart = () => {
  return {
    type: actionTypes.RUN_SIMULATION_START
  };
};

export const runSimulationSuccess = (data) => {
  return {
    type: actionTypes.RUN_SIMULATION_SUCCESS,
    data
  };
};

export const runSimulationFailure = (error) => {
  return {
    type: actionTypes.RUN_SIMULATION_FAILURE,
    error
  };
};

// Set simulation view
export const setSimulationView = (data) => {
  return {
    type: actionTypes.SET_SIMULATION_VIEW,
    data
  };
};

//simulationDataTransform
export const simulationDataTransform = (data) => {
  return {
    type: actionTypes.RUN_SIMULATION_DATA_TRANSFORM,
    data
  };
};

// Calculate toatl inventory
export const calculateTotalInventory = (data) => {
  return {
    type: actionTypes.CALCULATE_TOTAL_INVENTORY,
    data
  };
};


// Set filterBy dropdown
export const setFilterByDropdown = (data) => {
  return {
    type: actionTypes.SET_FILTERBY_DROPDOWN,
    data
  };
};

// Set sortBy dropdown
export const setSortByDropdown = (data) => {
  return {
    type: actionTypes.SET_SORTBY_DROPDOWN,
    data
  };
};

// Set compareBy dropdown
export const setCompareByDropdown = (data) => {
  return {
    type: actionTypes.SET_COMPAREBY_DROPDOWN,
    data
  };
};

// Set comparison filter data
export const setComparisonFilterData = (data) => {
  return {
    type: actionTypes.SET_COMPARISON_SINGLE_FILE_FILTER_DATA,
    data
  };
};


// Set comparison table view
export const setComparisonTable = (data) => {
  return {
    type: actionTypes.SET_COMPARISON_TABLE,
    data
  };
};


//Set the transform data for table
export const setTransformDataForTable = (data) => {
  return {
    type: actionTypes.SET_TRANSFORM_DATA_FOR_TABLE,
    data
  };
};
//Set the transform data for table
export const setSearchResultForTable = (data) => {
  return {
    type: actionTypes.SET_SEARCH_RESULT_FOR_TABLE,
    data
  };
};


// Set initial data
export const setInititalDate = (data) => {
  return {
    type: actionTypes.SET_INITITAL_DATA,
    data
  };
};

// Clear calculate Total Inventory
export const clearTotalInventory = (data) => {
  return {
    type: actionTypes.CLEAR_CALCULATE_TOTAL_INVENTORY,
    data
  };
};

//Set comparison inventory data
export const setComparisonInventoryData = (data) => {
  return {
    type: actionTypes.SET_COMPARISON_INVENTORY_DATA,
    data
  };
};

//clear Comparison data
export const clearComparisonData = (data) => {
  return {
    type: actionTypes.CLEAR_COMPARISON_DATA,
    data
  };
};

//clear search result
export const clearSearchResult = (data) => {
  return {
    type: actionTypes.CLEAR_SEARCH_DATA,
    data
  };
};


// Delete Simulation Configuration
export const deleteSimulationConfiguration = (data) => {
  return {
    type: actionTypes.DELETE_SIMULATION_CONFIGURATION_ASYNC,
    data
  };
};

export const deleteSimulationConfigurationStart = () => {
  return {
    type: actionTypes.DELETE_SIMULATION_CONFIGURATION_START
  };
};

export const deleteSimulationConfigurationSuccess = (data) => {
  return {
    type: actionTypes.DELETE_SIMULATION_CONFIGURATION_SUCCESS,
    data
  };
};

export const deleteSimulationConfigurationFailure = (error) => {
  return {
    type: actionTypes.DELETE_SIMULATION_CONFIGURATION_FAILURE,
    error
  };
};

export const setBackSTockSearchResult = (data) => {
  return {
    type: actionTypes.SET_BACKSTOCK_SEARCH_RESULT,
    data
  };
};

// Load uploaded file status
export const loadUploadedFileStatus = (id) => {
  return {
    type: actionTypes.LOAD_UPLOADED_FILE_STATUS_ASYNC,
    id
  };
};

export const loadUploadedFileStatusStart = () => {
  return {
    type: actionTypes.LOAD_UPLOADED_FILE_STATUS_START
  };
};

export const loadUploadedFileStatusSuccess = (data) => {
  return {
    type: actionTypes.LOAD_UPLOADED_FILE_STATUS_SUCCESS,
    error: null,
    data
  };
};

export const loadUploadedFileStatusFailure = (error) => {
  return {
    type: actionTypes.LOAD_UPLOADED_FILE_STATUS_FAILURE,
    error
  };
};

// add plano
export const addPlanogram = (data) => {
  return {
    type: actionTypes.ADD_PLANOGRAM,
    data
  };
};


// Set Save new planogram
export const saveNewPlanogram = (data) => {
  return {
    type: actionTypes.SAVE_NEW_PLANOGRAM_ASYNC,
    data
  };
};

export const saveNewPlanogramStart = () => {
  return {
    type: actionTypes.SAVE_NEW_PLANOGRAM_START
  };
};

export const saveNewPlanogramSuccess = (data) => {
  return {
    type: actionTypes.SAVE_NEW_PLANOGRAM_SUCCESS,
    data
  };
};

export const saveNewPlanogramFailure = (error) => {
  return {
    type: actionTypes.SAVE_NEW_PLANOGRAM_FAILURE,
    error
  };
};

export const checkFileUploadType = (data) => {
  return {
    type: actionTypes.CHECK_FILE_UPLOAD_TYPE,
    data
  };
};

// Delete Selected Template
export const deleteSelectedTemplate = (data) => {
  return {
    type: actionTypes.DELETE_SELECTED_TEMPLATE_ASYNC,
    data
  };
};

export const deleteSelectedTemplateStart = () => {
  return {
    type: actionTypes.DELETE_SELECTED_TEMPLATE_START
  };
};

export const deleteSelectedTemplateSuccess = (data) => {
  return {
    type: actionTypes.DELETE_SELECTED_TEMPLATE_SUCCESS,
    data
  };
};

export const deleteSelectedTemplateFailure = (error) => {
  return {
    type: actionTypes.DELETE_SELECTED_TEMPLATE_FAILURE,
    error
  };
};

//  Save Associate Template
export const saveAssociateTemplate = (data) => {
  console.log('action', data);
  return {
    type: actionTypes.SAVE_ASSOCIATE_TEMPLATE_ASYNC,
    data
  };
};

export const saveAssociateTemplateStart = () => {
  return {
    type: actionTypes.SAVE_ASSOCIATE_TEMPLATE_START
  };
};

export const saveAssociateTemplateSuccess = (data) => {
  return {
    type: actionTypes.SAVE_ASSOCIATE_TEMPLATE_SUCCESS,
    data
  };
};

export const saveAssociateTemplateFailure = (error) => {
  return {
    type: actionTypes.SAVE_ASSOCIATE_TEMPLATE_FAILURE,
    error
  };
};

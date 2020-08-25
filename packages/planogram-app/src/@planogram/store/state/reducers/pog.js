import * as actionTypes from '../actions/action-types';
import {
  updateObject,
  activityType,
  loadingType,
  statusMessage,
  getSimulationData,
  comparisonTableType
} from '../utility';
import * as _ from 'lodash';
import moment from 'moment-timezone';

const initialState = {
  chains: [], // List of all Chains with Stores
  storeConfigs: [], // List of all Configurations for selected Store
  images: [], // List of product images
  current: {
    // Current State of the Application
    activity: activityType.CONFIGURATION,
    subActivity: -1,
    zoom: 0.4,
    customPlanogram:{
      name:'__UNSELECTED__',
      rows:0
    },
    config: {
      configId: '__UNSELECTED__',
      configName: '',
      lowInventory: 0,
      outOfStock: 0,
      chainId: '__UNSELECTED__',
      storeId: '__UNSELECTED__',
      chainName: '__UNSELECTED__',
      storeName: '__UNSELECTED__',
      pogs: [],
      pos: [],
      pogId: '__UNSELECTED__',
      pogName: '__UNSELECTED__',
      dirty: false,
      editMode: false,
      planograms: [],
      selectedPosition: {
        segId: '__UNSELECTED__',
        Y: 0,
        X: 0,
        upc: '__UNSELECTED__',
        fixtureId: '__UNSELECTED__',
        units: 0,
        availableQty: 0,
        prodWidth: 0
      },
      replaceList: [],
      filteredProducts: [],
      uploadedFileData: null
    },
    simulate: {
      runConfiguration: {
        simConfigId: '__UNSELECTED__',
        simConfigName: '__UNSELECTED__',
        simulationConfig: [],
        storeConfigId: '__UNSELECTED__',
        saleSourceId: '__UNSELECTED__',
        saleSourceName: '__UNSELECTED__',
        toDate: new Date(),
        fromDate: new Date().setDate(new Date().getDate() - 7)
      },
      subActivity: -1,
      simulationView: false,
      viewConfiguration: {
        viewSimulationData: {},
        pogId: '__UNSELECTED__',
        tabIndex: 0,
        groupByPog: {},
        selectedPogDataByDate: {},
        selectedPogTabData: [],
        dataArray: [],
        dateIndex: null,
        selectedDate: '__UNSELECTED__',
        serviceConfigId: '__UNSELECTED__',
        serviceConfigName: 0,
        totalInventory: {
          totalBDC: 0,
          instockSKU: 0,
          instockFacing: 0,
          fullNess: 0,
          inventoryIndicator: [],
          availableQuantity: [],
          totalHoldingPowerBDC: []
        }
      }
    },
    comparison: {
      comparisonData: [],
      comparisonDataCount: 0,
      selectedTabValue: comparisonTableType.STORE,
      comparisonPogID: null,
      comparisonTabIndex:0,
      tableView: false,
      filterById: 3,
      compareById: 0,
      sortById: 0,
      comparisonFilterData: null,
      transformComparisonData: [], //transform data for table in comparison
      searchResult: [], // search result for table in comparison
      comparisonInventoryData: [],
      fileUploadTypeStatus: false,
    },
    planogram: null // Currently Loaded Planogram that is being modified
  },
  templates: [],
  templateList: [], //list of complete template
  products: [], // products array for search section
  backStockProducts: [], //products for back stock
  updatedBackStockProducts: [], // updated list of products for back stock
  backStockSearchResult: [], //back stock search result
  runSimulation: false, // For Simulation to run
  runSimulationPass: false, //For Simulation run complete
  loading: false, // Chains and stores, Configs , Plano Allocation , Selection Plano Edit
  loadingType: loadingType.NONE,
  error: false,
  success: false,
  status: 0,
  notification: false,
  statusMessage: null,
  notificationMessage: {
    loadingType: '',
    text: '',
    type: '__UNSELECTED__'
  }
};

const clearSelections = (state) => {
  return updateObject(state, {
    current: {
      // Current State of the Application
      activity: activityType.CONFIGURATION,
      subActivity: -1,
      zoom: 0.4,
      customPlanogram:{
        name:'__UNSELECTED__',
        rows:0
      },
      config: {
        ...state.current.config,
        configId: '__UNSELECTED__',
        configName: '',
        lowInventory: 0,
        outOfStock: 0,
        storeId: '__UNSELECTED__',
        storeName: '__UNSELECTED__',
        pogs: [],
        pos: [],
        pogId: '__UNSELECTED__',
        pogName: '__UNSELECTED__',
        dirty: false,
        editMode: false,
        selectedPosition: {
          segId: '__UNSELECTED__',
          Y: 0,
          X: 0,
          upc: '__UNSELECTED__',
          fixtureId: '__UNSELECTED__',
          units: 0,
          availableQty: 0,
          prodWidth: 0
        },
        replaceList: [],
        filteredProducts: [],
        uploadedFileData: null
      },
      simulate: {
        runConfiguration: {
          simConfigId: '__UNSELECTED__',
          simConfigName: '__UNSELECTED__',
          simulationConfig: [],
          storeConfigId: '__UNSELECTED__',
          saleSourceId: '__UNSELECTED__',
          saleSourceName: '__UNSELECTED__',
          toDate: new Date(),
          fromDate: new Date().setDate(new Date().getDate() - 7)
        },
        subActivity: -1,
        simulationView: false,
        viewConfiguration: {
          viewSimulationData: {},
          pogId: '__UNSELECTED__',
          tabIndex: 0,
          groupByPog: {},
          selectedPogDataByDate: {},
          selectedPogTabData: [],
          dataArray: [],
          dateIndex: null,
          selectedDate: '__UNSELECTED__',
          serviceConfigId: '__UNSELECTED__',
          serviceConfigName: 0,
          totalInventory: {
            totalBDC: 0,
            instockSKU: 0,
            instockFacing: 0,
            fullNess: 0,
            inventoryIndicator: [],
            availableQuantity: [],
            totalHoldingPowerBDC: []
          }
        }
      },
      comparison: {
        comparisonData: [],
        comparisonDataCount: 0,
        selectedTabValue: comparisonTableType.STORE,
        comparisonPogID: null,
        comparisonTabIndex:0,
        tableView: false,
        filterById: 3,
        compareById: 0,
        sortById: 0,
        comparisonFilterData: null,
        transformComparisonData: [], //transform data for table in comparison
        searchResult: [], // search result for table in comparison
        comparisonInventoryData: [],
        fileUploadTypeStatus: false
      },
      planogram: null // Currently Loaded Planogram that is being modified
    },
    templateList:[],
    backStockProducts: [],
    updatedBackStockProducts: [],
    backStockSearchResult: [],
    error: null,
    loading: false,
    runSimulation: false, // For Simulation to run
    runSimulationPass: false, //For Simulation run complete
    notificationMessage: {
      loadingType: '',
      text: '',
      type: '__UNSELECTED__'
    }
  });
};

const loadPlanogramsForConfigurationStart = (state) => {
  return updateObject(state, {
    success: false,
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    loadingType: loadingType.PLANOGRAMS_FOR_CONFIG
  });
};

const loadPlanogramsForConfigurationSuccess = (state, action) => {
  // current.config.pogs need to be updated
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        pogs: action.data[0].pogs
      }
    },
    success: true,
    status: 2,
    error: null,
    loading: false
  });
};

const selectChain = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        chainId: action.data.id,
        chainName: action.data.name
      }
    }
  });
};

const selectStore = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        storeId: action.data.id,
        storeName: action.data.name
      }
    }
  });
};

const selectPlanogram = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        pogId: action.data.id,
        pogName: action.data.name
      }
    }
  });
};

const clearSelectedPlanogram = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        pogId: '__UNSELECTED__',
        pogName: '__UNSELECTED__',
        pos: [],
        replaceList: []
      },
      planogram: null
    }
  });
};

const setComparisonData = (state, action) => {
  const currentComparisonData = state.current.comparison.comparisonData;
  const { uploadedFileName, uploadType, previewJson } = action.data[0];

  if (typeof currentComparisonData !== 'undefined') {
    const foundIndex = currentComparisonData.findIndex(
      (item) => item.uploadType === uploadType
    );

    if (foundIndex >= 0) {
      currentComparisonData[foundIndex] = {
        ...currentComparisonData[foundIndex],
        uploadedFileName,
        uploadType,
        previewJson
      };
    } else {
      currentComparisonData.push({ uploadedFileName, uploadType, previewJson });
    }
    _.remove(currentComparisonData, { uploadType: null });
    const comparisonDataCount = currentComparisonData.length;
    return updateObject(state, {
      current: {
        ...state.current,
        comparison: {
          ...state.current.comparison,
          comparisonData: currentComparisonData,
          comparisonDataCount: comparisonDataCount
        }
      }
    });
  }
};

const setSimulationView = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        simulationView: action.data
      }
    }
  });
};

const selectSimulationViewTab = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          // serviceconfig: state.current.simulate.serviceconfig,
          pogId: action.data.id,
          tabIndex: action.data.index
        }
      }
    }
  });
};

const clearSimulationViewTab = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          serviceconfig: state.current.simulate.serviceconfig,
          pogId: '__UNSELECTED__',
          tabIndex: 0
        }
      }
    }
  });
};

const clearSimulationTab = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          simConfigId: '__UNSELECTED__',
          simConfigName: '__UNSELECTED__',
          storeConfigId: '__UNSELECTED__',
          saleSourceId: '__UNSELECTED__',
          saleSourceName: '__UNSELECTED__',
          toDate: new Date(),
          fromDate: new Date().setDate(new Date().getDate() - 7)
        },
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          pogId: '__UNSELECTED__',
          tabIndex: 0,
          serviceConfigName: 0
        }
      }
    },
    runSimulation: false,
    runSimulationPass: false
  });
};

const setEditModeForPlanogram = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        editMode: action.data,
        replaceList: [],
        dirty: false
      }
    }
  });
};

const setSelectedPlanogramPosition = (state, action) => {
  let similarProducts = _.groupBy(
    state.products,
    (product) => product.prodWidth
  );
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        selectedPosition: action.data,
        filteredProducts: similarProducts[action.data.prodWidth]
      }
    }
  });
};

const unSelectPlanogramPosition = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        selectedPosition: {
          segId: '__UNSELECTED__',
          Y: 0,
          X: 0,
          upc: '__UNSELECTED__',
          fixtureId: '__UNSELECTED__',
          units: 0,
          availableQty: 0,
          prodWidth: 0
        },
        filteredProducts: []
      }
    }
  });
};

const loadPlanogramsForConfigurationFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    loading: false,
    statusMessage: action.error
  });
};

const loadChainsAndStoresStart = (state) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    loadingType: loadingType.CHAINS
  });
};

const loadChainsAndStoresSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    chains: action.data,
    loading: false,
    error: null
  });
};

const setProductImages = (state, action) => {
  return updateObject(state, {
    images: action.data
  });
};

const loadChainsAndStoresFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    loading: false,
    statusMessage: action.error
  });
};

const loadConfigurationsForStoreStart = (state) => {
  return updateObject(state, {
    success: false,
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    loadingType: loadingType.CONFIG
  });
};

const loadConfigurationsForStoreSuccess = (state, action) => {
  return updateObject(state, {
    success: true,
    storeConfigs: action.data,
    status: 2,
    loading: false,
    error: null
  });
};

const loadConfigurationsForStoreFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: action.error,
    loading: false
  });
};

const setCurrentActivityType = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      activity: action.data
    }
  });
};

const setCurrentSubActivityType = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      subActivity: action.data
    }
  });
};

const setZoomForPlanogram = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      zoom: action.data
    }
  });
};

const selectCurrentConfiguration = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        configId: action.id,
        dirty: false
      }
    }
  });
};

const setCurrentConfigurationInventory = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        ...action.data,
        dirty: false
      }
    }
  });
};

const setCurrentConfigurationLowInventory = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        ...action.data,
        dirty: true
      }
    }
  });
};

const setCurrentConfigurationOOSInventory = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        ...action.data,
        dirty: true
      }
    }
  });
};

const setCurrentConfigurationPlanogramSalesAllocation = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        pogs: action.data,
        dirty: true
      }
    }
  });
};

const loadPosForPlanogramStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    loadingType: loadingType.PLANOGRAM_POS
  });
};

const flatteningPosForPlanogramSuccess = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      planogram: action.data
    },
    status: 2,
    loading: false,
    error: null
  });
};

const flatteningPosForPlanogramFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    loading: false,
    statusMessage: action.error
  });
};

const setPosForPlanogramStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    loadingType: loadingType.PLANOGRAM_POS,
    status: 1,
    statusMessage: statusMessage.LOADING
  });
};

const setPosForPlanogramSuccess = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        pos: action.data
      }
    },
    status: 2,
    loading: false,
    error: null
  });
};

const updatePlanogramPositionUnits = (state, action) => {
  const { current } = state;
  const { X, Y, units } = action.data;
  const currentPos = current.config.pos;

  if (typeof currentPos !== 'undefined') {
    const foundIndex = currentPos.findIndex(
      (item) => item.X === X && item.Y === Y
    );
    currentPos[foundIndex] = {
      ...currentPos[foundIndex],
      units: units
    };

    return updateObject(state, {
      current: {
        ...state.current,
        config: {
          ...state.current.config,
          pos: currentPos,
          dirty: true
        }
      }
    });
  }
  return state;
};

const updatePlanogramPositionAvailableQty = (state, action) => {
  const { current } = state;
  const { X, Y, availableQty } = action.data;
  const currentPos = current.config.pos;

  if (typeof currentPos !== 'undefined') {
    const foundIndex = currentPos.findIndex(
      (item) => item.X === X && item.Y === Y
    );
    currentPos[foundIndex] = {
      ...currentPos[foundIndex],
      availableQty: availableQty
    };

    return updateObject(state, {
      current: {
        ...state.current,
        config: {
          ...state.current.config,
          pos: currentPos,
          dirty: true
        }
      }
    });
  }
  return state;
};

/**
 * TODO
 * move to Saga
 * 1) Create updated pos (pass the pos to it)
 * 2) Call update POS
 * 3) Call flatten based on new POS
 * @param {*} state
 * @param {*} action
 */
const replacePlanogramPosition = (state, action) => {
  const { current } = state;
  const { X, Y, upc, bdc } = action.data;
  const currentPos = current.config.pos;

  if (typeof currentPos !== 'undefined') {
    const foundIndex = currentPos.findIndex(
      (item) => item.X === X && item.Y === Y
    );
    currentPos[foundIndex] = {
      ...currentPos[foundIndex],
      upc,
      bdc
    };

    const replaceList = state.current.config.replaceList.filter(
      (item) => !(item.X === X && item.Y === Y)
    );
    replaceList.push({ X, Y, upc });
    return updateObject(state, {
      current: {
        ...state.current,
        config: {
          ...state.current.config,
          pos: currentPos,
          replaceList,
          dirty: true
        }
      }
    });
  }

  return state;
};

const setPosForPlanogramFailure = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const saveCurrentConfigurationStart = (state, action) => {
  return updateObject(state, {
    success: false,
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    loading: true,
    loadingType: loadingType.SAVE_CONFIG
  });
};

const saveCurrentConfigurationSuccess = (state, action) => {
  const { storeConfigs } = state;
  const { configId, lowInventory, outOfStock } = action.data;

  const foundIndex = storeConfigs.findIndex(
    (item) => item.configId === configId
  );
  storeConfigs[foundIndex] = {
    ...storeConfigs[foundIndex],
    lowInventory,
    outOfStock
  };

  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SAVE_CONFIG,
    loading: false,
    error: false,
    loadingType: loadingType.SAVE_CONFIG,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.SAVE_CONFIG,
      type: 'success'
    },
    storeConfigs,
    statusMessage: statusMessage.SAVE_CONFIG,
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: false
      }
    }
  });
};

const saveCurrentConfigurationFailure = (state, action) => {
  return updateObject(state, {
    error: true,
    status: -1,
    success: false,
    statusMessage: action.error,
    loading: false
  });
};

const saveAsCurrentConfigurationStart = (state, action) => {
  return updateObject(state, {
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    loading: true,
    loadingType: loadingType.SAVE_AS_CONFIG
  });
};

const saveAsCurrentConfigurationFailure = (state, action) => {
  return updateObject(state, {
    success: false,
    error: true,
    status: -1,
    statusMessage: action.error,
    loading: false
  });
};

const saveAsCurrentConfigurationSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SAVE_AS_CONFIG,
    loading: false,
    error: false,
    loadingType: loadingType.SAVE_AS_CONFIG,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.SAVE_AS_CONFIG,
      type: 'success'
    }
  });
};

const deleteCurrentConfiguration = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.DELETE
  });
};

const deleteCurrentConfigurationSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.DELETE,
    loading: false,
    loadingType: loadingType.DELETE,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.DELETE,
      type: 'success'
    }
  });
};

const deleteCurrentConfigurationFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error,
    loading: false
  });
};

const saveUploadFile = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    loading: true,
    error: null,
    loadingType: loadingType.UPLOAD
  });
};

const saveUploadFileFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const saveUploadFileSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.UPLOAD,
    loading: false,
    loadingType: loadingType.UPLOAD
  });
};

//search products

const loadProductsForSearchStart = (state) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    loadingType: loadingType.SEARCH
  });
};

const loadProductsForSearchSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    products: action.data,
    loading: false,
    success: true,
    loadingType: loadingType.SEARCH,
    error: null
  });
};

const loadProductsForSearchFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: action.error,
    loading: false
  });
};

//Get Template Name

const getTemplateNameStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.GET_TEMPLATE
  });
};

const getTemplateNameSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    templates: action.data,
    templateList: action.data,
    loading: false,
    loadingType: loadingType.GET_TEMPLATE
  });
};

const getTemplateNameFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

//Save As Template

const saveAsTemplateStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.SAVE_AS_TEMPLATE
  });
};

const saveAsTemplateSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SAVE_AS_TEMPLATE,
    loading: false,
    error: null,
    loadingType: loadingType.SAVE_AS_TEMPLATE
  });
};

const saveAsTemplateFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const clearTemplate = (state) => {
  return updateObject(state, {
    templates: [],
    success: false
  });
};

//Save As Template

const savePlanogramForPosStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.SAVE_PLANOGRAM_FOR_POS
  });
};

const savePlanogramForPosSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SAVE_PLANOGRAM_FOR_POS,
    loading: false,
    error: null,
    loadingType: loadingType.SAVE_PLANOGRAM_FOR_POS,
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: false
      }
    }
  });
};

const savePlanogramForPosFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const clearPlanogramForPos = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        replaceList: []
      }
    },
    success: false
  });
};

//get products for back stock

const loadProductsForBackStockStart = (state) => {
  return updateObject(state, {
    status: 1,
    error: null,
    loading: true,
    loadingType: loadingType.GET_BACKSTOCK
  });
};

const loadProductsForBackStockSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    backStockProducts: action.data,
    loading: false,
    success: true,
    loadingType: loadingType.GET_BACKSTOCK,
    error: null
  });
};

const loadProductsForBackStockFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

//update products for back stock

const updateProductsForBackStockStart = (state) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    success: false,
    loadingType: loadingType.UPDATE_BACKSTOCK
  });
};

const updateProductsForBackStockSuccess = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: false
      }
    },
    status: 2,
    loading: false,
    success: true,
    loadingType: loadingType.UPDATE_BACKSTOCK,
    error: null,
    statusMessage: statusMessage.UPDATE_BACKSTOCK
  });
};

const updateProductsForBackStockFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const updateProductBackStockQuantity = (state, action) => {
  const { backStockProducts, backStockSearchResult } = state;
  const { id, bdc, upc, backstockQty } = action.data;
  if(backStockSearchResult.length > 0){
    const foundIndex = backStockSearchResult.findIndex((item) => item.id === id);
    backStockSearchResult[foundIndex] = {
      ...backStockSearchResult[foundIndex],
      bdc,
      upc,
      backstockQty
    };
  }
  if (typeof backStockProducts !== 'undefined') {
    const foundIndex = backStockProducts.findIndex((item) => item.id === id);
    backStockProducts[foundIndex] = {
      ...backStockProducts[foundIndex],
      bdc,
      upc,
      backstockQty
    };
    const updatedBackStockProducts = state.updatedBackStockProducts.filter(
      (item) => !(item.id === id)
    );
    updatedBackStockProducts.push({ id, backstockQty });
    return updateObject(state, {
      current: {
        ...state.current,
        config: {
          ...state.current.config,
          dirty: true
        }
      },
      updatedBackStockProducts
    });
  }
  return state;
};

const clearProductBackStockQuantity = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: false
      }
    },
    updatedBackStockProducts: []
  });
};

const setNotification = (state, action) => {
  return updateObject(state, {
    notification: action.data
  });
};

const loadSimulationConfiguartionStart = (state) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    success: false,
    loadingType: loadingType.LOAD_SIMULATION_CONFIG
  });
};

const loadSimulationConfiguartionSuccess = (state, action) => {
  const actionData = action.data;
  const addition = {
    id: 'No_Config_Selected',
    simconfigName: 'No Config Selected',
    configId: '__UNSELECTED__',
    dataType: '__UNSELECTED__',
    toDate: new Date(),
    fromDate: new Date().setDate(new Date().getDate() - 7)
  };

  const simConfig =
    actionData.length > 0 ? [addition].concat(actionData) : actionData;

  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          simulationConfig: simConfig
        }
      }
    },
    status: 2,
    loading: false,
    success: true,
    loadingType: loadingType.GET_SIMULATION_CONFIG,
    error: null
  });
};

const loadSimulationConfiguartionFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const selectSimulationConfig = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          simConfigId: action.data.id,
          simConfigName: action.data.name
        }
      }
    }
  });
};

const selectSimulationStoreConfig = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          storeConfigId: action.data.id
        }
      }
    }
  });
};

const selectSimulationSaleSource = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          saleSourceId: action.data.id,
          saleSourceName: action.data.name
        }
      }
    }
  });
};

const setCalendarValue = (state, action) => {
  if (action.data.type === 'From Date') {
    return updateObject(state, {
      current: {
        ...state.current,
        simulate: {
          ...state.current.simulate,
          runConfiguration: {
            ...state.current.simulate.runConfiguration,
            fromDate: action.data.date
          }
        }
      }
    });
  } else {
    return updateObject(state, {
      current: {
        ...state.current,
        simulate: {
          ...state.current.simulate,
          runConfiguration: {
            ...state.current.simulate.runConfiguration,
            toDate: action.data.date
          }
        }
      }
    });
  }
};

// const clearTemplate = (state) => {
//   return updateObject(state, {
//     templates: [],
//     success: false
//   });
// };

const saveSimulateConfigurationStart = (state, action) => {
  return updateObject(state, {
    success: false,
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    loading: true,
    loadingType: loadingType.SAVE_SIMULATION_CONFIG
  });
};

const saveSimulateConfigurationSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SAVE_SIMULATION_CONFIG,
    loading: false,
    error: null,
    loadingType: loadingType.SAVE_SIMULATION_CONFIG,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.SAVE_SIMULATION_CONFIG,
      type: 'success'
    }
  });
  // return updateObject(state, {
  //   status: 2,
  //   success: true,
  //   statusMessage: statusMessage.SAVE_SIMULATION_CONFIG,
  //   loading: false,
  //   error: false,
  //   loadingType: loadingType.SAVE_SIMULATION_CONFIG,
  //   notification: true,
  //   notificationMessage: {
  //     ...state.notificationMessage,
  //     text: statusMessage.SAVE_SIMULATION_CONFIG,
  //     type: 'success'
  //   }
  // });
};

const saveSimulateConfigurationFailure = (state, action) => {
  return updateObject(state, {
    error: true,
    status: -1,
    success: false,
    statusMessage: action.error.message,
    loading: false
  });
};

const runSimulationStart = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: true
      }
    },
    success: false,
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    loading: true,
    runSimulation: true,
    runSimulationPass: false,
    loadingType: loadingType.RUN_SIMULATION
  });
};

const runSimulationSuccess = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: true
      },
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          viewSimulationData: action.data
        }
      }
    },
    loading: false,
    runSimulation: false,
    runSimulationPass: true,
    error: false,
    status: 2,
    success: true,
    loadingType: loadingType.RUN_SIMULATION
  });
};

const runSimulationFailure = (state, action) => {
  return updateObject(state, {
    error: true,
    status: -1,
    success: false,
    statusMessage: action.error.message,
    loading: false,
    runSimulation: false,
    runSimulationPass: false
  });
};

//pythonDataTransform
const simulationDataTransform = (state, action) => {
  let filterProducts = null;
  let selectedPogData = null;
  let selectedDateData = null;
  let runResMapToPos = null;
  //need filter data based on POGID and then get data to corresponding date
  if (action.data) {
    filterProducts = _.groupBy(action.data.displayOutput, (item) => item.pogId);
    selectedPogData =
      filterProducts[state.current.simulate.viewConfiguration.pogId];
    selectedDateData = _.groupBy(
      selectedPogData,
      (item) => item.simulationDate
    );

    let simulationDate = state.current.simulate.viewConfiguration.selectedDate;
    let simulationDateData = selectedDateData[simulationDate];
    //let planoProducts = state.current.planogram.products;
  }
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          groupByPog: filterProducts,
          selectedPogDataByDate: selectedDateData,
          selectedPogTabData: selectedPogData
        }
      }
    }
  });
};
const setSelectedDate = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          selectedDate: action.data.selectedDate,
          dateIndex: action.data.dateIndex
        }
      }
    }
  });
};

const setServicesConfig = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          serviceConfigName: action.data
        }
      }
    }
  });
};

const setFilterByDropdown = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        filterById: action.data
      }
    }
  });
};

const setSortByDropdown = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        sortById: action.data
      }
    }
  });
};

const setCompareByDropdown = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        compareById: action.data
      }
    }
  });
};

const setComparisonFilterData = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        comparisonFilterData: action.data,
        transformComparisonData: []
      }
    }
  });
};

const setComparisonTable = (state, action) => {
  const result = action.data;
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        selectedTabValue: result.table,
        tableView: false,
        comparisonPogID: result.pogID,
        comparisonTabIndex:result.tabIndex,
        transformComparisonData: []
      }
    }
  });
};

const calculateTotalInventory = (state, action) => {
  const simulationData = {
    ...action.data,
    posData: state.current.config.pos,
    simulateData:
      state.current.simulate.viewConfiguration.viewSimulationData.displayOutput
  };
  const result = getSimulationData(simulationData);
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          totalInventory: {
            ...state.current.simulate.viewConfiguration.totalInventory,
            totalBDC: result.totalBDC,
            instockSKU: result.inStockSKUPercent,
            instockFacing: result.inStockFacingPercent,
            fullNess: result.fullnessPercent,
            inventoryIndicator: result.masterData,
            availableQuantity: result.fullAllBDC,
            totalHoldingPowerBDC: result.totalHoldingPowerBDC
          }
        }
      }
    }
  });
};

const setTransformDataForTable = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        tableView: true,
        transformComparisonData: action.data
      }
    }
  });
};

const setSearchResultForTable = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        searchResult: action.data
      }
    }
  });
};

const setInititalDate = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          dateArray: action.data,
          selectedDate: action.data[0],
          dateIndex: 0
        }
      }
    }
  });
};

const clearTotalInventory = (state) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        viewConfiguration: {
          ...state.current.simulate.viewConfiguration,
          totalInventory: {
            ...state.current.simulate.viewConfiguration,
            instockSKU: 0,
            instockFacing: 0,
            fullNess: 0
          }
        }
      }
    }
  });
};
const setComparisonInventoryData = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        comparisonInventoryData: action.data
      }
    }
  });
};

const clearSearchResult = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        searchResult: []
      }
    }
  });
};

const deleteSimulationConfigurationStart = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        dirty: true
      }
    },
    success: false,
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    loading: true,
    loadingType: loadingType.SIM_CONFIG_DELETE
  });
};

const deleteSimulationConfigurationSuccess = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      simulate: {
        ...state.current.simulate,
        runConfiguration: {
          ...state.current.simulate.runConfiguration,
          simConfigId: '__UNSELECTED__',
          simConfigName: '__UNSELECTED__',
          storeConfigId: '__UNSELECTED__',
          saleSourceId: '__UNSELECTED__',
          saleSourceName: '__UNSELECTED__',
          toDate: new Date(),
          fromDate: new Date().setDate(new Date().getDate() - 7)
        }
      }
    },
    status: 2,
    success: true,
    statusMessage: statusMessage.SIM_CONFIG_DELETE,
    loading: false,
    loadingType: loadingType.SIM_CONFIG_DELETE,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      loadingType: loadingType.SIM_CONFIG_DELETE,
      text: statusMessage.SIM_CONFIG_DELETE,
      type: 'success'
    }
  });
};

const deleteSimulationConfigurationFailure = (state, action) => {
  return updateObject(state, {
    error: true,
    status: -1,
    success: false,
    statusMessage: action.error.message,
    loading: false,
    runSimulation: false,
    runSimulationPass: false
  });
};

const clearComparisonData = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        comparisonData: [],
        comparisonDataCount: 0,
        selectedTabValue: comparisonTableType.STORE,
        // comparisonPogID:null,
        // tableView: false,
        // filterById: 3,
        // compareById: 0,
        // sortById: 0,
        // comparisonFilterData: null,
        comparisonTabIndex:0,
        transformComparisonData: [], //transform data for table in comparison
        searchResult: [], // search result for table in comparison
        comparisonInventoryData: []
      }
    }
  });
};

const setBackSTockSearchResult = (state, action) => {
  return updateObject(state, {
    backStockSearchResult: action.data
  });
}
const loadUploadedFileStatusStart = (state) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    error: null,
    loading: true,
    success: false,
    loadingType: loadingType.LOAD_UPLOADED_FILE_STATUS
  });
};

const loadUploadedFileStatusSuccess = (state, action) => {
 
  _.forEach(action.data, function(item) {
          let dateTZ = moment(item.processTime).tz("America/Chicago").format();
          let date=dateTZ.substring(0,dateTZ.lastIndexOf("-"));
          let modifiedDate = date.split("T");
          item.processTime = modifiedDate[0]+' '+modifiedDate[1];
  })
  return updateObject(state, {
    current: {
      ...state.current,
      config: {
        ...state.current.config,
        uploadedFileData: action.data
      }
    },
    status: 2,
    loading: false,
    success: true,
    loadingType: loadingType.LOAD_UPLOADED_FILE_STATUS,
    error: null
  });
};

const loadUploadedFileStatusFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const addPlanogram = (state, action) => {
  const result = action.data;
  return updateObject(state, {
    current: {
      ...state.current,
      customPlanogram:{
        name:result.name,
        rows:result.rows
      },
    }
  });
};

//Save new planogram
const saveNewPlanogramStart = (state, action) => {
  return updateObject(state, {
    success: false,
    error: null,
    status: 1,
    statusMessage: statusMessage.LOADING,
    loading: true,
    loadingType: loadingType.SAVE_SIMULATION_CONFIG
  });
};

const saveNewPlanogramSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.SIM_CONFIG_DELETE,
    loading: false,
    loadingType: loadingType.SIM_CONFIG_DELETE,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      loadingType: loadingType.SIM_CONFIG_DELETE,
      text: statusMessage.SIM_CONFIG_DELETE,
      type: 'success'
    }
  });
};

const saveNewPlanogramFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error.message,
    loading: false
  });
};

const checkFileUploadType = (state, action) => {
  return updateObject(state, {
    current: {
      ...state.current,
      comparison: {
        ...state.current.comparison,
        fileUploadTypeStatus: action.data
      }
    }
  });
};


const deleteSelectedTemplateStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.TEMPLATE_DELETE
  });
};

const deleteSelectedTemplateSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.TEMPLATE_DELETE,
    loading: false,
    loadingType: loadingType.TEMPLATE_DELETE,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.TEMPLATE_DELETE,
      type: 'success'
    }
  });
};

const deleteSelectedTemplateFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error,
    loading: false
  });
};

const saveAssociateTemplateStart = (state, action) => {
  return updateObject(state, {
    status: 1,
    statusMessage: statusMessage.LOADING,
    success: false,
    error: null,
    loading: true,
    loadingType: loadingType.ASSOCIATE_TEMPLATE
  });
};


const saveAssociateTemplateSuccess = (state, action) => {
  return updateObject(state, {
    status: 2,
    success: true,
    statusMessage: statusMessage.ASSOCIATE_TEMPLATE,
    loading: false,
    loadingType: loadingType.ASSOCIATE_TEMPLATE,
    notification: true,
    notificationMessage: {
      ...state.notificationMessage,
      text: statusMessage.ASSOCIATE_TEMPLATE,
      type: 'success'
    }
  });
};

const saveAssociateTemplateFailure = (state, action) => {
  return updateObject(state, {
    status: -1,
    error: true,
    statusMessage: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_STORE:
      return selectStore(state, action);
    case actionTypes.SELECT_CHAIN:
      return selectChain(state, action);
    case actionTypes.CLEAR_SELECTIONS:
      return clearSelections(state);
    case actionTypes.SELECT_PLANOGRAM:
      return selectPlanogram(state, action);
    case actionTypes.CLEAR_SELECTED_PLANOGRAM:
      return clearSelectedPlanogram(state);
    case actionTypes.SET_EDIT_MODE_FOR_PLANOGRAMS:
      return setEditModeForPlanogram(state, action);
    case actionTypes.SET_SELECTED_PLANOGRAM_POSITION:
      return setSelectedPlanogramPosition(state, action);
    case actionTypes.UNSELECT_PLANOGRAM_POSITION:
      return unSelectPlanogramPosition(state);
    case actionTypes.REPLACE_PLANOGRAM_POSITION:
      return replacePlanogramPosition(state, action);
    case actionTypes.FLATTEN_POS_FOR_PLANOGRAM_START:
      return loadPosForPlanogramStart(state);
    case actionTypes.FLATTEN_POS_FOR_PLANOGRAM_SUCCESS:
      return flatteningPosForPlanogramSuccess(state, action);
    case actionTypes.FLATTEN_POS_FOR_PLANOGRAM_FAILURE:
      return flatteningPosForPlanogramFailure(state, action);
    case actionTypes.SET_POS_FOR_PLANOGRAM_START:
      return setPosForPlanogramStart(state);
    case actionTypes.SET_POS_FOR_PLANOGRAM_SUCCESS:
      return setPosForPlanogramSuccess(state, action);
    case actionTypes.SET_POS_FOR_PLANOGRAM_FAILURE:
      return setPosForPlanogramFailure(state, action);
    case actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_START:
      return loadPlanogramsForConfigurationStart(state);
    case actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_SUCCESS:
      return loadPlanogramsForConfigurationSuccess(state, action);
    case actionTypes.LOAD_PLANOGRAMS_FOR_CONFIG_FAILURE:
      return loadPlanogramsForConfigurationFailure(state, action);
    case actionTypes.LOAD_CHAINS_AND_STORES_START:
      return loadChainsAndStoresStart(state);
    case actionTypes.LOAD_CHAINS_AND_STORES_SUCCESS:
      return loadChainsAndStoresSuccess(state, action);
    case actionTypes.LOAD_CHAINS_AND_STORES_FAILURE:
      return loadChainsAndStoresFailure(state, action);
    case actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_START:
      return loadConfigurationsForStoreStart(state);
    case actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_SUCCESS:
      return loadConfigurationsForStoreSuccess(state, action);
    case actionTypes.LOAD_CONFIGURATIONS_FOR_STORE_FAILURE:
      return loadConfigurationsForStoreFailure(state, action);
    case actionTypes.SET_ZOOM_FOR_PLANOGRAM:
      return setZoomForPlanogram(state, action);
    case actionTypes.SET_CURRENT_ACTIVITY_TYPE:
      return setCurrentActivityType(state, action);
    case actionTypes.SET_CURRENT_SUB_ACTIVITY_TYPE:
      return setCurrentSubActivityType(state, action);
    case actionTypes.SELECT_CURRENT_CONFIGURATION:
      return selectCurrentConfiguration(state, action);
    case actionTypes.SET_CURRENT_CONFIGURATION_INVENTORY:
      return setCurrentConfigurationInventory(state, action);
    case actionTypes.SET_CURRENT_CONFIGURATION_LOW_INVENTORY:
      return setCurrentConfigurationLowInventory(state, action);
    case actionTypes.SET_CURRENT_CONFIGURATION_OOS_INVENTORY:
      return setCurrentConfigurationOOSInventory(state, action);
    case actionTypes.SET_CURRENT_CONFIGURATION_PLANOGRAM_SALES_ALLOCATION:
      return setCurrentConfigurationPlanogramSalesAllocation(state, action);
    case actionTypes.SAVE_CURRENT_CONFIGURATION_START:
      return saveCurrentConfigurationStart(state, action);
    case actionTypes.SAVE_CURRENT_CONFIGURATION_SUCCESS:
      return saveCurrentConfigurationSuccess(state, action);
    case actionTypes.SAVE_CURRENT_CONFIGURATION_FAILURE:
      return saveCurrentConfigurationFailure(state, action);
    case actionTypes.SAVE_AS_CURRENT_CONFIGURATION_START:
      return saveAsCurrentConfigurationStart(state, action);
    case actionTypes.SAVE_AS_CURRENT_CONFIGURATION_SUCCESS:
      return saveAsCurrentConfigurationSuccess(state, action);
    case actionTypes.SAVE_AS_CURRENT_CONFIGURATION_FAILURE:
      return saveAsCurrentConfigurationFailure(state, action);
    case actionTypes.DELETE_CURRENT_CONFIGURATION_ASYNC:
      return deleteCurrentConfiguration(state, action);
    case actionTypes.DELETE_CURRENT_CONFIGURATION_SUCCESS:
      return deleteCurrentConfigurationSuccess(state, action);
    case actionTypes.DELETE_CURRENT_CONFIGURATION_FAILURE:
      return deleteCurrentConfigurationFailure(state, action);
    case actionTypes.FILE_UPLOAD_START:
      return saveUploadFile(state, action);
    case actionTypes.FILE_UPLOAD_SUCCESS:
      return saveUploadFileSuccess(state, action);
    case actionTypes.FILE_UPLOAD_FAILURE:
      return saveUploadFileFailure(state, action);
    //search
    case actionTypes.LOAD_PRODUCTS_FOR_SEARCH_START:
      return loadProductsForSearchStart(state);
    case actionTypes.LOAD_PRODUCTS_FOR_SEARCH_SUCCESS:
      return loadProductsForSearchSuccess(state, action);
    case actionTypes.LOAD_PRODUCTS_FOR_SEARCH_FAILURE:
      return loadProductsForSearchFailure(state, action);
    case actionTypes.SAVE_AS_TEMPLATE_START:
      return saveAsTemplateStart(state);
    case actionTypes.SAVE_AS_TEMPLATE_SUCCESS:
      return saveAsTemplateSuccess(state, action);
    case actionTypes.SAVE_AS_TEMPLATE_FAILURE:
      return saveAsTemplateFailure(state, action);
    case actionTypes.GET_TEMPLATE_NAME_START:
      return getTemplateNameStart(state);
    case actionTypes.GET_TEMPLATE_NAME_SUCCESS:
      return getTemplateNameSuccess(state, action);
    case actionTypes.GET_TEMPLATE_NAME_FAILURE:
      return getTemplateNameFailure(state, action);
    case actionTypes.CLEAR_TEMPLATE:
      return clearTemplate(state);
    case actionTypes.SAVE_PLANOGRAM_FOR_POS_START:
      return savePlanogramForPosStart(state);
    case actionTypes.SAVE_PLANOGRAM_FOR_POS_SUCCESS:
      return savePlanogramForPosSuccess(state, action);
    case actionTypes.SAVE_PLANOGRAM_FOR_POS_FAILURE:
      return savePlanogramForPosFailure(state, action);
    case actionTypes.CLEAR_PLANOGRAM_FOR_POS:
      return clearPlanogramForPos(state, action);
    case actionTypes.SET_PRODUCT_IMAGES:
      return setProductImages(state, action);
    case actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_START:
      return loadProductsForBackStockStart(state);
    case actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_SUCCESS:
      return loadProductsForBackStockSuccess(state, action);
    case actionTypes.LOAD_PRODUCTS_FOR_BACKSTOCK_FAILURE:
      return loadProductsForBackStockFailure(state, action);
    case actionTypes.UPDATE_PLANOGRAM_POSITION_AVAILABLE_QTY:
      return updatePlanogramPositionAvailableQty(state, action);
    case actionTypes.UPDATE_PLANOGRAM_POSITION_UNITS:
      return updatePlanogramPositionUnits(state, action);
    case actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_START:
      return updateProductsForBackStockStart(state);
    case actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_SUCCESS:
      return updateProductsForBackStockSuccess(state, action);
    case actionTypes.UPDATE_PRODUCTS_FOR_BACKSTOCK_FAILURE:
      return updateProductsForBackStockFailure(state, action);
    case actionTypes.UPDATE_PRODUCT_BACK_STOCK_QUANTITY:
      return updateProductBackStockQuantity(state, action);
    case actionTypes.CLEAR_PRODUCT_BACKSTOCK_QUANTITY:
      return clearProductBackStockQuantity(state);
    case actionTypes.SET_NOTIFICATION:
      return setNotification(state, action);
    case actionTypes.LOAD_SIMULATION_CONFIG_START:
      return loadSimulationConfiguartionStart(state);
    case actionTypes.LOAD_SIMULATION_CONFIG_SUCCESS:
      return loadSimulationConfiguartionSuccess(state, action);
    case actionTypes.LOAD_SIMULATION_CONFIG_FAILURE:
      return loadSimulationConfiguartionFailure(state, action);
    case actionTypes.SELECT_SIMULATION_CONFIG:
      return selectSimulationConfig(state, action);
    case actionTypes.SET_SIMULATION_VIEW:
      return setSimulationView(state, action);
    case actionTypes.SELECT_TAB_SIMULATION:
      return selectSimulationViewTab(state, action);
    case actionTypes.CLEAR_TAB_SIMULATION_VIEW:
      return clearSimulationViewTab(state);
    case actionTypes.CLEAR_TAB_SIMULATION:
      return clearSimulationTab(state);
    case actionTypes.SELECT_SIMULATION_STORE_CONFIG:
      return selectSimulationStoreConfig(state, action);
    case actionTypes.SELECT_SIMULATION_SALES_SOURCE:
      return selectSimulationSaleSource(state, action);
    case actionTypes.SET_CALENDAR_VALUE:
      return setCalendarValue(state, action);
    case actionTypes.SAVE_SIMULATION_CONFIGURATION_START:
      return saveSimulateConfigurationStart(state, action);
    case actionTypes.SAVE_SIMULATION_CONFIGURATION_SUCCESS:
      return saveSimulateConfigurationSuccess(state, action);
    case actionTypes.SAVE_SIMULATION_CONFIGURATION_FAILURE:
      return saveSimulateConfigurationFailure(state, action);
    case actionTypes.RUN_SIMULATION_START:
      return runSimulationStart(state, action);
    case actionTypes.RUN_SIMULATION_SUCCESS:
      return runSimulationSuccess(state, action);
    case actionTypes.RUN_SIMULATION_FAILURE:
      return runSimulationFailure(state, action);
    case actionTypes.RUN_SIMULATION_DATA_TRANSFORM:
      return simulationDataTransform(state, action);
    case actionTypes.CALCULATE_TOTAL_INVENTORY:
      return calculateTotalInventory(state, action);
    case actionTypes.SELECT_DATE:
      return setSelectedDate(state, action);
    case actionTypes.SELECT_SERVICE_CONFIG:
      return setServicesConfig(state, action);
    case actionTypes.SET_COMPARISON_DATA:
      return setComparisonData(state, action);
    case actionTypes.SET_FILTERBY_DROPDOWN:
      return setFilterByDropdown(state, action);
    case actionTypes.SET_SORTBY_DROPDOWN:
      return setSortByDropdown(state, action);
    case actionTypes.SET_COMPAREBY_DROPDOWN:
      return setCompareByDropdown(state, action);
    case actionTypes.SET_COMPARISON_SINGLE_FILE_FILTER_DATA:
      return setComparisonFilterData(state, action);
    case actionTypes.SET_COMPARISON_TABLE:
      return setComparisonTable(state, action);
    case actionTypes.SET_TRANSFORM_DATA_FOR_TABLE:
      return setTransformDataForTable(state, action);
    case actionTypes.SET_SEARCH_RESULT_FOR_TABLE:
      return setSearchResultForTable(state, action);
    case actionTypes.SET_INITITAL_DATA:
      return setInititalDate(state, action);
    case actionTypes.CLEAR_CALCULATE_TOTAL_INVENTORY:
      return clearTotalInventory(state);
    case actionTypes.SET_COMPARISON_INVENTORY_DATA:
      return setComparisonInventoryData(state, action);
    case actionTypes.CLEAR_COMPARISON_DATA:
      return clearComparisonData(state, action);
    case actionTypes.CLEAR_SEARCH_DATA:
      return clearSearchResult(state, action);
    case actionTypes.DELETE_SIMULATION_CONFIGURATION_START:
      return deleteSimulationConfigurationStart(state, action);
    case actionTypes.DELETE_SIMULATION_CONFIGURATION_SUCCESS:
      return deleteSimulationConfigurationSuccess(state, action);
    case actionTypes.DELETE_SIMULATION_CONFIGURATION_FAILURE:
      return deleteSimulationConfigurationFailure(state, action);
    case actionTypes.LOAD_UPLOADED_FILE_STATUS_START:
      return loadUploadedFileStatusStart(state);
    case actionTypes.LOAD_UPLOADED_FILE_STATUS_SUCCESS:
      return loadUploadedFileStatusSuccess(state, action);
    case actionTypes.LOAD_UPLOADED_FILE_STATUS_FAILURE:
      return loadUploadedFileStatusFailure(state, action);
    case actionTypes.SET_BACKSTOCK_SEARCH_RESULT:
      return setBackSTockSearchResult(state, action); 
    case actionTypes.ADD_PLANOGRAM:
      return addPlanogram(state, action);
    case actionTypes.SAVE_NEW_PLANOGRAM_START:
        return saveNewPlanogramStart(state);
    case actionTypes.SAVE_NEW_PLANOGRAM_SUCCESS:
        return saveNewPlanogramSuccess(state, action);
    case actionTypes.SAVE_NEW_PLANOGRAM_FAILURE:
        return saveNewPlanogramFailure(state, action);
    case actionTypes.CHECK_FILE_UPLOAD_TYPE:
      return checkFileUploadType(state, action);
    case actionTypes.DELETE_SELECTED_TEMPLATE_START:
      return deleteSelectedTemplateStart(state, action);
    case actionTypes.DELETE_SELECTED_TEMPLATE_SUCCESS:
      return deleteSelectedTemplateSuccess(state, action);
    case actionTypes.DELETE_SELECTED_TEMPLATE_FAILURE:
      return deleteSelectedTemplateFailure(state, action);
    case actionTypes.SAVE_ASSOCIATE_TEMPLATE_START:
      return saveAssociateTemplateStart(state, action);
    case actionTypes.SAVE_ASSOCIATE_TEMPLATE_SUCCESS:
      return saveAssociateTemplateSuccess(state, action);
    case actionTypes.SAVE_ASSOCIATE_TEMPLATE_FAILURE:
      return saveAssociateTemplateFailure(state, action);      
    default:
      return state;
  }
};

export default reducer;

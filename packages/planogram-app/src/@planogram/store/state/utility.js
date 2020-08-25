import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import moment from 'moment';

const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

const comparisonTableType = {
  STORE: 0,
  BACKSTOCK: 1,
  DISPLAY: 2
};

const inventoryIndicatorColor = {
  RED: '#d32f2f',
  YELLOW: '#FFAB00',
  GREEN: '#43B649',
  NONE: '#ffffff',
  PURPLE:'#800080'
};

const activityType = {
  CONFIGURATION: 0,
  UPLOAD: 1,
  BACK_STOCK: 2,
  SIMULATION: 3,
  COMPARISON: 4,
  TEMPLATE:5
};

const subActivityType = {
  EDIT_CONFIGURATION: 0,
  RUN_SIMULATION: 1,
  SUCCESS_SIMULATION: 2
};

const uploadFileType = {
  CAO: 'cao',
  POS: 'pos'
};

const serviceConfig = [
  [0, 'Before Delivery'],
  [1, 'After Delivery'],
  [2, 'After Sales']
]; // data for sales source

const backStockServiceConfig = [
  [0, 'Before Delivery'],
  [1, 'After Delivery']
]; // data for sales source

const filterBy = [
  [0, 'OOS (Out of Stock)'],
  [1, 'LIS (Low in Stock)'],
  [2, 'OOS+LIS'],
  [3, 'ALL']
]; // data for filter by

const sortBy = [
  [0, 'Sales History'],
  [1, 'Count of selected metrices']
  // [2, 'Date']
]; // data for sort by

const FILTER_TYPE = {
  OUT_OF_STOCK: 0,
  LOW_IN_STOCK: 1,
  LOW_AND_OUTSTOCK: 2,
  ALL_PRODUCTS: 3
};

const SORT_TYPE = {
  SALES_HISTORY: 0,
  SELECTED_METRICES: 1
  // DATE: 2
};

const loadingType = {
  NONE: 0, // Nothing is loading
  CHAINS: 1, // Loading Chains and Stores
  CONFIG: 2, // Loading Config for store
  PLANOGRAMS_FOR_CONFIG: 3, // Loading Planograms for Config
  PLANOGRAM_POS: 4, // Loading POS data
  UPLOAD: 5, // Loading File Upload
  DELETE: 6, // Loading Delete
  SAVE_AS_TEMPLATE: 7, // Save as Template
  GET_TEMPLATE: 8, // Get Template
  SAVE_PLANOGRAM_FOR_POS: 9, //Save planogram for POS
  SAVE_AS_CONFIG: 10, // Save As Configuration
  SAVE_CONFIG: 11, // Save configuration
  SEARCH: 12, //Search Product
  GET_BACKSTOCK: 13, //Get Product for back stock,
  UPDATE_BACKSTOCK: 14, // Update product for back stock
  RUN_SIMULATION: 15, // loading simulation data
  SAVE_SIMULATION_CONFIG: 16,
  FLATTEN_PLANOGRAM_POS: 17,
  SIM_CONFIG_DELETE: 18, // Loading Sim Delete
  LOAD_UPLOADED_FILE_STATUS: 19, // Loading uploaded file status
  TEMPLATE_DELETE: 20, // Loading Template Delete
  ASSOCIATE_TEMPLATE: 21 // Associate Template
};

const statusMessage = {
  LOADING: 'Loading', //Loading
  ERROR: 'Error Occured', //Error
  NONE: '', // Nothing is loading
  CHAINS: '', // Loading Chains and Stores
  CONFIG: '', // Loading Config for store
  PLANOGRAMS_FOR_CONFIG: '', // Loading Planograms for Config
  PLANOGRAM_POS: '', // Loading POS data
  UPLOAD: 'File uploaded successfully', // Loading File Upload
  DELETE: 'Configuration deleted successfully', // Loading Delete
  SAVE_AS_TEMPLATE: 'New Template created successfully', // Save as Template
  GET_TEMPLATE: '', // Get Template
  SAVE_PLANOGRAM_FOR_POS: 'Planogram saved successfully', //Save planogram for POS
  SAVE_AS_CONFIG: 'New Configuration added Successfully', // Save As Configuration
  SAVE_CONFIG: 'Configuration updated Successfully', // Save configuration
  SEARCH: '', //Search Product
  GET_BACKSTOCK: '', //Get Product for back stock,
  UPDATE_BACKSTOCK: 'Back Stock Quantity updated successfully', // Update product for back stock
  RUN_SIMULATION: '',
  SAVE_SIMULATION_CONFIG: 'New Configuration added Successfully',
  SIM_CONFIG_DELETE: 'Configuration deleted successfully',
  TEMPLATE_DELETE: 'Template deleted successfully',
  ASSOCIATE_TEMPLATE: 'Template Associate successfully',
};

const isLoadingChains = (loading, type) => {
  return loading === true && type === loadingType.CHAINS;
};

const isLoadingConfigurationsForStore = (loading, type) => {
  return loading === true && type === loadingType.CONFIG;
};

const isLoadingPlanogramsForConfig = (loading, type) => {
  return (
    loading === true &&
    (type === loadingType.PLANOGRAMS_FOR_CONFIG ||
      type === loadingType.SEARCH ||
      type === loadingType.GET_BACKSTOCK)
  );
};

const isLoadingPosForPlanogram = (loading, type) => {
  return loading === true && type === loadingType.PLANOGRAM_POS;
};

const isLoadingForDeleteConfiguration = (loading, type) => {
  return loading === true && type === loadingType.DELETE;
};

const isLoadingForDeleteSimConfiguration = (loading, type) => {
  return loading === true && type === loadingType.SIM_CONFIG_DELETE;
};

const isLoadingForGetTemplate = (loading, type) => {
  return loading === true && type === loadingType.GET_TEMPLATE;
};

const isLoadingForSaveAsConfiguration = (loading, type) => {
  return loading === true && type === loadingType.SAVE_AS_CONFIG;
};

const isLoadingForSaveAsTemplate = (loading, type) => {
  return loading === true && type === loadingType.SAVE_AS_TEMPLATE;
};

const isLoadingUploadFile = (loading, type) => {
  return loading === true && type === loadingType.UPLOAD;
};

const isLoadingSavePlanogramForPos = (loading, type) => {
  return loading === true && type === loadingType.SAVE_PLANOGRAM_FOR_POS;
};

const isLoadingForSearchProduct = (loading, type) => {
  return loading === true && type === loadingType.SEARCH;
};
const isLoadingForSaveConfiguration = (loading, type) => {
  return loading === true && type === loadingType.SAVE_CONFIG;
};

const isLoadingForGetProductForBackStock = (loading, type) => {
  return loading === true && type === loadingType.GET_BACKSTOCK;
};

const isLoadingForUpdateProductForBackStock = (loading, type) => {
  return loading === true && type === loadingType.UPDATE_BACKSTOCK;
};

const isLoadingForRunSimulation = (runSimulation) => {
  return runSimulation === true;
};

const isLoadingUploadedFileStatus = (loading, type) => {
  return loading === true && type === loadingType.LOAD_UPLOADED_FILE_STATUS;
};

const isLoadingTemplateDelete = (loading, type) => {
  return loading === true && type === loadingType.TEMPLATE_DELETE;
};

const isLoadingAssociateTemplate = (loading, type) => {
  return loading === true && type === loadingType.ASSOCIATE_TEMPLATE;
};

const isSuccessForGetTemplate = (success, type) => {
  return success === true && type === loadingType.GET_TEMPLATE;
};

const isSuccessForSaveAsTemplate = (success, type) => {
  return success === true && type === loadingType.SAVE_AS_TEMPLATE;
};

const isSuccessForDeleteConfiguration = (success, type) => {
  return success === true && type === loadingType.DELETE;
};

const isSuccessForTemplateDelete = (success, type) => {
  return success === true && type === loadingType.TEMPLATE_DELETE;
};

const isSuccessForUploadFile = (success, type) => {
  return success === true && type === loadingType.UPLOAD;
};

const isSuccessForSaveAsConfiguration = (success, type) => {
  return success === true && type === loadingType.SAVE_AS_CONFIG;
};

const isSuccessForSaveConfiguration = (success, type) => {
  return success === true && type === loadingType.SAVE_CONFIG;
};

const isSuccessForSavePlanogramForPos = (success, type) => {
  return success === true && type === loadingType.SAVE_PLANOGRAM_FOR_POS;
};

const isSuccessForSeachProduct = (success, type) => {
  return success === true && type === loadingType.SEARCH;
};

const isSuccessForGetProductForBackStock = (success, type) => {
  return success === true && type === loadingType.GET_BACKSTOCK;
};

const isSuccessForUpdateProductForBackStock = (success, type) => {
  return success === true && type === loadingType.UPDATE_BACKSTOCK;
};

const isSuccesForPlanogramsForConfig = (success, type) => {
  return (
    success === true &&
    (type === loadingType.PLANOGRAMS_FOR_CONFIG ||
      type === loadingType.SEARCH ||
      type === loadingType.GET_BACKSTOCK)
  );
};

const isLoadingForSaveSimulationConfiguration = (success, type) => {
  return success === true && type === loadingType.SAVE_SIMULATION_CONFIG;
};

const isSuccessForSaveSimulationConfiguration = (success, type) => {
  return success === true && type === loadingType.SAVE_SIMULATION_CONFIG;
};

const isSuccessForRunSimulation = (runSimulationPass) => {
  return runSimulationPass === true;
};

const getOptimizedImage = (content, originalName) => {
  let result = content.find((item) => item.fluid.originalName === originalName);
  if (typeof result === 'undefined') {
    result = content.find((item) => item.fluid.originalName === '00000.jpg');
  }
  return result;
};

// const formatDate = (date) => {
//   var d = new Date(date),
//     month = '' + (d.getMonth() + 1),
//     day = '' + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = '0' + month;
//   if (day.length < 2) day = '0' + day;

//   return [month, day, year].join('/');
// };

const formatDate = (date) => moment.utc(date).format('MM/DD/YYYY');

const isLater = (toDt, fromDt) => {
  return new Date(toDt) >= new Date(fromDt);
};

// generating xl and json file for simulation
const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const jsonFileMimeType = 'application/json;charset=utf-8;';
const fileExtension = '.xlsx';

const makeSimDtReadable = (outArr) => {
  const dOut = [...outArr];
  const newDOut = [];
  for (let i = 0; i < dOut.length; i++)
    newDOut.push({
      ...dOut[i],
      simulationDate: moment.utc(dOut[i].simulationDate).format('MM/DD/YYYY'),
      scheduledDeliveryDate: moment.utc(dOut[i].scheduledDeliveryDate).format('MM/DD/YYYY')
    });

  return newDOut;
};

async function exportToXLS(runResponse, fileName) {
  const firstTab = XLSX.utils.json_to_sheet(
    makeSimDtReadable(runResponse.displayOutput)
  );
  const secondTab = XLSX.utils.json_to_sheet(
    makeSimDtReadable(runResponse.storeOutput)
  );
  const wb = {
    Sheets: { displayOutput: firstTab, storeOutput: secondTab },
    SheetNames: ['displayOutput', 'storeOutput']
  };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  await FileSaver.saveAs(data, fileName + fileExtension);
  const JSONData = {
    displayOutput: runResponse.displayOutput,
    storeOutput: runResponse.storeOutput
  };
  await exportJSON(JSONData, fileName);
}
async function exportJSON(data, fileName) {
  await FileSaver.saveAs(
    new Blob([JSON.stringify(data)], { type: jsonFileMimeType }),
    fileName + '.json'
  );
}

const myFlat = (data) => {
  return data.reduce((acc, val) => acc.concat(val), []);
};

const CONFIG_TYPE = {
  BEFORE_SERVICES: 0,
  AFTER_SERVICES: 1,
  AFTER_SALES: 2
};

const INVENTORY_TYPE = {
  GREEN: 0,
  YELLOW: 1,
  RED: 2
};

const getTotalHoldingPower = (data) => {
  const { displayOutput, storeOutput } = data;
  displayOutput.map((item, key) => {
    for (let c of storeOutput) {
      if(c.bdc === item.bdc && c.simulationDate === item.simulationDate && c.upc === item.upc){
        data.displayOutput[key].displayTotalHoldingPower = c.displayTotalHoldingPower;
      }
    }
  })
  return data;
}
const getSimulationData = (data) => {
  let totalBDCGreen = 0;
  let fullAllBDC = [];
  let fullAllBDCServiceCount = 0;
  const { pogID, dateFilter, simulateData, posData, serviceConfigType } = data;
  const displayOutput = simulateData;
  const masterData = displayOutput.filter(
    (item) =>
      item.pogId === pogID &&
      item.simulationDate === dateFilter &&
      item.upc.startsWith('0028400')
  );
  const filteredPosData = posData.filter((item) =>
    item.upc.startsWith('0028400')
  );
  // Lodash – calculate total BDC – record count (Assuming there is now repetition of BDC) - Total no. of all UPC whose Inventory Flag is 0, 1, 2) -> TOTAL_BDC_FOR_POG_FOR_DATE
  if (serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
    totalBDCGreen = masterData.filter(
      (item) => item.inventoryFlagBeforeDelivery === INVENTORY_TYPE.GREEN
    );
  }
  if (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
    totalBDCGreen = masterData.filter(
      (item) => item.inventoryFlagAfterDelivery === INVENTORY_TYPE.GREEN
    );
  }
  if (serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
    totalBDCGreen = masterData.filter(
      (item) => item.inventoryFlagAfterSales === INVENTORY_TYPE.GREEN
    );
  }
  const totalBDCGreenCount = totalBDCGreen.length;
  const totalBDC = masterData.length;
  const inStockSKUPercent = (totalBDCGreenCount / totalBDC) * 100;

  // For a BDC -> Get all BDCs from pos data for the given configuration (Planogram (Visual part) , actual POS data (API))
  // Take the Actual POS data and group by BDC and get count -> Key , Value pair – BDC, count -> BDC_WISE_COUNT For example: 011 : 2 , 012: 1
  const posBDCs = filteredPosData.map((item) => {
    return {
      bdc: item.bdc,
      Y: item.Y,
      X: item.X,
      availableQty: item.availableQty,
      units: item.units,
      upc: item.upc,
      yFacings: item.yFacings
    };
  });
  // Group by BDC
  const bdcGroupBy = _.groupBy(filteredPosData, (item) => item.bdc);
  const totalHoldingPowerBDC = [];
  Object.entries(bdcGroupBy).map(([key, values]) => {
    const bdcHoldingPower = values.reduce((cnt, o) => cnt + o.units, 0);
    const bdcHoldingPowerCount = values.reduce(cnt =>  cnt + 1, 0);

    totalHoldingPowerBDC.push({ bdc: key, holdingPower: bdcHoldingPower, holdingPowerCount: bdcHoldingPowerCount});
  });

  const posBDC_Count = _.countBy(posBDCs, function(rec) {
    return rec.bdc;
  });
  const holdingPower = posBDCs.reduce(function(cnt, o) {
    return cnt + o.units;
  }, 0);
  const fullBDCGreen = totalBDCGreen.map((item) => {
    return {
      bdc: item.bdc,
      count: posBDC_Count[item.bdc]
    };
  });
  if (serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
    fullAllBDC = masterData.map((item) => {
      return {
        ...item,
        bdc: item.bdc,
        count: posBDC_Count[item.bdc],
        inventoryFlag: item.inventoryFlagBeforeDelivery,
        facings: posBDC_Count[item.bdc],
        displayQtyBeforeRepServiceFacings: item.displayQtyBeforeRepService,
        displayQtyAfterSalesFacings: item.displayQtyAfterSales,
        displayQtyAfterRepServiceFacings: item.displayQtyAfterRepService
      };
    });
    Object.entries(fullAllBDC).map(([key, value]) => {
      fullAllBDCServiceCount += value.displayQtyBeforeRepServiceFacings;
    });
  }
  if (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
    fullAllBDC = masterData.map((item) => {
      return {
        ...item,
        bdc: item.bdc,
        count: posBDC_Count[item.bdc],
        inventoryFlag: item.inventoryFlagAfterDelivery,
        facings: posBDC_Count[item.bdc],
        displayQtyBeforeRepServiceFacings: item.displayQtyBeforeRepService,
        displayQtyAfterSalesFacings: item.displayQtyAfterSales,
        displayQtyAfterRepServiceFacings: item.displayQtyAfterRepService
      };
    });
    Object.entries(fullAllBDC).map(([key, value]) => {
      fullAllBDCServiceCount += value.displayQtyAfterRepServiceFacings;
    });
  }
  if (serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
    fullAllBDC = masterData.map((item) => {
      return {
        ...item,
        bdc: item.bdc,
        count: posBDC_Count[item.bdc],
        inventoryFlag: item.inventoryFlagAfterSales,
        facings: posBDC_Count[item.bdc],
        displayQtyBeforeRepServiceFacings: item.displayQtyBeforeRepService,
        displayQtyAfterSalesFacings: item.displayQtyAfterSales,
        displayQtyAfterRepServiceFacings: item.displayQtyAfterRepService
      };
    });
    Object.entries(fullAllBDC).map(([key, value]) => {
      fullAllBDCServiceCount += value.displayQtyAfterSalesFacings;
    });
  }
  let fullAllBDCCount = 0;
  Object.entries(fullAllBDC).map(([key, value]) => {
    fullAllBDCCount += value.count;
  });
  let fullBDCGreenCount = 0;
  Object.entries(fullBDCGreen).map(([key, value]) => {
    fullBDCGreenCount += value.count;
  });
  const inStockFacingPercent = (fullBDCGreenCount / fullAllBDCCount) * 100;
  const fullnessPercent = (fullAllBDCServiceCount / holdingPower) * 100;
  return {
    posBDC_Count,
    masterData,
    totalBDC,
    fullAllBDC,
    inStockSKUPercent,
    inStockFacingPercent,
    fullnessPercent,
    fullAllBDCServiceCount,
    holdingPower,
    totalHoldingPowerBDC
  };
};

//comparison tabele starts

let keyObject = {
  cellValue: null,
  cellIndicator: null
};

let masterDataForComparison = [];

const serviceType = {
  BEFORE_DELIVERY: 0,
  AFTER_DELIVERY: 1,
  AFTER_SALES: 2
};

const setKeysForServiceDropDown = (serviceDropdown) => {
  switch (serviceDropdown) {
    case CONFIG_TYPE.BEFORE_SERVICES:
      return {
        cellValue: 'backStockBegin',
        cellValue2: 'displayQtyBeforeRepService',
        cellIndicator: 'inventoryFlagBeforeDelivery'
      };
    case CONFIG_TYPE.AFTER_SERVICES:
      return {
        cellValue: 'backStockAfterRepService',
        cellValue2: 'displayQtyAfterRepService',
        cellIndicator: 'inventoryFlagAfterDelivery'
      };
    case CONFIG_TYPE.AFTER_SALES:
      return {
        cellValue: 'backStockAfterRepService',
        cellValue2: 'displayQtyAfterSales',
        cellIndicator: 'inventoryFlagAfterSales'
      };
    default:
      return {
        cellValue: 'backStockAfterRepService',
        cellValue2: 'displayQtyBeforeRepService',
        cellIndicator: 'inventoryFlagBeforeDelivery'
      };
  }
};

const cellColor = (value) => {
  switch (value) {
    case 0:
      return inventoryIndicatorColor.GREEN;
    case 1:
      return inventoryIndicatorColor.YELLOW;
    case 2:
      return inventoryIndicatorColor.RED;
    default:
      return inventoryIndicatorColor.NONE;
  }
};

const cellsData = (combineCompareData, keyObject) => {
  let storeData = [];
  _.forEach(combineCompareData, function(item) {
    storeData.push({
      ...item,
      backStockCellValue: item[keyObject.cellValue],
      storeCellValue: item[keyObject.cellValue] + item[keyObject.cellValue2],
      cellIndicator: cellColor(item[keyObject.cellIndicator])
    });
  });
  return storeData;
};

const mapComparisonData = (storeOutput, searchData, uploadType) => {
  let combineCompareData = [];
  _.forEach(storeOutput, function(item, key) {
    _.forEach(searchData, function(item2, key2) {
      let size = item2.sizename ? item2.sizename : null;
      if (item.bdc === item2.bdc) {
        combineCompareData.push({
          ...item,
          formattedSimDate: moment(item.simulationDate).format('MM/DD/YYYY'),
          category: item2.category,
          uploadType,
          categoryBDC: `${item.upc}-${item2.description} ${size}-${uploadType}`,
          combineName: `${item2.category} ${item2.description} ${item2.sizename}`,
          description: item2.description,
          bdc:item.bdc,
          rowName:`${item2.description} ${item2.sizename?item2.sizename:""}`,
        });
      }
    });
  });
  return combineCompareData;
};


const indexData =(data)=>{
  switch (data) {
    case "SIM1":
      return 1;
    case "SIM2":
      return 2;
    case "SIM3":
      return 3;
    default:
      return 0;
  }

}

const tableFormat = (
  combineCompareData,
  currentKeys,
  uploadType,
  cellKey,
  tableType,
  groupedDate
) => {
  let result = cellsData(combineCompareData, currentKeys);
  let groupyByBDC = _.groupBy(result, (item) => item.categoryBDC);
  // let groupyByDate = Object.keys(
  //   _.groupBy(result, (item) => item.simulationDate)
  // );
  //let lengthArr = [];
  //lengthArr.push(_.uniq(groupyByDate))
  const gridData = [];
  let indexRow = indexData(uploadType)
  

  Object.entries(groupyByBDC).map(([key, values]) => {
   
    const bdcList = [];
    bdcList.push({
      productName: values[0].rowName,
      simulation: uploadType,
      fixedCell: values[0].bdc,
      header: 'Product',
      indexRow:indexRow,
      className:"load-type-"+indexRow

    });
   // lengthArr.push(values.length);
    /*     values.forEach((item) => {
      bdcList.push({
        storeCellValue: item[cellKey],
        header: item.formattedSimDate,
        bdc: item.bdc,
        upc: item.upc,
        currentKeys: currentKeys,
        combineName: item.combineName,
        simulationDate: item.simulationDate,
        displayQtyBeforeRepService: item.displayQtyBeforeRepService,
        displayQtyAfterSales: item.displayQtyAfterSales,
        displayQtyAfterRepService: item.displayQtyAfterRepService,
        displayTotalHoldingPower: item.displayTotalHoldingPower,
        cellColor:
          tableType === comparisonTableType.BACKSTOCK
            ? '#ffff'
            : item.cellIndicator
      });
    }); */

    groupedDate.forEach((simDate) => {
      const item = values.find(
        (val) => val.simulationDate === parseInt(simDate)
      );
      if (typeof item === 'undefined') {
        bdcList.push({
          storeCellValue: '-',
          header: moment.utc(parseInt(simDate)).format('MM/DD/YYYY'),
          deliveryFlag: ' ',
          bdc: '',
          upc: '',
          currentKeys: '',
          combineName: '',
          simulationDate: parseInt(simDate),
          displayQtyBeforeRepService: 0,
          displayQtyAfterSales: 0,
          displayQtyAfterRepService: 0,
          displayTotalHoldingPower: 0,
          cellColor: '#e0e0e0'
        });
      } else {
        bdcList.push({
          storeCellValue: item[cellKey],
          //header: item.formattedSimDate,
          header: moment.utc(parseInt(simDate)).format('MM/DD/YYYY'),
          deliveryFlag: item.deliveryFlag,
          bdc: item.bdc,
          upc: item.upc,
          currentKeys: currentKeys,
          combineName: item.combineName,
          simulationDate: item.simulationDate,
          displayQtyBeforeRepService: item.displayQtyBeforeRepService,
          displayQtyAfterSales: item.displayQtyAfterSales,
          displayQtyAfterRepService: item.displayQtyAfterRepService,
          displayTotalHoldingPower: item.displayTotalHoldingPower,
          productName: item.category,
          cellColor:
            tableType === comparisonTableType.BACKSTOCK
              ? '#ffff'
              : item.cellIndicator
        });
      }
    });
    gridData.push(bdcList);
  });

 // length = Math.max(...lengthArr);
  masterDataForComparison.push({
    uploadType,
    data: gridData
  });

};

const tableResult = (masterDataForComparison, dataLength) => {
  const finalResult = [];
  let tempArr =[];
  let orderArr=[];
  let finalArr=[];
  let lengthArr =[];
  let length=0;
 // let uploadFileType =[];

  // Object.entries(masterDataForComparison).map(([key, values]) => {
  //   console.log("key, values",key, values)
  //   uploadFileType.push(key.uploadType);
  // })

 // let tempLength = Math.max(...lengthArr); 
  const l = masterDataForComparison[0].data.length;
  //let length = masterDataForComparison[0].colLength;
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < masterDataForComparison.length; j++) {
      finalResult.push(masterDataForComparison[j].data[i]);
    }
  }
  for (let j = 0; j < masterDataForComparison.length; j++) {
    finalResult.push(...masterDataForComparison[j].data.slice(l));
  }
if(dataLength > 1){
  finalResult.map((value,index) => {
    
    if(!value){
      return
    }
      let bdc= value[0]['fixedCell'];
      let index1= value[0]['indexRow'];
      tempArr.push({bdc,value,index1})
      orderArr = _.orderBy(tempArr, ['bdc','index1'], ['asc','asc']);
  })
  _.forEach(orderArr, function(item) {
    finalArr.push(item.value);
    lengthArr.push(item.value.length);
  }); 
  length = Math.max(...lengthArr); 
  return { data: finalArr, length: l, colLength: length };
} else {
  return { data: finalResult, length: l, colLength: (finalResult[0] && finalResult[0].length) };
}
};

const comparisonDataTransform = (data) => {
  masterDataForComparison.splice(0, masterDataForComparison.length);
  let filteredDates = [];
  let finalDateArray = [];

  const { comparisonData, searchData, tableType, serviceDropdown } = data;
  //// INPUTS - START
  // const serviceDropdown = 0;
  ///// INPUTS - END
  let cellKey =
    tableType === comparisonTableType.STORE
      ? 'storeCellValue'
      : 'backStockCellValue';
  const currentKeys = setKeysForServiceDropDown(parseInt(serviceDropdown));

  let mergedDate = [];
  comparisonData.forEach((simulation) => {
      let previewJson = getTotalHoldingPower(simulation.previewJson);
      let { uploadType } = simulation;
      let { storeOutput } = previewJson;
      let combineCompareData = [];
      combineCompareData = mapComparisonData(storeOutput, searchData, uploadType);
      let result = cellsData(combineCompareData, currentKeys);
      let groupyByDate2 = Object.keys(
      _.groupBy(result, (item) => item.simulationDate)
      );
    mergedDate.push(groupyByDate2);
});

 var groupedDate = _.uniqWith([].concat.apply([], mergedDate), _.isEqual).sort();

  comparisonData.forEach((simulation) => {
    const previewJson = getTotalHoldingPower(simulation.previewJson);
    const { uploadType } = simulation;
    const { storeOutput } = previewJson;

    //const storeOutputBdc = _.uniq(_.map(storeOutput, myFun));

    let filteredFlag = storeOutput.filter((item) => item.deliveryFlag === 1);
    finalDateArray.push(_.uniq(_.map(filteredFlag, 'simulationDate')));
    let combineCompareData = [];

    combineCompareData = mapComparisonData(storeOutput, searchData, uploadType);
    console.log('date1', groupedDate);
    tableFormat(
      combineCompareData,
      currentKeys,
      uploadType,
      cellKey,
      tableType,
      groupedDate
    );
  });

  filteredDates.push(_.uniq(...finalDateArray));
  let result = tableResult(masterDataForComparison, comparisonData.length);
  return { ...result, filteredDates };
};

const comparisonDataTransformForDisplay = (data) => {
  let filteredDates = [];
  let finalDateArray = [];
  const { comparisonData, searchData, pogID, serviceDropdown } = data;
  let cellKey = null;
  let tableType = 'display';
  masterDataForComparison.splice(0, masterDataForComparison.length);
  const currentKeys = setKeysForServiceDropDown(serviceDropdown);
  let mergedDate = [];
  comparisonData.forEach((simulation) => {
      let previewJson = getTotalHoldingPower(simulation.previewJson);
      let { uploadType } = simulation;
      let { storeOutput } = previewJson;
      let combineCompareData = [];
      combineCompareData = mapComparisonData(storeOutput, searchData, uploadType);
      let result = cellsData(combineCompareData, currentKeys);
      let groupyByDate2 = Object.keys(
      _.groupBy(result, (item) => item.simulationDate)
      );
    mergedDate.push(groupyByDate2);
});

 var groupedDate = _.uniqWith([].concat.apply([], mergedDate), _.isEqual).sort();
  comparisonData.forEach((simulation) => {
    const { uploadType } = simulation;
    const previewJson = getTotalHoldingPower(simulation.previewJson);
    const { displayOutput } = previewJson;

    let filteredFlag = displayOutput.filter((item) => item.deliveryFlag === 1);
    finalDateArray.push(_.uniq(_.map(filteredFlag, 'simulationDate')));

    let filterByPogID = displayOutput.filter((item) => item.pogId === pogID);

    let combineCompareData = [];

    combineCompareData = mapComparisonData(
      filterByPogID,
      searchData,
      uploadType
    );
    tableFormat(
      combineCompareData,
      currentKeys,
      uploadType,
      cellKey,
      tableType,
      groupedDate
    );
  });
 
  filteredDates.push(_.uniq(...finalDateArray));
  let result = tableResult(masterDataForComparison, comparisonData.length);

  return { ...result, filteredDates };
};
//comparison table end

const filterResponse = (comparisonData, displayOutputObj, storeOutputObj) => {
  const displayOutputBdc = _.uniq(_.map(displayOutputObj, 'bdc'));
  const storeOutputBdc = _.uniq(_.map(storeOutputObj, 'bdc'));
  let displayArray = [];
  let storeArray = [];
  displayOutputBdc.forEach((item) => {
    let displayOutputFilter = comparisonData.displayOutput.filter(
      (obj) => obj.bdc === item
    );
    let outOfStockOutput = displayOutputObj.filter((obj) => obj.bdc === item);
    displayOutputFilter.forEach((value) => {
      value.countStatus = outOfStockOutput.length;
      displayArray.push(value);
    });
  });
  storeOutputBdc.forEach((item) => {
    let storeOutputFilter = comparisonData.storeOutput.filter(
      (obj) => obj.bdc === item
    );
    let outOfStockOutput = storeOutputObj.filter((obj) => obj.bdc === item);
    let sumSalesQty = _.sumBy(outOfStockOutput, 'salesQty');
    storeOutputFilter.forEach((value) => {
      value.totalSalesQty = sumSalesQty;
      value.countStatus = outOfStockOutput.length;
      storeArray.push(value);
    });
  });
  return { displayArray, storeArray };
};

const getFilteredData = (
  currentComparison,
  filterById,
  sortById,
  compareById
) => {
  let displayOutput = null;
  let storeOutput = null;
  let displayOutputObj = null;
  let storeOutputObj = null;
  let filteredData = [];
  let comparisonData = currentComparison.comparisonData[0].previewJson;
  switch (compareById) {
    case CONFIG_TYPE.BEFORE_SERVICES:
      if (filterById === FILTER_TYPE.OUT_OF_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagBeforeDelivery === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagBeforeDelivery === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_IN_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagBeforeDelivery === 1
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagBeforeDelivery === 1
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_AND_OUTSTOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagBeforeDelivery === 1 ||
            item.inventoryFlagBeforeDelivery === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagBeforeDelivery === 1 ||
            item.inventoryFlagBeforeDelivery === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.ALL_PRODUCTS) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagBeforeDelivery === 1 ||
            item.inventoryFlagBeforeDelivery === 2 ||
            item.inventoryFlagBeforeDelivery === 0
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagBeforeDelivery === 1 ||
            item.inventoryFlagBeforeDelivery === 2 ||
            item.inventoryFlagBeforeDelivery === 0
        );
      }
      const { displayArray, storeArray } = filterResponse(
        comparisonData,
        displayOutputObj,
        storeOutputObj
      );
      displayOutput = displayArray;
      storeOutput = storeArray;
      break;
    case CONFIG_TYPE.AFTER_SERVICES:
      if (filterById === FILTER_TYPE.OUT_OF_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagAfterDelivery === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagAfterDelivery === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_IN_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagAfterDelivery === 1
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagAfterDelivery === 1
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_AND_OUTSTOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagAfterDelivery === 1 ||
            item.inventoryFlagAfterDelivery === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagAfterDelivery === 1 ||
            item.inventoryFlagAfterDelivery === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.ALL_PRODUCTS) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagAfterDelivery === 1 ||
            item.inventoryFlagAfterDelivery === 2 ||
            item.inventoryFlagAfterDelivery === 0
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagAfterDelivery === 1 ||
            item.inventoryFlagAfterDelivery === 2 ||
            item.inventoryFlagAfterDelivery === 0
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      }
      break;
    case CONFIG_TYPE.AFTER_SALES:
      if (filterById === FILTER_TYPE.OUT_OF_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagAfterSales === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagAfterSales === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_IN_STOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) => item.inventoryFlagAfterSales === 1
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) => item.inventoryFlagAfterSales === 1
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.LOW_AND_OUTSTOCK) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagAfterSales === 1 ||
            item.inventoryFlagAfterSales === 2
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagAfterSales === 1 ||
            item.inventoryFlagAfterSales === 2
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      } else if (filterById === FILTER_TYPE.ALL_PRODUCTS) {
        displayOutputObj = comparisonData.displayOutput.filter(
          (item) =>
            item.inventoryFlagAfterSales === 1 ||
            item.inventoryFlagAfterSales === 2 ||
            item.inventoryFlagAfterSales === 0
        );
        storeOutputObj = comparisonData.storeOutput.filter(
          (item) =>
            item.inventoryFlagAfterSales === 1 ||
            item.inventoryFlagAfterSales === 2 ||
            item.inventoryFlagAfterSales === 0
        );
        const { displayArray, storeArray } = filterResponse(
          comparisonData,
          displayOutputObj,
          storeOutputObj
        );
        displayOutput = displayArray;
        storeOutput = storeArray;
      }
    default:
  }
  if (sortById === SORT_TYPE.SALES_HISTORY) {
    storeOutput = _.orderBy(storeOutput, ['totalSalesQty'], ['desc']);
  } else if (sortById === SORT_TYPE.SELECTED_METRICES) {
    displayOutput = _.orderBy(displayOutput, ['countStatus'], ['desc']);
    storeOutput = _.orderBy(storeOutput, ['countStatus'], ['desc']);
  }

  let previewJson = { displayOutput, storeOutput };
  let uploadType = currentComparison.comparisonData[0].uploadType;
  filteredData.push({ uploadType, previewJson });
  return filteredData;
};

const DynamicTabs = (data) => {
  let previewJsonData = _.map(_.map(data, 'previewJson'), 'displayOutput');
  let pogsArray = [];
  previewJsonData.forEach((item) => {
    let UniquePogs = _.uniqWith(
      _.map(item, ({ pogId, locationCode }) => ({ pogId, locationCode })),
      _.isEqual
    );
    pogsArray.push(UniquePogs);
  });
  const mergedPogs = _.uniqWith([].concat.apply([], pogsArray), _.isEqual);
  return [{ pogId: 'Store', locationCode: 'STORE' }]
    .concat(mergedPogs)
    .concat([{ pogId: 'backstock', locationCode: 'BACKSTOCK' }]);
};

const simSuggestionData = (data) => {
  const suggestionData = [];
  _.forEach(data, function(value) {
    suggestionData.push({ id: value.id, simName: value.simconfigName });
  });
  _.remove(suggestionData, function(value) {
    return value.id === 'No_Config_Selected';
  });
  return suggestionData;
};

const exportCompareToXLS = async (comparisonData, fileName) => {
  let simDispOutput;
  let simStoreOutput;

  if (comparisonData.length > 0) {
    simDispOutput = [
      ...comparisonData[0].previewJson.displayOutput
    ].map((obj) => ({ simulation: comparisonData[0].uploadType, ...obj }));
    simStoreOutput = [
      ...comparisonData[0].previewJson.storeOutput
    ].map((obj) => ({ simulation: comparisonData[0].uploadType, ...obj }));

    if (comparisonData.length > 1) {
      const sim2DispData = [
        ...comparisonData[1].previewJson.displayOutput
      ].map((obj) => ({ simulation: comparisonData[1].uploadType, ...obj }));
      const sim2StoreData = [
        ...comparisonData[1].previewJson.storeOutput
      ].map((obj) => ({ simulation: comparisonData[1].uploadType, ...obj }));
      simDispOutput = [...simDispOutput, ...sim2DispData];
      simStoreOutput = [...simStoreOutput, ...sim2StoreData];

      if (comparisonData.length === 3) {
        const sim3DispData = [
          ...comparisonData[2].previewJson.displayOutput
        ].map((obj) => ({ simulation: comparisonData[2].uploadType, ...obj }));
        const sim3StoreData = [
          ...comparisonData[2].previewJson.storeOutput
        ].map((obj) => ({ simulation: comparisonData[2].uploadType, ...obj }));
        simDispOutput = [...simDispOutput, ...sim3DispData];
        simStoreOutput = [...simStoreOutput, ...sim3StoreData];
      }
    }
    const firstTab = XLSX.utils.json_to_sheet(makeSimDtReadable(simDispOutput));
    const secondTab = XLSX.utils.json_to_sheet(
      makeSimDtReadable(simStoreOutput)
    );
    const wb = {
      Sheets: { displayOutput: firstTab, storeOutput: secondTab },
      SheetNames: ['displayOutput', 'storeOutput']
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    await FileSaver.saveAs(data, fileName + fileExtension);
  } //end comparisonData.length > 0
};

export {
  getOptimizedImage,
  updateObject,
  activityType,
  subActivityType,
  loadingType,
  statusMessage,
  uploadFileType,
  isLoadingChains,
  isLoadingConfigurationsForStore,
  isLoadingPlanogramsForConfig,
  isLoadingPosForPlanogram,
  isLoadingForDeleteConfiguration,
  isLoadingForGetTemplate,
  isLoadingForSaveAsTemplate,
  isLoadingUploadFile,
  isLoadingSavePlanogramForPos,
  isLoadingForSaveAsConfiguration,
  isLoadingForSearchProduct,
  isLoadingForGetProductForBackStock,
  isLoadingForUpdateProductForBackStock,
  isLoadingForRunSimulation,
  isLoadingForSaveSimulationConfiguration,
  isLoadingTemplateDelete,
  isLoadingAssociateTemplate,
  isSuccessForGetTemplate,
  isSuccessForSaveAsTemplate,
  isSuccessForDeleteConfiguration,
  isSuccessForUploadFile,
  isLoadingForSaveConfiguration,
  isSuccessForSaveConfiguration,
  isSuccessForSaveAsConfiguration,
  isSuccessForSavePlanogramForPos,
  isSuccessForSeachProduct,
  isSuccessForGetProductForBackStock,
  isSuccessForUpdateProductForBackStock,
  isSuccesForPlanogramsForConfig,
  isSuccessForSaveSimulationConfiguration,
  isSuccessForRunSimulation,
  isSuccessForTemplateDelete,
  exportToXLS,
  formatDate,
  isLater,
  getSimulationData,
  serviceConfig,
  CONFIG_TYPE,
  comparisonTableType,
  inventoryIndicatorColor,
  comparisonDataTransform,
  comparisonDataTransformForDisplay,
  filterBy,
  sortBy,
  getFilteredData,
  DynamicTabs,
  exportCompareToXLS,
  isLoadingForDeleteSimConfiguration,
  simSuggestionData,
  isLoadingUploadedFileStatus,
  getTotalHoldingPower,
  backStockServiceConfig,
};

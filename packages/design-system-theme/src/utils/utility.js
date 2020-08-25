
/* eslint-disable import/prefer-default-export */
import * as _ from 'lodash'
import posData from '../data/planogram-pos.json'
import simulateData from '../data/simulation-run-response.json'
import searchData from '../data/search-data.json'
// import posData from '../data/planogram-pos.json'
// import simulateData from '../data/simulation-run-response.json'

const myFlat = data => {
	return data.reduce((acc, val) => acc.concat(val), [])
}

const CONFIG_TYPE = {
	BEFORE_SERVICES: 0,
	AFTER_SERVICES: 1,
	AFTER_SALES: 2,
}

const INVENTORY_TYPE = {
	GREEN: 0,
	YELLOW: 1,
	RED: 2,
}

const getSimulationData = data => {
	let totalBDCGreen = 0
	let fullAllBDC = []
	let fullAllBDCServiceCount = 0
	// let fullAllBDCBeforeServiceCount = 0
	// let fullAllBDCAfterRepServiceCount = 0
	// let fullAllBDCAfterSalesCount = 0
	// console.log('data', data)

	const { pogID, dateFilter, simulateData, posData, serviceConfigType } = data
	const displayOutput = simulateData
	// console.log('pogID', pogID)
	// console.log('displayOutput', displayOutput)

	// Attribute which will be passed
	// const pogID = 'pog_1'
	// const dateFilter = 1564617600000

	// const filterType = CONFIG_TYPE.AFTER_SALES;

	// Simulation display output
	// const { displayOutput } = simulateData
	// Filter by POGID & Filter by Date & Filter by (BEFORE|AFTER|BEFORE REP) -> MASTER
	const masterData = displayOutput.filter(
		item => item.pogId === pogID && item.simulationDate === dateFilter
	)
	// console.log('masterData', masterData)
	// Lodash – calculate total BDC – record count (Assuming there is now repetition of BDC) - Total no. of all UPC whose Inventory Flag is 0, 1, 2) -> TOTAL_BDC_FOR_POG_FOR_DATE
	if (serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
		totalBDCGreen = masterData.filter(
			item => item.inventoryFlagBeforeDelivery === INVENTORY_TYPE.GREEN
		)
	}
	if (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
		totalBDCGreen = masterData.filter(
			item => item.inventoryFlagAfterDelivery === INVENTORY_TYPE.GREEN
		)
	}
	if (serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
		totalBDCGreen = masterData.filter(
			item => item.inventoryFlagAfterSales === INVENTORY_TYPE.GREEN
		)
	}
	console.log('totalBDCGreen', totalBDCGreen)
	const totalBDCGreenCount = totalBDCGreen.length

	const totalBDC = masterData.length
	const inStockSKUPercent = (totalBDCGreenCount / totalBDC) * 100

	// For a BDC -> Get all BDCs from pos data for the given configuration (Planogram (Visual part) , actual POS data (API))
	// Take the Actual POS data and group by BDC and get count -> Key , Value pair – BDC, count -> BDC_WISE_COUNT For example: 011 : 2 , 012: 1
	const posBDCs = posData.map(item => {
		return {
			bdc: item.bdc,
			count: item.bdc.length,
			Y: item.Y,
			X: item.X,
			availableQty: item.availableQty,
			units: item.units,
			upc: item.upc,
			yFacings: item.yFacings,
		}
	})
	// console.log('posData', posData)
	// console.log('posBDCs', posBDCs)
	const posBDC_Count = _.countBy(posBDCs, function(rec) {
		return rec.bdc
	})
	console.log('posBDC_Count', posBDC_Count)
	const holdingPower = posBDCs.reduce(function(cnt, o) {
		return cnt + o.units
	}, 0)
	console.log('holdingPower', holdingPower);
	const fullBDCGreen = totalBDCGreen.map(item => {
		console.log('item', item)
		console.log('item.bdc', item.bdc)
		console.log('posBDC_Count[bdc]', posBDC_Count[item.bdc])
		return {
			bdc: item.bdc,
			count: posBDC_Count[item.bdc],
		}
	})

	console.log('fullBDCGreen', fullBDCGreen)
	if (serviceConfigType === CONFIG_TYPE.BEFORE_SERVICES) {
		fullAllBDC = masterData.map(item => {
			return {
				...item,
				bdc: item.bdc,
				count: posBDC_Count[item.bdc],
				inventoryFlag: item.inventoryFlagBeforeDelivery,
				facings: posBDC_Count[item.bdc],
				displayQtyBeforeRepServiceFacings:
					item.displayQtyBeforeRepService * posBDC_Count[item.bdc],
				displayQtyAfterSalesFacings:
					item.displayQtyAfterSales * posBDC_Count[item.bdc],
				displayQtyAfterRepServiceFacings:
					item.displayQtyAfterRepService * posBDC_Count[item.bdc],
			}
		})
		
		Object.entries(fullAllBDC).map(([key, value]) => {
			fullAllBDCServiceCount += value.displayQtyBeforeRepServiceFacings
		})
	}
	if (serviceConfigType === CONFIG_TYPE.AFTER_SERVICES) {
		fullAllBDC = masterData.map(item => {
			return {
				...item,
				bdc: item.bdc,
				count: posBDC_Count[item.bdc],
				inventoryFlag: item.inventoryFlagAfterDelivery,
				facings: posBDC_Count[item.bdc],
				displayQtyBeforeRepServiceFacings:
					item.displayQtyBeforeRepService * posBDC_Count[item.bdc],
				displayQtyAfterSalesFacings:
					item.displayQtyAfterSales * posBDC_Count[item.bdc],
				displayQtyAfterRepServiceFacings:
					item.displayQtyAfterRepService * posBDC_Count[item.bdc],
			}
		})
		
		Object.entries(fullAllBDC).map(([key, value]) => {
			fullAllBDCServiceCount += value.displayQtyAfterRepServiceFacings
		})
	}
	if (serviceConfigType === CONFIG_TYPE.AFTER_SALES) {
		fullAllBDC = masterData.map(item => {
			return {
				...item,
				bdc: item.bdc,
				count: posBDC_Count[item.bdc],
				inventoryFlag: item.inventoryFlagAfterSales,
				facings: posBDC_Count[item.bdc],
				displayQtyBeforeRepServiceFacings:
					item.displayQtyBeforeRepService * posBDC_Count[item.bdc],
				displayQtyAfterSalesFacings:
					item.displayQtyAfterSales * posBDC_Count[item.bdc],
				displayQtyAfterRepServiceFacings:
					item.displayQtyAfterRepService * posBDC_Count[item.bdc],
			}
		})
		
		Object.entries(fullAllBDC).map(([key, value]) => {
			fullAllBDCServiceCount += value.displayQtyAfterSalesFacings
		})
	}
	console.log('fullAllBDC', fullAllBDC)
	let fullAllBDCCount = 0
	Object.entries(fullAllBDC).map(([key, value]) => {
		console.log('fullAllBDCCount value', value)
		console.log('value.count', value.count)
		fullAllBDCCount += value.count
	})
	console.log('fullAllBDCCount', fullAllBDCCount);
	let fullBDCGreenCount = 0
	Object.entries(fullBDCGreen).map(([key, value]) => {
		console.log('value', value.count)
		fullBDCGreenCount += value.count
	})
	console.log('fullBDCGreenCount', fullBDCGreenCount)	

	const inStockFacingPercent = (fullBDCGreenCount / fullAllBDCCount) * 100
	const fullnessPercent = (fullAllBDCServiceCount / holdingPower) * 100

	// const fullNessBeforeServicePercent =
	// 	(fullAllBDCBeforeServiceCount / holdingPower) * 100
	// const fullNessAfterSalesPercent =
	// 	(fullAllBDCAfterSalesCount / holdingPower) * 100
	// const fullNessAfterRepServicePercent =
	// 	(fullAllBDCAfterRepServiceCount / holdingPower) * 100
	/* 	return {
		  masterData,
		  totalBDC,
		  inStockSKU: totalBDCGreen,
		  inStockSKUPercent,
		  posBDCs,
		  posBDC_Count,
		  fullAllBDC,
		  fullBDCGreen,
		  fullBDCGreenCount,
		  fullAllBDCCount,
		  inStockFacingPercent
	  } */
	// console.log('fullAllBDCBeforeServiceCount', fullAllBDCBeforeServiceCount)
	// console.log('fullAllBDCAfterSalesCount', fullAllBDCAfterSalesCount)
	// console.log('fullAllBDCBeforeServiceCount', fullAllBDCBeforeServiceCount)
	console.log({
		posBDC_Count,
		masterData,
		totalBDC,
		fullAllBDC,
		inStockSKUPercent,
		inStockFacingPercent,
		fullnessPercent
		// fullNessBeforeServicePercent,
		// fullNessAfterSalesPercent,
		// fullNessAfterRepServicePercent,
	})
	return {
		posBDC_Count,
		masterData,
		totalBDC,
		fullAllBDC,
		inStockSKUPercent,
		inStockFacingPercent,
		fullnessPercent
		// fullNessBeforeServicePercent,
		// fullNessAfterSalesPercent,
		// fullNessAfterRepServicePercent,
	}
}

const formatDate = date => {
	let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear()

	if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	return [month, day, year].join('/')
}
const calculateTotalInventory = data => {
	const selectedDate = "151515151515"
	const pogID = 1
	console.log(data)
}


	let keyObject ={
		cellValue:null,
		cellIndicator:null
	}

	const setKeysForServiceDropDown =(serviceDropdown)=>{
		if(serviceDropdown===0){
			keyObject ={
				cellValue:'backStockBegin',
				cellValue2:'displayQtyBeforeRepService',
				cellIndicator:'inventoryFlagBeforeDelivery'
			}
		}
		else if(serviceDropdown===1){
			keyObject ={
				cellValue:'backStockAfterRepService',
				cellValue2:'displayQtyAfterRepService',
				cellIndicator:'inventoryFlagAfterDelivery'
			}

		}
		else if(serviceDropdown===2){
			keyObject ={
				cellValue:'backStockBegin',
				cellValue2:'displayQtyAfterSales',
				cellIndicator:'inventoryFlagAfterSales'
			}
		}
	}

	const cellsData=(combineStoreData)=>{
		let storeData =[];
		_.forEach(combineStoreData, function (item, key2) {
					storeData.push({
						...item,
						backStockCellValue:item[keyObject.cellValue],
						storeCellValue:item[keyObject.cellValue]
						 +item[keyObject.cellValue2],
						cellIndicator:item[keyObject.cellIndicator]
					})
					});
		return storeData;			
	}

const comparisonDataTransform=()=>{
	const pogID = 'pog_1';
	const dateFilter = 1564617600000;

	const serviceDropdown = 1;
	setKeysForServiceDropDown(serviceDropdown);
	console.log("xxxx",keyObject.cellValue)
	const { displayOutput } = simulateData;
	const { storeOutput } = simulateData;

	let masterData=[];
	let combineStoreData = [];
	let combineDisplayData =[];

	_.forEach(storeOutput, function (item, key) {
	_.forEach(searchData, function (item2, key2) {
			if (item.bdc === item2.bdc) {
				combineStoreData.push({
				...item,
				category:item2.category
				});
			}
			});
	});

	// _.forEach(displayOutput, function (item, key) {
	// 	_.forEach(searchData, function (item2, key2) {
	// 			if (item.bdc === item2.bdc) {
	// 				combineDisplayData.push({
	// 				...item,
	// 				category:item2.category
	// 				});
	// 			}
	// 			});
	// 	});

	// 	let groupyByPogID = _.groupBy(
	// 		combineDisplayData,
	// 		(item) => item.pogId
	// 	  )  
	// 	let displayData = groupyByPogID[pogID]  
	// 	cellsData(displayData)
		
	let result = cellsData(combineStoreData);
	console.log("store Data",cellsData(combineStoreData));
	localStorage.setItem("Store Data", result)

		return result;

}
export { formatDate, calculateTotalInventory, getSimulationData,comparisonDataTransform }

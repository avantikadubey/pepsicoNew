import * as _ from 'lodash'
import moment from 'moment'
import comparisonData from '../data/comparison-data.json'
import searchData from '../data/search-data.json'

let keyObject = {
	cellValue: null,
	cellIndicator: null,
}

const serviceType = {
	BEFORE_SERVICE: 0,
	AFTER_SERVICE: 1,
	AFTER_SALES: 2,
}

const tempFun =(data)=>{
console.log("BBBB",data)
}

const setKeysForServiceDropDown = serviceDropdown => {
	switch (serviceDropdown) {
		case serviceType.BEFORE_SERVICE:
			return {
				cellValue: 'backStockBegin',
				cellValue2: 'displayQtyBeforeRepService',
				cellIndicator: 'inventoryFlagBeforeDelivery',
			}
		case serviceType.AFTER_SERVICE:
			return {
				cellValue: 'backStockAfterRepService',
				cellValue2: 'displayQtyAfterRepService',
				cellIndicator: 'inventoryFlagAfterDelivery',
			}
		case serviceType.AFTER_SALES:
			return {
				cellValue: 'backStockBegin',
				cellValue2: 'displayQtyAfterSales',
				cellIndicator: 'inventoryFlagAfterSales',
			}
		default:
			return {
				cellValue: 'backStockBegin',
				cellValue2: 'displayQtyBeforeRepService',
				cellIndicator: 'inventoryFlagBeforeDelivery',
			}
	}
}
const inventoryIndicatorColor = {
    RED:'d32f2f',
    YELLOW:'FFAB00',
    GREEN: '#43B649'
  };

const cellColor =(value)=>{
    switch (value) {
		case 0:
			return inventoryIndicatorColor.GREEN;
		case 1:
			return inventoryIndicatorColor.YELLOW;
		case 2:
			return inventoryIndicatorColor.RED;
		default:
			return inventoryIndicatorColor.GREEN;
			
	}
}

const cellsData = (combineStoreData, keyObject) => {
	let storeData = []
	_.forEach(combineStoreData, function(item) {
		storeData.push({
			...item,
			backStockCellValue: item[keyObject.cellValue],
			storeCellValue: item[keyObject.cellValue] + item[keyObject.cellValue2],
			cellIndicator: cellColor(item[keyObject.cellIndicator]),
		})
	})
	return storeData
}

const comparisonDataTransform = (comparisonData) => {
	//// INPUTS - START
	const pogID = 'pog_1'
	const dateFilter = 1564617600000
	const serviceDropdown = 1
	const noOfSimulations = 1
	///// INPUTS - END

	const currentKeys = setKeysForServiceDropDown(serviceDropdown)
	console.log(comparisonData.length)
	const masterData = []
	comparisonData.forEach(simulation => {
		const { uploadType, previewJson } = simulation
		const { displayOutput } = previewJson
		const { storeOutput } = previewJson

		let combineStoreData = []
		let combineDisplayData = []

		_.forEach(storeOutput, function(item, key) {
			_.forEach(searchData, function(item2, key2) {
				if (item.bdc === item2.bdc) {
					combineStoreData.push({
						...item,
						formattedSimDate: moment(item.simulationDate).format('MM/DD/YYYY'),
						category: item2.category,
						uploadType,
                        categoryBDC: `${item.bdc}-${item2.category} ${item2.sizename}-${uploadType}`,
                        combineName: `${item2.category} ${item.description} ${item.sizename}`,
					})
				}
			})
		})

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

		let result = cellsData(combineStoreData, currentKeys)

		let groupyByBDC = _.groupBy(result, item => item.categoryBDC)
		// console.log("groupyByBDC",groupyByBDC);

		const gridData = []

		Object.entries(groupyByBDC).map(([key, values]) => {
			//	console.log(key, values)
			const bdcList = []
			bdcList.push({
                productName:key.split('-')[1],
                simulation:uploadType,
				fixedCell: key,
				header: 'Search',
			})

			values.forEach(item => {
				bdcList.push({
					storeCellValue: item.storeCellValue,
					backStockCellValue: item.backStockCellValue,
                    header: item.formattedSimDate,
                    cellColor:item.cellIndicator,
				})
			})
			gridData.push(bdcList)
		})

	//	console.log(gridData)
		masterData.push({
			uploadType,
			data: gridData,
		})
	})
	console.log("tABLE dATA",masterData)

	/*
var array1 = ["a", "b", "c", "d"],
    array2 = [1, 2],
    result = [],
    i, l = Math.min(array1.length, array2.length);

for (i = 0; i < l; i++) {
    result.push(array1[i], array2[i]);
}
result.push(...array1.slice(l), ...array2.slice(l));

console.log(result)
	*/
	const finalResult = []
	const l = masterData[0].data.length
	for (let i = 0; i < l; i++) {
		for (let j = 0; j < masterData.length; j++) {
			finalResult.push(masterData[j].data[i])
		}
		/* 	finalResult.push(masterData[0].data[i],
			masterData[1].data[i],
			masterData[2].data[i]
			); */
	}

	for (let j = 0; j < masterData.length; j++) {
		finalResult.push(...masterData[j].data.slice(l))
	}

	/* finalResult.push(...masterData[0].data.slice(l),
...masterData[1].data.slice(l),
...masterData[2].data.slice(l),
); */
	console.log(finalResult)
	return {data:finalResult,length:l};
}

export { comparisonDataTransform ,tempFun}

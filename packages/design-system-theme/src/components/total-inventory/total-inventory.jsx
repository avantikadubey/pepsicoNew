import React from 'react'
import getRenderingData from '../../utils/data-flattener'
import { formatDate, calculateTotalInventory, getSimulationData } from '../../utils/utility'
import simulateRunResponse from '../../data/simulation-run-response.json'
import posData from '../../data/planogram-pos.json'

const data = {
	pogID: 'pog_1',
	dateFilter: 1564617600000,
	simulateData: simulateRunResponse.displayOutput,
	posData,
	serviceConfigType: 0,
}
const TotalInventory = () => {
	console.log('simulateRunResponse', simulateRunResponse)
	console.log(getSimulationData(data))
	// console.log(formatDate(1564617600000))
	// console.log(calculateTotalInventory(simulateRunResponse))
	return <div>Check the console for output</div>
}

export default TotalInventory

import React from 'react'
import { formatDate, comparisonDataTransform } from '../../utils/utility'
import simulateRunResponse from '../../data/simulation-run-response.json'

const ComparisonData = () => {
	console.log('simulateRunResponse', simulateRunResponse)
    console.log(formatDate(1564617600000))
    comparisonDataTransform();
	//console.log(calculateTotalInventory(simulateRunResponse))
	return <div>Check the console for output ComparisonData</div>
}

export default ComparisonData

import * as _ from 'lodash'
import posBaseData from '../data/planogram-pos'

// import posBaseData from '../data/planogram-natural-pos'

const getRenderingData = reverse => {
	const maxHeight = reverse ? _.maxBy(posBaseData, 'Y').Y : 0
	// Get the maximum height for the given position / row
	const rowWiseHeight = Object.entries(
		_.groupBy(posBaseData, seg => seg.Y)
	).map(entry => {
		const currentY = reverse
			? Math.abs(parseInt(entry[0], 10) - maxHeight)
			: parseInt(entry[0], 10)
		return {
			y: currentY,
			height: _.maxBy(entry[1], 'posHeight').posHeight,
		}
	})
	const result = _.groupBy(posBaseData, seg => seg.segId)
	const products = []
	const segments = Object.entries(result).map(entry => {
		entry[0] = `seg-${entry[0]}`
		const values = entry[1]
		const fixtures = _.groupBy(values, fix => fix.fixtureId)
		//	console.log(fixtures)
		const flattenProducts = Object.entries(fixtures).map(fix => {
			const entries = fix[1]
			const prodIds = entries.map(fix => {
				const fixProds = []
				products.push(fix.upc)
				for (let i = 0; i < fix.hFacings; i += 1) {
					fixProds.push(fix.upc)
				}
				return fixProds
			})

			let previousWidth = entries[0] !== null ? entries[0].X : 0
			const layouts = entries.map(fix => {
				const fixLayouts = []
				for (let i = 0; i < fix.hFacings; i += 1) {
					const row = rowWiseHeight.find(
						row => row.y === Math.abs(fix.Y - maxHeight)
					)

					const fixLayout = {
						x: fix.X,
						y: Math.abs(fix.Y - maxHeight),
						w: fix.posWidth / fix.hFacings,
						h: fix.posHeight / fix.yFacings,
						units: fix.units,
						availableQty: fix.availableQty,
						stackItem: true,
						yFacings: fix.yFacings,
						offset: 0,
					}
					if (typeof row !== 'undefined') {
						//		console.log(row, fixLayout.h)
						if (fix.posHeight < row.height) {
							fixLayout.y += row.height - fix.posHeight
							fixLayout.offset = row.height - fix.posHeight
						}
					}

					if (i !== 0) {
						fixLayout.x = previousWidth + fix.posWidth / fix.hFacings
					}
					previousWidth = fixLayout.x
					//	previousHeight = fixLayout.y
					fixLayouts.push(fixLayout)
				//	let j = fix.yFacings
					/* 					while (j > 1) {
						const fixLayoutY = JSON.parse(JSON.stringify(fixLayout))
						fixLayoutY.y += fixLayoutY.h
						fixLayout.stackItem = false
						fixLayouts.push(fixLayoutY)
						j -= 1
					} */
				}
				return fixLayouts
			})
			return {
				[`fix-${fix[0]}`]: {
					prodIds: prodIds.flat(),
					layouts: layouts.flat(),
					id: `fix-${fix[0]}`,
				},
			}
		})
		return { [entry[0]]: { id: entry[0], fixtures: flattenProducts } }
	})
	return { products: _.uniq(products), segments, rowWiseHeight, maxHeight }
}

export default getRenderingData

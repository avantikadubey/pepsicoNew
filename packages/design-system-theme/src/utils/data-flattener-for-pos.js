import * as _ from 'lodash'

const myFlat = data => {
	return data.reduce((acc, val) => acc.concat(val), [])
}

const WITH_ADJUSTMENT = true
// This is the extra width added to compensate for smaller positions(with less width)
const COLUMN_WIDTH_OFFSET = 0.0;
const getRenderingPosData = (reverse, data) => {
	try {
		const maxHeight = reverse ? _.maxBy(data, 'Y').Y : 0
		const minPosWidth = _.minBy(data, 'posWidth').posWidth
		const maxPosHeight = _.maxBy(data, 'posHeight').posHeight
		// Array to hold the extra width compensation logic
		const xOffsetList = []
		// Get the maximum height for the given position / row
		const rowWiseHeight = Object.entries(_.groupBy(data, seg => seg.Y)).map(
			entry => {
				const currentY = reverse
					? Math.abs(parseInt(entry[0], 10) - maxHeight)
					: parseInt(entry[0], 10)
				/*
				 * For each row , get the sorted list of columns (identified by X)
				 * For each column add an additional property with adjusted column position
				 */
				_.sortBy(entry[1], ['X']).map((item, index) =>
					xOffsetList.push({
						fixtureId: item.fixtureId,
						X: item.X,
						Y: item.Y,
						xOffset: item.X + index * COLUMN_WIDTH_OFFSET,
					})
				)

				return {
					y: currentY,
					height: _.maxBy(entry[1], 'posHeight').posHeight,
				}
			}
		)

		/* ==== Adjust Y position gap START ==== */
		let result = null
		if (WITH_ADJUSTMENT) {
			const rowYoffset = []
			let adjusted = false // flag set if there has been a Y position adjustment
			let adjustedDiff = 0 // What amount of adjustment has been done for the Y position
			// Get the adjustment required when the gap is more than
			// 1.5 times the max product height
			data.map((item, index) => {
				if (
					index < data.length - 1 &&
					typeof data[index + 1].Y !== 'undefined' &&
					item.Y !== data[index + 1].Y
				) {
					let newY = item.Y
					const rowOffset = data[index + 1].Y - item.Y
					if (rowOffset > maxPosHeight + maxPosHeight / 2) {
						newY = data[index - 1].Y + maxPosHeight
						adjusted = true
						adjustedDiff = newY - item.Y
					}

					rowYoffset.push({
						Y: item.Y,
						rowOffset,
						Y2: newY,
						next: data[index + 1].Y,
					})
				}
				return null
			})

			//  First pass adjust y where there is an extra gap
			const tranformedDataPassOne = data.map(item => {
				const findRow = rowYoffset.find(row => row.Y === item.Y)
				let newY2 = item.Y
				if (typeof findRow !== 'undefined') {
					newY2 = findRow.Y2
				}
				return {
					...item,
					Y2: newY2,
				}
			})
			// console.log(tranformedDataPassOne)
			// console.log(adjustedDiff)
			// Pass two adjust height for all others if there was a y adjustment
			// in other fixtures
			const tranformedData = tranformedDataPassOne.map(item => {
				if (adjusted && item.Y !== maxHeight && item.Y === item.Y2) {
					return {
						...item,
						Y2: item.Y + adjustedDiff,
					}
				}

				// For top position we are bringing the top most shelf by 15%
				// in case we face an issue this can further be reduced.
				if (adjusted && item.Y === maxHeight && item.Y === item.Y2) {
					// console.log(item.Y, adjustedDiff / 6, item.posHeight)
					return {
						...item,
						Y2: item.Y + adjustedDiff / 6,
					}
				}
				return item
			})
			result = _.groupBy(tranformedData, seg => seg.segId)
			/* ==== Adjust Y position gap END ==== */
		} else {
			result = _.groupBy(data, seg => seg.segId)
		}

		const products = []
		const segments = Object.entries(result).map(entry => {
			entry[0] = `seg-${entry[0]}`
			const values = entry[1]
			const fixtures = _.groupBy(values, fix => fix.fixtureId)
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
							checkRow => checkRow.y === Math.abs(fix.Y - maxHeight)
						)
						// Find the corresponding column adjustment item from
						// the column offset list (width compensation)
						const xOffsetForPosition = xOffsetList.find(
							item =>
								item.X === fix.X &&
								item.Y === fix.Y &&
								item.fixtureId === fix.fixtureId
						)

						const fixLayout = {
							x: xOffsetForPosition ? xOffsetForPosition.xOffset : fix.X, // if offset exists use that
							y: WITH_ADJUSTMENT
								? Math.abs(fix.Y2 - maxHeight)
								: Math.abs(fix.Y - maxHeight),
							X: fix.X,
							Y: fix.Y,
							w: fix.posWidth / fix.hFacings,
							h: fix.posHeight / fix.yFacings,
							units: fix.units,
							bdc: fix.bdc,
							prodWidth: fix.prodWidth,
							availableQty: fix.availableQty,
							stackItem: true,
							yFacings: fix.yFacings,
							offset: 0,
						}
						if (typeof row !== 'undefined') {
							//    console.log(row, fixLayout.h)
							if (fix.posHeight < row.height) {
								fixLayout.y += row.height - fix.posHeight
								fixLayout.offset = row.height - fix.posHeight
							}
						}

						if (i !== 0) {
							fixLayout.x = previousWidth + fix.posWidth / fix.hFacings
						}
						previousWidth = fixLayout.x
						//  previousHeight = fixLayout.y
						fixLayouts.push(fixLayout)
						// let j = fix.yFacings
						/*          while (j > 1) {
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
						prodIds: myFlat(prodIds),
						layouts: myFlat(layouts),
						id: `fix-${fix[0]}`,
					},
				}
			})
			return { [entry[0]]: { id: entry[0], fixtures: flattenProducts } }
		})
		return {
			products: _.uniq(products),
			segments,
			rowWiseHeight,
			maxHeight,
			minPosWidth,
			maxPosHeight,
		}
	} catch (error) {
		console.log('Error in flattening', error)
	}
}

export default getRenderingPosData

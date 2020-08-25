/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Button, Welcome } from '@storybook/react/demo'
import { Header, Footer } from '../components/layout'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { DropDown } from '../components/drop-down'
import { CardSlider } from '../components/card-slider'
import { MediaCard } from '../components/media-card'
import content from '../data/staticData'
import { PlanogramProduct } from '../components/planogram-product'
import { UploadFile } from '../components/upload-file'
import { ProgressLoader } from '../components/progress-loader'
import { ScrollableTable } from '../components/scrollable-table'
import { ProgressSpinner } from '../components/progress-spinner'
import { InputControl } from '../components/input-control'
import { InfiniteScroll } from '../components/infinite-scroll'
import { ModalContainer } from '../components/modal-container'
import { MessageBar } from '../components/message-bar'
import { VideoPlayer } from '../components/video-player'
import { VideoDialog } from '../components/video-dialog'
import sampleVideo from '../../static/plano.mp4'
import { ReactTable } from '../components/table'
import { Calendar } from '../components/calendar'
import { GroupedTable } from '../components/group-table'
import { TotalInventory } from '../components/total-inventory'
import { AutoCompleteBox } from '../components/auto-complete-box'
import { getSimulationData } from '../utils/utility'
import { comparisonDataTransform } from '../utils/comparison-function'
import customTheme from './custom-theme'

const labels = {
	headerLabels: content.headerContainer,
	inventoryLabels: content.inventoryContainer,
	planogramLabels: content.mediaCardContainer,
	tabs: content.tabs,
}
const chains = [
	['11', 'Walmart'],
	['22', 'Kurgers'],
]

const theme = createMuiTheme(customTheme)

storiesOf('Welcome', module).add('to Storybook', () => (
	<Welcome showApp={linkTo('Button')} />
))

storiesOf('Materal UI Theme', module)
	.addDecorator(story => (
		<ThemeProvider theme={theme}>
			<div
				style={{
					margin: 10,
					display: 'flex',
					textAlign: 'center',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{story()}
			</div>
		</ThemeProvider>
	))
	.add('header', () => <Header siteTitle="Planogram Simulator" />)
	.add('footer', () => <Footer />)
	.add('dropdown', () => (
		<DropDown
			label={labels.headerLabels.storeNameLabel}
			current=""
			values={chains}
			type="chain"
		/>
	))
	.add('slider', () => <CardSlider />)
	.add('Media Card', () => (
		<MediaCard
			labels="Media Card"
			data={{
				salesAllocation: 25,
				pogId: '11',
			}}
			handleSalesAllocation={data => console.log(data)}
		/>
	))
	.add('Upload File', () => <UploadFile isLoadingUploadFile={() => false} />)
	.add('ProgressLoader', () => <ProgressLoader />)
	.add('ProgressSpinner', () => <ProgressSpinner />)
	.add('ScrollableTable', ()=> <ScrollableTable />)
	.add('Planogram Product', () => <PlanogramProduct />)
	.add('Input Control', () => <InputControl />)
	.add('Infinite Scroll', () => <InfiniteScroll />)
	.add('Message Bar', () => <MessageBar />)
	.add('Modal', () => <ModalContainer />)
	.add('Video Player', () => {
		return (
			<div
				style={{
					margin: 10,
					width: 1000,
					display: 'flex',
				}}
			>
				<VideoPlayer url={sampleVideo} />
			</div>
		)
	})
	.add('Table', () => <ReactTable />)
	.add('Video Dialog', () => (
		<VideoDialog
			showDialog
			title="Order Simulation Process"
			videoURL={sampleVideo}
		/>
	))
	.add('Calendar', () => <Calendar />)
	.add('Group Table', () => {
		const columns = [
			{ dataKey: 'name', title: '' },
			{ dataKey: 'sex', title: 'Sex' },
			{ dataKey: 'city', title: 'City' },
			{ dataKey: 'car', title: 'Car' },
		]
		let rows = [
			{ sex: 'Female', name: 'Sandra', city: 'Las Vegas', car: 'Audi A4' },
			{ sex: 'Male', name: 'Paul', city: 'Paris', car: 'Nissan Altima' },
			{ sex: 'Male', name: 'Mark', city: 'Paris', car: 'Honda Accord' },
			{ sex: 'Male', name: 'Paul', city: 'Paris', car: 'Nissan Altima' },
			{ sex: 'Female', name: 'Linda', city: 'Austin', car: 'Toyota Corolla' },
			{
				sex: 'Male',
				name: 'Robert',
				city: 'Las Vegas',
				car: 'Chevrolet Cruze',
			},
			{ sex: 'Female', name: 'Lisa', city: 'London', car: 'BMW 750' },
			{ sex: 'Male', name: 'Mark', city: 'Chicago', car: 'Toyota Corolla' },
			{
				sex: 'Male',
				name: 'Thomas',
				city: 'Rio de Janeiro',
				car: 'Honda Accord',
			},
			{ sex: 'Male', name: 'Robert', city: 'Las Vegas', car: 'Honda Civic' },
			{ sex: 'Female', name: 'Betty', city: 'Paris', car: 'Honda Civic' },
			{ sex: 'Male', name: 'Robert', city: 'Los Angeles', car: 'Honda Accord' },
			{ sex: 'Male', name: 'William', city: 'Los Angeles', car: 'Honda Civic' },
			{ sex: 'Male', name: 'Mark', city: 'Austin', car: 'Nissan Altima' },
		]

		rows = rows.concat(...rows)
		return <GroupedTable columns={columns} rows={rows} />
	})
	.add('comparison Data Transform', () => comparisonDataTransform())
	.add('Total Inventory', () => <TotalInventory />)
	.add('AutoComplete Box', () => <AutoCompleteBox />)

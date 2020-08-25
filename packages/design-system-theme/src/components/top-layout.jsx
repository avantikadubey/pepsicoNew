import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import 'typeface-roboto'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'overlayscrollbars/css/OverlayScrollbars.css'
import '../tokens/os-theme-round-dark.css'
import 'animate.css/animate.min.css'
// import '../tokens/os-theme-thick-dark.css'
import '../icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import CssBaseline from '@material-ui/core/CssBaseline'
import NoSsr from '@material-ui/core/NoSsr'
import { ThemeProvider } from '@material-ui/styles'
import theme from '../theme'

/**
 * @see https://github.com/FortAwesome/react-fontawesome/issues/134
 * @see https://fontawesome.com/how-to-use/with-the-api/setup/configuration
 */
config.autoAddCss = false

export default function TopLayout({ children }) {
	return (
		<React.Fragment>
			<Helmet>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
				/>
			</Helmet>
			<NoSsr>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					{children}
				</ThemeProvider>
			</NoSsr>
		</React.Fragment>
	)
}

TopLayout.propTypes = {
	children: PropTypes.node.isRequired,
}

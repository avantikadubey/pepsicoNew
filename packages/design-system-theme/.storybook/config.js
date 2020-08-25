import { configure } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import 'typeface-roboto'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'overlayscrollbars/css/OverlayScrollbars.css';
import '../src/tokens/os-theme-round-dark.css'
import '../src/icons'
import { config } from '@fortawesome/fontawesome-svg-core'

/**
 * @see https://github.com/FortAwesome/react-fontawesome/issues/134
 * @see https://fontawesome.com/how-to-use/with-the-api/setup/configuration
 */
config.autoAddCss = false

// automatically import all files ending in *.stories.js
// highlight-next-line
const req = require.context('../src', true, /.stories.jsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

// highlight-start
// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}

// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ''

// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action('NavigateTo:')(pathname)
}

configure(loadStories, module)
// highlight-end

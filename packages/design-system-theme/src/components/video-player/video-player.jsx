/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'

const videoStyle = theme => ({
	root: {
		display: 'block',
		width: '100%',
	},
	modeLight: {
		backgroundColor: theme.palette.primary.light,
		display: 'block',
		width: '100%',
	},
})

// Capitalize the items
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


/**
 * @constant
 * @function
 * @param {object} props
 * @returns {element}
 * @see https://www.gatsbyjs.org/docs/adding-images-fonts-files/
 */
const VideoPlayer = ({ classes, url, mode }) => (
	/*
      root - base class for all components

      properties of the component aligned to classes

      for example: position="fixed"
          <property>=<value>
          <property><Value>
      */
	<video
		className={classNames(
			classes.root,
			classes[mode ? `mode${capitalize(mode)}` : '']
		)}
		autoPlay
		loop
		muted
		playsInline
		preload="none"
	>
		<source src={url} type="video/mp4" />
	</video>
)

VideoPlayer.propTypes = {
	classes: PropTypes.object.isRequired,
	url: PropTypes.string,
	mode: PropTypes.string,
}

export default withStyles(videoStyle, { withTheme: true })(VideoPlayer)

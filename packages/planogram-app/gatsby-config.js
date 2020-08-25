const activeEnv = process.env.NODE_ENV || 'development';
const path = require('path')

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

const config = require('./data/siteConfig.js');

module.exports = {
	plugins: [
		{
			resolve: '@planogram/core',
			options: {
				siteMetadata: {
					title: config.siteTitle,
					description: config.siteDescription
				},
				pathPrefix: config.pathPrefix
			}
		},
		'@planogram/design-system',
		'@planogram/store',
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `pogImages`,
				path: path.join(__dirname, `src`, `images`,`pog`),
			},
		},
		'@dxp/okta'
	]
};

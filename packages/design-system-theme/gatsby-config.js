module.exports = {
	plugins: [
		{
			resolve: `gatsby-plugin-compile-es6-packages`,
			options: {
				modules: ['@planogram/design-system'],
			},
		},
		{
			resolve: 'gatsby-plugin-material-ui',
			// If you want to use styled components you should change the injection order.
			options: {
				// stylesProvider: {
				//   injectFirst: true,
				// },
			},
		},
		`gatsby-plugin-emotion`,
		// If you want to use styled components you should add the plugin here.
		// 'gatsby-plugin-styled-components',
	],
}

# Gatsby Core Theme

The core theme sets up the base configuration.

- The idea is to have the SEO, image processing, file source setup , PWA, core branding of the product in one place and versioned
- Sites can simply use the not worry about setting this piece properly and any changes to the core configuration can be done via the theme.
- All organization specific core plugins , icons can be configured here.

## How to use

- Add the dependency `@planogram/core`

```bash
yarn add `@planogram/core`
```

- Configure the theme in the `gatsby-config.js` file.

```javascript
const config = require('./data/siteConfig.js')

module.exports = {
	plugins: [
		{
			resolve: '@planogram/core',
			options: {
				siteMetadata: {
					title: config.siteTitle,
					description: config.siteDescription,
				},
				pathPrefix: config.pathPrefix,
			},
		},
	],
}
```

- Add the site configuration file in the project `data/siteConfig.js`

```javascript
module.exports = {
	siteTitle: '<replace with title>',
	siteDescription: '<replace with description>',
	author: '<replace with author name>',
	pathPrefix: '/',
}
```

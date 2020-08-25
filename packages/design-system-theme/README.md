# Gatsby Material-UI Theme

The mui theme sets up the configuration based on the best practices recommended by the material-ui team.

- This takes care of all the setup and configuration requirements for theming, layouts, material-ui setup for SSR and client side rendering.
- An HOC sets up the material-ui theming both for SSR and Browser modes, so the user just needs to configure the material-ui theme configuration to customize it to the websites requirements.

## How to use

- Add the dependency `@planogram/design-system`


```bash
yarn add `@planogram/design-system`
```

- Configure the theme in the `gatsby-config.js` file.

```javascript
module.exports = {
	plugins: [
		{
			resolve: '@planogram/design-system',
		},
	],
}
```

- Customize / Setup your Material-UI theme
      	- Create a file under the src directory called `@planogram\design-system\custom-theme.js`

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{js,jsx}',
		'!src/**/index.js',
		'!src/**/*.stories.jsx',
		'!**/node_modules/**',
		'!build/**',
	],
	coverageReporters: ['lcov', 'text'],
	reporters: ['default'],
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
			'identity-obj-proxy',
	},
	testResultsProcessor: 'jest-sonar-reporter',
	verbose: true,
}

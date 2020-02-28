const path = require('path')

module.exports = {
	entry: {
		index: './src/index.js',
	},
	output: {
		path: path.resolve('./'),
		libraryTarget: 'commonjs2',
	},
	resolve: {
		extensions: ['.js', '.ts'],
		symlinks: false,
	},
	devtool: false,
	watch: false,
	// watchOptions: {
	// 	aggregateTimeout: 1000,
	// 	ignored: [/node_modules/, /functions/, /webpack/],

	// },
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'eslint-loader',
					options: {
						emitError: true,
					},
				}]
			},
		]
	},
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
}

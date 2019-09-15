const path = require('path')

module.exports = {
	entry: {
		index: './src/index.ts'
	},
	output: {
		path: path.resolve('./'),
		libraryTarget: 'commonjs2',
	},
	resolve: {
		extensions: ['.js', '.ts'],
		symlinks: false,
	},
	devtool: false, //'cheap-module-eval-source-map'/* 'inline-source-map' */,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ 
					{
						loader: 'eslint-loader',
						options: {
							emitError: true,
						},
					}
				]
			},
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: false, // true == FAST build, false == slow, fail on TS errors
						experimentalWatchApi: false, // ???
					},
				},
				exclude: /node_modules/,
			}
		]
	},
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
}
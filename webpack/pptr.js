const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
console.log(path.resolve('./build'))
module.exports = {
	entry: {
		pptr: './src/pptr.ts',
	},
	output: {
		path: path.resolve('./build'),
	},
	resolve: {
		extensions: ['.js', '.ts'],
		symlinks: false,
	},
	devtool: 'eval-source-map', //'cheap-module-eval-source-map'/* 'inline-source-map' */,
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: {
				loader: 'ts-loader',
				options: {
					transpileOnly: false, // true == FAST build, false == slow, fail on TS errors
					experimentalWatchApi: false, // ???
				},
			},
			exclude: /node_modules/,
		}]
	},
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/html/template.html',
			filename: 'pptr.html',
			title: 'pptr',
			inject: true,
			hash: false,
			assets: {},
		}),
	]
}

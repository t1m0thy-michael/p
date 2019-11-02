import { pathToArray } from './utils'
import regx from './regex'

export const createRoute = (obj) => {
	let rx = ''
	let args = []
	let path = []
	pathToArray(obj.url)
		.forEach((slug, idx) => {
			// slug is argument
			if (slug && slug.substr(0, 2) === '::') {
				const name = (slug.match(regx.arg.name) || ['', ''])[1]
				const type = (slug.match(regx.arg.type) || ['', ''])[1]
				rx += `\\/${regx.types[type]}`
				args.push({
					name,
					type,
					idx
				})
				// slug is path
			} else {
				path.push(slug)
				rx += `\\/${slug}`
			}
		})

	return {
		args: args || [],								// description of expected arguments
		defaultArguments: obj.defaultArguments || {},  	// kv pair default agruments
		filepath: obj.filepath || null, 				// string. src path of required external script
		fn: obj.fn,										// fn or name of fn on global object from 'filepath' sctipt
		len: args.length + path.length,					
		name: obj.name || makeID(),
		pathArr: path,
		rx: new RegExp(`^${rx}$`),
		url: obj.url, 									// url DEFINITION. path with arg type placeholders
	}
}

export default createRoute
import { pathToArray } from './utils'
import regx from './regex'

export const createRoute = ({
	// required
	fn,
	name,
	url,
	// opts
	clearBefore = true,
	external = false,
	filepath = null,
	// events
	onLeave = () => {},
}) => {
	let rx = ''
	let args = []
	let path = []
	pathToArray(url)
		.forEach((slug, idx) => {
			// slug is argument
			if (slug && slug.substr(0, 2) === '::') {
				const name = (slug.match(regx.arg.name) || ['', ''])[1]
				const type = (slug.match(regx.arg.type) || ['', ''])[1]
				rx += `(\\/${regx.types[type]})`
				
				if (slug.substr(2,1) === '?'){
					rx += '?'
				}

				console.log(slug, rx)

				args.push({
					name,
					type,
					idx
				})
			} else {
				// slug is path
				path.push(slug)
				rx += `\\/${slug}`
			}
		})

		console.log(rx)

	return {
		args: args,						// description of expected arguments
		filepath: filepath, 			// string. src path of required external script
		fn: fn,							// fn or name of fn on global object from 'filepath' sctipt
		len: args.length + path.length,					
		name: name,
		pathArr: path,
		rx: new RegExp(`^${rx}$`),
		url: url, 						// url DEFINITION. path with arg type placeholders
		clearBefore: clearBefore,
		onLeave: onLeave,
		external: external
	}
}

export default createRoute
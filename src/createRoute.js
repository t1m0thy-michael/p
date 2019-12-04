import { pathToArray } from './utils'
import regx from './regex'

export const createRoute = ({
	// required
	fn,
	name,
	url,
	// opts
	clearBefore = true,
	allowQueryString = true,
	external = false,
	filepath = null,
	// events
	onLeave = () => {},
}) => {
	let rx = ''
	let args = []
	let path = []

	pathToArray(url).forEach((slug, idx) => {
		if (!slug) return 
		// slug is argument
		if (slug.substr(0, 2) === '::') {
			const name = (slug.match(regx.arg.name) || ['', ''])[1]
			const type = (slug.match(regx.arg.type) || ['', ''])[1]
			rx += `(\\/${regx.types[type]})`
			
			if (slug.substr(2,1) === '?') rx += '?'

			args.push({
				name,
				type,
				idx
			})

		} else if (slug.substr(0,1) === '*') {
			rx += '\\/.+'

		} else {
			// slug is path
			path.push(slug)
			rx += `\\/${slug}`
		}
	})

	return {
		allowQueryString: allowQueryString,
		args: args,						// description of expected arguments
		clearBefore: clearBefore,
		external: external,
		filepath: filepath, 			// string. src path of required external script
		fn: fn,							// fn or name of fn on global object from 'filepath' sctipt
		len: args.length + path.length,					
		name: name,
		onLeave: onLeave,
		pathArr: path,
		rx: new RegExp(`^${rx}$`),
		url: url, 						// url DEFINITION. path with arg type placeholders
	}
}

export default createRoute
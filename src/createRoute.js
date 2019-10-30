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
		args: args || [],
		opts: obj.opts || {},
		filepath: obj.filepath || null,
		fn: obj.fn,
		name: obj.name || makeID(),
		path: path,
		rx: new RegExp(`^${rx}$`),
		url: obj.url,
		len: args.length + path.length,
		visits: 0
	}
}

export default createRoute
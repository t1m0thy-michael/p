import u from '@t1m0thy_michael/u'

import {
	parseArg,
	pathToArray,
	script,
} from './utils'

export const getRoute = async (routes, path) => {
	const pathArr = pathToArray(path)
	let found = {}
	let args = {}
	for (let idx in routes) {
		const r = routes[idx]
		if (path === r.url || r.rx.test(path)) {
			for (let i = 0; i < u.sizeOf(r.args); i++) {
				const arg = parseArg(
					pathArr[r.args[i].idx],
					r.args[i].type
				)
				args[r.args[i].name] = arg
			}
			found = r
			found.arguments = args
		}
	}

	// 404 - route not found
	if (!found.fn) return false

	// need to load additional script js file
	if (u.isString(found.filepath)) {
		const s = await script(found.filepath)	
		// 404 - additional missing
		if (s.status !== 'ok' || !isFunction(window[found.fn])) return false
		found.fn = window[found.fn]
	}

	return found
}

export default getRoute
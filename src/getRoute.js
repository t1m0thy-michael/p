import u from '@t1m0thy_michael/u'

import {
	parseType,
	pathToArray,
	script,
} from './utils'

import { getPageFn } from './gblFnStore'

/*
	returns route object matching the given path
	async - route may require loading of another script
*/
export const getRoute = async (routes, path) => {
	const pathArr = pathToArray(path)
	let found = {}
	let args = {}
	for (let idx in routes) {
		const r = routes[idx]
		if (path === r.url || r.rx.test(path)) {
			for (let i = 0; i < u.sizeOf(r.args); i++) {
				const arg = parseType(
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
	if (!found.fn && !found.external) return false

	// need to load additional script js file?
	if (u.isString(found.filepath)) {
		const s = await script(found.filepath)	
		// 404 - additional script not found
		const fn = getPageFn(found.fn)
		if (s.status !== 'ok' || !u.isFunction(fn)) return false
		found.fn = fn
		delete found.filepath
	}

	// return shallow copy
	return Object.assign({}, found)
}

export default getRoute
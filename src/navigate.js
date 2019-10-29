import u from '@t1m0thy_michael/u'

import { pathToArray, parseArg } from './utils'

export const navigate = async (obj, path = false, state = false) => {

	if (!path) path = window.location.pathname
	if (String(path).substr(0, 1) !== '/') path = `/${path}`

	try {

		// tidy
		obj.container.empty().scrollTop(0)

		// figure out the new path...
		const pathArr = pathToArray(path)
		let found = {}
		let args = {}
		for (let idx in obj.routes) {
			const r = obj.routes[idx]
			if (path === r.url || r.rx.test(path)) {
				for (let i = 0; i < u.sizeOf(r.args); i++) {
					const arg = parseArg(
						pathArr[r.args[i].idx],
						r.args[i].type
					)
					args[r.args[i].name] = arg
				}
				found = r
			}
		}

		// If we've got a filepath we need to load an extra script
		// if (u.isString(found.filepath)) {
		// 	const script = await d.script(found.filepath)
		// 	if (script.status !== 'ok') {
		// 		navigate(obj, '404')
		// 		return true
		// 	}

		// 	if (u.isString(found.fn)) {
		// 		if (!u.isFunction(window[found.fn])) {
		// 			throw `Invalid route : ${path} : [${found.fn}()]`
		// 		}
		// 		found.fn = window[found.fn]
		// 		found.filepath = undefined
		// 	}
		// }

		// not found a function? that'll be a paddlin`
		if (!u.isFunction(found.fn)) {

			if (obj.settings.navigateOnNotMatched 
			&& window.location.pathname.replace(/\//g, '') !== path.replace(/\//g, '')) {
				window.location = path
			}

			navigate(obj, '404')

			return true

		}

		// stats and meta data
		found.visits++
		if (found.name) Object.assign(obj.PAGE_THIS_PAGE, found)

		if (state){
			history.replaceState(state, found.name, path)
		} else {
			history.pushState({ path: path }, found.name, path)
		}

		// bind page this and pass arguments object(s) to page function
		await found.fn.bind(obj.PAGE_THIS)(Object.assign({}, found.dfltArg, args))

	} catch (e) {
		navigate(obj, '500')
		return true
	}

	return true
}

export default navigate
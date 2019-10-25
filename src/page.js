import u from '@t1m0thy_michael/u'
import e from '@t1m0thy_michael/e'
import d from '@t1m0thy_michael/d'
window.d = d

import CONST from './constants'
import routeFactory from './routeFactory'
import { pathToArray, parseArg } from './utils'
import errorPage from './errorPage'

const hooks = {}

// holds configured route objects. See routeFactory()
const routes = []

// holds DOM object for the element whose contents will get 
// cleared with DOM().empty() on navigate()
let container = d('body')

// will be bound to page functions.
const PAGE_THIS_PAGE = {}
const PAGE_THIS = {
	get container () { return container },
	get page () { return PAGE_THIS_PAGE }
}

// glb will be bound to each page setup function
export const setThis = (gbl) => {
	PAGE_THIS.app = gbl
	return hooks
}

export const setContainer = (_content) => {
	const cont = d(_content)
	if (!cont.exists || !cont.isAppended) throw 'container must exist'
	container = cont
	return hooks
}

export const setRoute = (_routes) => {
	u.makeSureItsAnArray(_routes).forEach((obj) => {
		routes.push(routeFactory(obj))
	})
}

export const navigate = async (path, state = {}) => {

	if (!path) path = window.location.pathname
	if (path.substr(0, 1) !== '/') path = `/${path}`
	
	try {

		// check for anything that wants to prevent navigation
		const evtResp = (await e.pub({ topic: 'p/willnavigate' })).reduce((a, c) => a + c, 0)
		if (evtResp & CONST.PREVENT_NAVIGATION) {
			console.warn('Navigation prevented', evtResp[i])
			return
		}

		// tidy
		container.empty().scrollTop(0)

		// figure out the new path...
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
			}
		}

		// If we've got a filepath we need to load an extra script
		if (u.isString(found.filepath)) {
			const script = await d.script(found.filepath)
			if (script.status !== 'ok'){
				errorPage({
					code: 404,
					msg: `Unable to load route [${path}]`
				})
				return
			}

			if (u.isString(found.fn)) {
				if (!u.isFunction(window[found.fn])) {
					throw `Error loading route : ${u.makeSureItsAnArray(found.path).join('/')} : [${found.fn}()]`
				}
				found.fn = window[found.fn]
				found.filepath = undefined
			}
		}

		// not found a function? that'll be a paddlin`
		if (!u.isFunction(found.fn)) {
			errorPage({
				code: 404,
				msg: `route not found [${path}]`,
				e: e,
			})
			return
		}

		history.pushState(state, null, path)
		

		found.visits++
		if (found.name) Object.assign(PAGE_THIS_PAGE, found)

		await found.fn.bind(PAGE_THIS)(Object.assign({}, found.dfltArg, args))

		e.pub({ topic: 'p/navigate/done' })

	} catch (e) {
		errorPage({
			code: 500,
			msg: `D\'oh!`,
			e: e,
		})
	}

	return hooks
}


e.sub({ topic: 'p/go', fn:  navigate })

window.addEventListener('popstate', (evt) => navigate(window.location.pathname, evt.state))

document.addEventListener('click', (evt) => {
	if (evt.target.tagName !== 'A') return
	if (evt.target.host !== window.location.host) return // Goodby...
	evt.preventDefault()
	navigate(evt.target.pathname)
})

export default Object.assign(hooks, {
	CONST,
	navigate,
	setContainer,
	setRoute,
	setThis,
})
import d from '@t1m0thy_michael/d'
import u from '@t1m0thy_michael/u'

import createRoute from './createRoute'
import getRoute from './getRoute'
import CONST from './constants'
import errorRoutes from './error'

export * from './gblFnStore'

const THIS = {
	app: {},
	const: CONST,
	container: d('body'),
	page: {
		args: {},
		name: '',
		route: {},
		state: {},
	},
	state: {},
}

const routes = {}

const on = {
	beforeNavigate: () => {},
	afterNavigate: () => {},
	on404: () => { console.error(404) },
}
const setRoute = (arr) => {
	u.makeSureItsAnArray(arr).forEach((def) => {
		const r = createRoute(def)
		routes[r.url] = r
	})
}

// set default routes
setRoute(errorRoutes)

const setContainer = (selector) => {
	const cont = d(selector)
	if (!cont.exists || !cont.isAppended) throw 'container must exist'
	THIS.container = cont
}

const setApp = (gbl) =>  THIS.app = gbl || {}

const setState = (gbl) => THIS.state = gbl || {}

const setAction = (key) => (fn) => on[key] = fn.bind(THIS)
const setAfterNavigate = setAction('afterNavigate')
const setBeforeNavigate = setAction('beforeNavigate')
const setOn404 = setAction('on404')

const getPath = (path = '') => {
	if (!path) path = window.location.pathname
	if (String(path).substr(0, 1) !== '/') path = `/${path}`
	return path
}

const navigate = async (path, state = false) => {

	// anything to do before we leave??
	const onLeave = u.get(THIS, 'page.route.onLeave')
	if (u.isFunction(onLeave) && await onLeave.bind(THIS)() === CONST.PREVENT_NAVIGATION) return
	
	// make sure path makes sense
	path = getPath(path)
	
	// find appropriate route
	let r = await getRoute(routes, path)
	
	// bugger.
	if (!r) {
		if (path !== window.location.pathname) await on.on404(path)
		r = await getRoute(routes, '/404')
	}

	if (await on.beforeNavigate() === CONST.PREVENT_NAVIGATION) return

	// save current state
	history.replaceState(THIS.page.state, null, null)

	// external
	if (r.external && window.location.pathname !== path) {
		window.location = path
		return
	}

	// clear container?
	if (r.clearBefore) THIS.container.empty().scrollTop(0)

	const pageArgs = Object.assign({}, r.defaultArguments, r.arguments)

	// update THIS.page with new route information
	THIS.page = { 
		args: pageArgs  || {},
		name: r.name,
		route: r,
		state: state || {},
	}

	// history/state stuff
	if (!state) {
		history.pushState(THIS.page.state, r.name, path)
	} else {
		history.replaceState(state, r.name, path)
	}

	// bind THIS, and call with defaults/args
	await r.fn.bind(THIS)(pageArgs)

	await on.afterNavigate()
}

const eventsListeners = {}

eventsListeners.click = (evt) => {
	if (evt.target.tagName !== 'A') return
	if (evt.target.host !== window.location.host) return // Goodby...
	evt.preventDefault()
	navigate(evt.target.pathname)
}

eventsListeners.popstate = (evt) => {
	navigate(false, evt.state)
}

window.addEventListener('click', eventsListeners.click)

window.addEventListener('popstate', eventsListeners.popstate)

export default {
	navigate,
	setAfterNavigate,
	setApp,
	setBeforeNavigate,
	setContainer,
	setRoute,
	setState,
	setOn404,
}
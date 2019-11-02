import d from '@t1m0thy_michael/d'
import u from '@t1m0thy_michael/u'

import createRoute from './createRoute'
import getRoute from './getRoute'
import CONST from './constants'
import errorRoutes from './error'
		
const THIS = {
	app: {},
	const: CONST,
	container: d('body'),
	page: {
		state: {}
	},
	state: {},
}

const routes = {}

let beforeNavigate = () => {}
let afterNavigate = () => {}

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

const setAfterNavigate = (fn) => afterNavigate = fn.bind(THIS)

const setBeforeNavigate = (fn) => beforeNavigate = fn.bind(THIS)

const getPath = (path = '') => {
	if (!path) path = window.location.pathname
	if (String(path).substr(0, 1) !== '/') path = `/${path}`
	return path
}

const navigate = async (path, state = false) => {

	// user defined. May prevent navigation
	if (await beforeNavigate() === CONST.PREVENT_NAVIGATION) return
	
	// save current state
	history.replaceState(THIS.page.state, null, null)

	// make sure path makes sense
	path = getPath(path)
	
	// find appropriate route
	let r = await getRoute(routes, path)

	// bugger.
	if (!r) r = await getRoute(routes, '/404')

	// clear container
	if (r.clearBefore) THIS.container.empty().scrollTop(0)

	// update THIS.page with new route information
	THIS.page = { 
		name: r.name,
		state: state || {},
	}

	// history/state stuff
	if (!state) {
		history.pushState(THIS.page.state, r.name, path)
	} else {
		history.replaceState(state, r.name, path)
	}

	// bind THIS, and call with defaults/args
	await r.fn.bind(THIS)(Object.assign({}, r.defaultArguments, r.arguments))

	// user defined
	await afterNavigate()
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
}
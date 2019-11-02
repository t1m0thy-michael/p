import d from '@t1m0thy_michael/d'
import u from '@t1m0thy_michael/u'

import createRoute from './createRoute'
import getRoute from './getRoute'
import CONST from './constants'
		
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
			const rut = createRoute(def)
			routes[rut.url] = rut
		})
	}

	const setContainer = (selector) => {
		const cont = d(selector)
		if (!cont.exists || !cont.isAppended) throw 'container must exist'
		THIS.container = cont
	}

	const setApp = (gbl) =>  THIS.app = gbl || {}

	const setState = (gbl) => THIS.state = gbl || {}

	const setAfterNavigate = (fn) => afterNavigate = fn.bind(THIS)

	const setBeforeNavigate = (fn) => beforeNavigate = fn.bind(THIS)

	const maintainHistory = (r, path, state = false) => {
		// save current state
		history.replaceState(THIS.page.state, null, null)
		// update state for new route
		if (!state) {
			history.pushState({}, r.name, path)
		} else {
			history.replaceState(state, r.name, path)
		}
	}

	const getPath = (path = '') => {
		if (!path) path = window.location.pathname
		if (String(path).substr(0, 1) !== '/') path = `/${path}`
		return path
	}

	const navigate = async (path, state = false) => {

		// user defined. May prevent navigation
		if(await beforeNavigate() === CONST.PREVENT_NAVIGATION) return

		// clear container
		// TODO: configurable by page
		THIS.container.empty().scrollTop(0)
		
		// make sure path makes sense
		path = getPath(path)
		
		// find appropriate route
		const r = await getRoute(routes, path)
		
		// bugger.
		if (!r) throw new Error(404)
		
		// save current state
		history.replaceState(THIS.page.state, null, null)

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
		console.log('popstate', evt)
		// no state, no navigate
		if (!evt.state) return
		// do be going
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

import d from '@t1m0thy_michael/d'
import u from '@t1m0thy_michael/u'

import createRoute from './createRoute'
import getRoute from './getRoute'
import CONST from './constants'
import errorRoutes from './error'

import gblFnStore from './gblFnStore'
export const setPageFn = gblFnStore.setPageFn
export const getPageFn = gblFnStore.getPageFn

export const p = (() => {
	
	if (window.p) return window.p

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

	const getRoutes = () => routes

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
	const getApp = () => THIS

	const setState = (gbl) => THIS.state = gbl || {}
	const setAfterNavigate = (fn) => on['afterNavigate'] = fn.bind(THIS)
	const setBeforeNavigate = (fn) => on['beforeNavigate'] = fn.bind(THIS)
	const setOn404 = (fn) => on['on404'] = fn.bind(THIS)

	const navigate = async (_path, state = false) => {
		
		// make sure path makes sense
		// default to window location
		if (!_path) _path = `${window.location.pathname}${window.location.search}`

		// get path and query string
		let [path, search] = _path.split('?')

		// tidy path
		if (path.substr(0, 1) !== '/') path = `/${path}`
		if (!search) search = '' 
		let location = path

		// find appropriate route
		let r = await getRoute(routes, path)

		// bugger.
		if (!r) r = await getRoute(routes, '/404')

		if (await on.beforeNavigate() === CONST.PREVENT_NAVIGATION) return

		// save current state
		history.replaceState(THIS.page.state, null, null)

		// external
		if (r.external && window.location.pathname !== path) { // prevents redirect loop
			window.location = _path
			return
		}
		
		// clear container?
		if (r.clearBefore) THIS.container.empty().scrollTop(0)

		// provide query string?
		const searchObj = {}
		if (r.allowQueryString && search) {
			const obj = new URLSearchParams(search)
			obj.forEach((val, key) => searchObj[key] = val)
			location = `${path}?${search}`
		}

		const pageArgs = Object.assign({}, r.defaultArguments, r.arguments, searchObj)

		// update THIS.page with new route information
		THIS.page = { 
			args: pageArgs  || {},
			name: r.name,
			route: r,
			state: state || {},
		}

		// history/state stuff
		if (!state) {
			history.pushState(THIS.page.state, r.name, location)
		} else {
			history.replaceState(state, r.name, location)
		}

		// bind THIS, and call with defaults/args
		if (!u.isFunction(r.fn)) return

		await r.fn.bind(THIS)(pageArgs)

		await on.afterNavigate()
	}

	const eventsListeners = {}

	eventsListeners.click = (evt) => {
		if (evt.target.tagName !== 'A') return
		if (evt.target.host !== window.location.host) return // Goodby...
		evt.preventDefault()
		navigate(`${evt.target.pathname}${evt.target.search}`)
	}

	eventsListeners.popstate = (evt) => navigate(false, evt.state) 

	let onLinkEnabled = false
	const enableOnLink = () => {
		if (!onLinkEnabled) window.addEventListener('click', eventsListeners.click)
		onLinkEnabled = true
	}
	const disableOnLink = () =>{
		if (onLinkEnabled)  window.removeEventListener('click', eventsListeners.click)
		onLinkEnabled = false
	}
	enableOnLink()

	let onPopStateEnabled = false
	const enableOnPopState = () => {
		if (!onPopStateEnabled) window.addEventListener('popstate', eventsListeners.popstate)
		onPopStateEnabled = true
	}
	const disableOnPopState = () => {
		if (onPopStateEnabled) window.removeEventListener('popstate', eventsListeners.popstate)
		onPopStateEnabled = false
	}
	enableOnPopState()

	window.p = {
		getApp,
		getRoutes,
		navigate,
		setAfterNavigate,
		setApp,
		setBeforeNavigate,
		setContainer,
		setOn404,
		setRoute,
		setState,
		setPageFn,
		getPageFn,
		enableOnLink,
		enableOnPopState,
		disableOnLink,
		disableOnPopState
	}

	return window.p
})()

export default p
import u from '@t1m0thy_michael/u'
import d from '@t1m0thy_michael/d'

import CONST from './constants'
import routeFactory from './routeFactory'
import navigate from './navigate'

export const p = (() => {

	const obj = {
		id: u.makeID(10),
		hooks: {
			CONST: CONST,
		},
		// holds configured route objects. See routeFactory()
		routes: [],
		container: d('body'),
		// this will hold a COPY of the currenly active route definition
		PAGE_THIS_PAGE: {},
		PAGE_THIS: {
			get container() {
				return obj.container
			},
			get page() {
				return obj.PAGE_THIS_PAGE
			},
			app: {}

		},
		settings: {
			navigateOnNotMatched: false,
		},
		eventsListeners: {}
	}

	// glb will be bound to each page setup function
	obj.hooks.setThis = (gbl) => {
		obj.PAGE_THIS.app = gbl
		return obj.hooks
	}

	obj.hooks.setContainer = (_content) => {
		const cont = d(_content)
		if (!cont.exists || !cont.isAppended) throw 'container must exist'
		obj.container = cont
		return obj.hooks
	}

	obj.hooks.setRoute = (_routes) => {
		u.makeSureItsAnArray(_routes).forEach((def) => {
			obj.routes.push(routeFactory(def))
		})
	}

	obj.hooks.setNavigateOnNotMatched = (val) => obj.settings.navigateOnNotMatched = !!val

	obj.hooks.navigate = (path = false, state = false) => navigate(obj, path, state)

	obj.eventsListeners.click = (evt) => {
		if (evt.target.tagName !== 'A') return
		if (evt.target.host !== window.location.host) return // Goodby...
		evt.preventDefault()
		obj.hooks.navigate(evt.target.pathname)
	}

	obj.eventsListeners.popstate = (evt) => {
		console.log('popstate', evt.state)
		obj.hooks.navigate(evt.state.path || window.location.pathname, evt.state)
	}

	window.addEventListener('popstate', obj.eventsListeners.popstate)

	window.addEventListener('click', obj.eventsListeners.click)

	const errorPage = function () {
		console.warn(this.page.name)
	}

	obj.hooks.setRoute([
		{ name: '404', url: '404', fn: errorPage },
		{ name: '500', url: '500', fn: errorPage },
	])

	return obj.hooks
})()

export default p
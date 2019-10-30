import d from '@t1m0thy_michael/d'
import u from '@t1m0thy_michael/u'

import createRoute from './createRoute'
import getRoute from './getRoute'
		
	const app = {
		app: {},
		container: d('body'),
		eventsListeners: {},
		page: {},
		routes: {},
		beforeNavigate: () => {},
		afterNavigate: () => {},
	}
	
	const setRoute = (arr) => {
		u.makeSureItsAnArray(arr).forEach((def) => {
			const rut = createRoute(def)
			app.routes[rut.url] = rut
		})
	}

	const setContainer = (selector) => {
		const cont = d(selector)
		if (!cont.exists || !cont.isAppended) throw 'container must exist'
		app.container = cont
	}

	const setThis = (gbl) => {
		app.app = gbl
	}

	const navigate = async (path, state = false) => {

		await app.beforeNavigate()

		// clear container
		app.container.empty().scrollTop(0)

		// make sure path makes sense
		if (!path) path = window.location.pathname
		if (String(path).substr(0, 1) !== '/') path = `/${path}`
		
		// find appropriate route
		const r = await getRoute(app.routes, path)

		// bugger.
		if (!r) throw new Error(404)

		// stats
		r.visits++

		// copy route info to this.page[name]
		app.page[r.name] = ((r.name) ? Object.assign({}, r) : {})

		// deal with history API stuff
		if (state){
			history.replaceState(state, r.name, path)
		} else {
			history.pushState({ path: path }, r.name, path)
		}

		// bind app.this, and call with args
		await r.fn.bind(app)(Object.assign({}, r.dfltArg, r.arguments))

		await app.afterNavigate()

	}

	app.eventsListeners.click = (evt) => {
		if (evt.target.tagName !== 'A') return
		if (evt.target.host !== window.location.host) return // Goodby...
		evt.preventDefault()
		navigate(evt.target.pathname)
	}

	app.eventsListeners.popstate = (evt) => {
		const state = u.get(evt, 'state.path')
		if (!state) return
		navigate(state.path || window.location.pathname, evt.state)
	}

	window.addEventListener('popstate', app.eventsListeners.popstate)

	window.addEventListener('click', app.eventsListeners.click)


export default {
	setRoute,
	setContainer,
	setThis,
	navigate,
}

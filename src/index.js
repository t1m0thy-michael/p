import u from '@t1m0thy_michael/u'
import e from '@t1m0thy_michael/e'
import d from '@t1m0thy_michael/d'
window.d = d
export const CONST = {
	PREVENT_NAVIGATION: 1
}

// holds configured route objects. See routeFactory()
const routes = []

// special page function
const pages = {}

// holds DOM object for the element whose contents will get 
// cleared with DOM().empty() on navigate()
let template = d('body')
let container = d('body')


// will hold retun values of page setup functions
// { TOKENS: [] }
let pageRtn = null

// for extracting info from path
const regexs = {
	// argument info
	arg: {
		isArray: /\[arr\((int|num|str|bool)\)\]/,
		type: /\[(int|num|str|bool)\]/,
		name: /::([a-z0-9_-]+)/,
	},
	// data types
	types: {
		int: '[0-9]+',
		str: '[a-zA-Z_-]+',
		bool: 'true|false|0|1', 
	}
}
// will be bound to page functions.
let APP_THIS = {
	get container() { return container }
}

// glb will be bound to each page setup function
export const setThis = (gbl) => {
	APP_THIS.APP = gbl
}
export const getThis = () => APP_THIS

export const setSpecial = (page, fn) => pages[page] = fn.bind(APP_THIS)
export const setHomepage = u.curry(setSpecial)('home')
export const set404 = u.curry(setSpecial)('400')
export const set500 = u.curry(setSpecial)('500')
export const gotoPage = (name, ...args) => {
	if (!pages[name]) throw `PAGE ${name} NOT FOUND`
	pages[name](...args)
}

export const setContainer = (content_container) => {
	console.log('setContainer')
	container = d(content_container)
	console.log(container.element)
}

export const setTemplate = (definition, appendTo = 'body') => {
console.log('setTemplate')
	if (template.element.tagName !== 'BODY') template.remove()
	template = d(definition)
	template.appendTo(appendTo)
}

export const clearPage = () => {
	container.empty() 
	
	if (u.isObject(pageRtn) && pageRtn.TOKENS) e.remove(pageRtn.TOKENS)
	pageRtn = []
}

// creates array from path string
const getPathArr = (path) => {
	while (String(path).indexOf('//') > -1) {
		path = path.replace('//', '/')
	}
	return u.clean('', path.split('/'))
}

const parseArg = (arg, type) => {
	switch(type){
		case 'int': return parseInt(arg)
		case 'num': Number(arg)
		case 'bool': return !!arg
		default: return String(arg)
	}
}

// Create route objects from definition
// Dynamicly builds regex for path and argument mapping
const routeFactory = (obj) => {
	let route = {
		// object: {name, type, idx}. these are settings for args passed in route url
		args: [], 
		// defauly args object. args are assigned over this 
		dfltArg: obj.arg || {}, 
		// filepath will be downloaded. If set fn is expected to be a string function name.
		filepath: obj.filepath || null, 
		// function to run whan route matched
		fn: obj.fn, 
		// name is used to index pages object
		name: obj.name || null,
		// path array (without arguments)
		path: [], 
		// Will hold regex
		rx: null, 
	}

	let rx = ''
	getPathArr(obj.url)
		.forEach((slug, idx) => {
			// slug is argument
			if (slug.substr(0, 2) === '::') {
				const name = slug.match(regexs.arg.name)[1]
				const type = slug.match(regexs.arg.type)[1]
				rx += `\\/${regexs.types[type]}`
				route.args.push({ name, type, idx })
			// slug is path
			} else {
				route.path.push(slug)
				rx += `\\/${slug}`
			}
		})

	route.len = route.args.length + route.path.length
	route.rx = new RegExp(`^${rx}$`)

	if (route.name && route.fn){
		pages[route.name] = route.fn
	}

	return route
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

		const evtResp = await e.pub({ topic: 'p/willnavigate' })
		if (evtResp && evtResp.length) {
			for (let i in evtResp) {
				// if we've got a response, do what it wants
				if (u.isObject(evtResp[i]) && evtResp[i].action === CONST.PREVENT_NAVIGATION) {
					console.warn('Navigation prevented', evtResp[i])
				}
			}
		}

		clearPage()
		container.scrollTop(0)

		// figure out the new path...
		const pathArr = getPathArr(path)
		let found = {}
		let args = {}
		// navigate straight to home 
		if (pathArr.length === 0) {
			history.pushState(state, null, '/')
			pages.home()

		// find the correct route
		} else {

			for (let idx in routes) {

				if (routes[idx].rx.test(path)) {
					for (let i = 0; i < u.sizeOf(routes[idx].args); i++) {

						const arg = parseArg(
							pathArr[routes[idx].args[i].idx],
							routes[idx].args[i].type
						)

						args[routes[idx].args[i].name] = arg
					}
					found = routes[idx]
				}
			}

			// If we've got a filepath we need to load the extra script
			if (u.isString(found.filepath)) {

				await d.script(found.filepath)

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
				found.fn = pages[404]
				path = '/404'
				args.code = 404
			}

			const args_to_pass = Object.assign({}, found.dfltArg, args)

			pageRtn = await found.fn.bind(APP_THIS)(args_to_pass)
		}

	} catch (e) {
		path = '/500'
		pages[500]({ code: 500, err: e })
	}

	history.pushState(state, null, path)
	e.pub({ topic: 'p/navigate/done' })
}


e.sub({ topic: 'p/go', fn:  navigate })

window.addEventListener('popstate', (evt) => navigate(window.location.pathname, evt.state))

document.addEventListener('click', (evt) => {
	if (evt.target.tagName !== 'A') return
	if (evt.target.host !== window.location.host) return // Goodby...
	evt.preventDefault()
	e.pub({
		topic: 'p/go',
		data: evt.target.pathname
	})
})

export default {
	CONST,
	getThis,
	gotoPage,
	navigate,
	set404,
	set500,
	setContainer,
	setHomepage,
	setSpecial,
	setRoute,
	setTemplate,
	setThis,
}
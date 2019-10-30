import { clean } from '@t1m0thy_michael/u'

export const pathToArray = (path = '') => {
	while (String(path).indexOf('//') > -1) {
		path = path.replace('//', '/')
	}
	return clean('', path.split('/'))
}

export const parseType = (arg, type) => {
	switch(type){
		case 'int': return parseInt(arg)
		case 'num': return Number(arg)
		case 'bool': return String(arg).toLowerCase() === 'false' ? false : !!arg
		default: return String(arg)
	}
}

export const parseArg = (arg, type) => {
	switch(type){
		case 'int': return parseInt(arg)
		case 'num': return Number(arg)
		case 'bool': return String(arg).toLowerCase() === 'false' ? false : !!arg
		default: return String(arg)
	}
}

export const script = (path) => new Promise((resolve) => {

	// check if already loaded / don't load again
	const elem = document.querySelectorAll(`[src="${path}"]`)
	if (elem.length) {
		resolve({
			path,
			script: elem,
			status: 'ok'
		})
		return
	}

	const script = document.createElement('script')
	script.onload = () => resolve({
		path,
		script: script,
		status: 'ok'
	})

	script.onerror = () => resolve({
		path,
		script: null,
		status: 'error'
	})
	script.src = path
	document.head.appendChild(script)
})
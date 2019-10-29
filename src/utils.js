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
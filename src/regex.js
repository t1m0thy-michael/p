// detect argument information in route url string
export const arg = {
	isArray: /\[arr\((int|num|str|bool)\)\]/,
	type: /\[(int|num|str|bool)\]/,
	name: /::([a-z0-9_-]+)/,
}

// extract arguments of type from URL
export const types = {
	int: '[0-9]+',
	str: '[a-zA-Z0-9_-]+',
	bool: 'true|false|0|1',
	num: '[0-9]+.?[0-9]+'
}

export default {
	arg,
	types,
}
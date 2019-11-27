import d from '@t1m0thy_michael/d'

export const errorPageFactory = () => function (args) {
	d([
		{ h1: String(args.code) },
		{ p: 'It\'s all gone Pete Tong' }
	]).appendTo(this.container)
}

export const errorRoutes = [
	{
		name: 'It\'s all gone Pete Tong',
		url: '::code[int]',
		fn: errorPageFactory(),
	}
]

export default errorRoutes
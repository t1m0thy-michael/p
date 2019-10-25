import d from '@t1m0thy_michael/d'

export default function errorPage({
	code,
	msg,
}) {
	console.log(code, msg)
	d([
		{ h1: String(code) },
		{ h2: msg },
	])
	console.log(arguments)
}
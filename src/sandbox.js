// import u from '@t1m0thy_michael/u'
import e from '@t1m0thy_michael/e'
window.e = e
import d from '@t1m0thy_michael/d'
d.setEventbus(e)
window.e = e

import p from './p'

d([
	{ h1: 'Title here'},
	{ div: [
		{ a: 'Home', name: 'Home', href: '/' },
		d.br(),
		{ a: 'Page 2', name: 'Page 2', href: '/page2/qwerty/123' },
		d.br(),
		{ a: 'Page 3', name: 'Page 3', href: '/page3/123/456' },
		d.br(),
		{ a: 'Page 4', name: 'Page 4', href: '/page4/arg1/srg2' },
		d.br(),
		{ a: 'Fake Route', name: 'No real', href: '/notreal/arg1/srg2' },
	]},
	{ div: [], id: 'cont1', width: '100%', height: '500px', background: { colour: 'rgb(106, 137, 202)'}},
]).appendTo('body')

const app = {
	my: 'object'
}


p.setThis(app)
p.setContainer('#cont1')

const pageFactory = (title) => function (...args) {
	console.log(`load ${title}`)
	d([
		{
			div: `${title} : ${args[0].arg1} : ${args[0].arg2} : ${this.page.visits}`
		},
	]).appendTo(this.container)
}
 
p.setRoute([
	{ name: 'home', url: '/', fn: pageFactory('home'), arg: {a: 1, b: 2} },
	{ name: 'page 2', url: 'page2/::arg1[str]/::arg2[int]', fn: pageFactory('page 2'), arg: {a: 1, b: 2} },
	{ name: 'page 3', url: 'page3/::arg1[int]/::arg2[int]', fn: pageFactory('page 3'), arg: {a: 3, b: 4} },
	{ name: 'page 4', url: 'page4/::arg1[str]/::arg2[str]', fn: pageFactory('page 4'), arg: {a: 5, b: 6} },
])

p.navigate()


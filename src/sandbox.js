// import u from '@t1m0thy_michael/u'
import e from '@t1m0thy_michael/e'
window.e = e
import d from '@t1m0thy_michael/d'
d.setEventbus(e)
window.e = e

import p from './page'

d([
	{ h1: 'Title here'},
	{ div: [], id: 'cont'}
]).appendTo('body')

p.setContainer('#cont')
window.p = p


const app = {
	my: 'object'
}

p.setThis(app)

const pageFactory = (title) => function (...args) {
	d([
		{
			div: `${title} : ${args[0].arg1} : ${args[0].arg2} : ${this.page.visits}`
		},
		{ a: 'Home', name: 'Home', href: '/' },
		{ a: 'Page 2', name: 'Page 2', href: '/page2/qwerty/123' },
		{ a: 'Page 3', name: 'Page 3', href: '/page3/123/456' },
		{ a: 'Page 4', name: 'Page 4', href: '/page4/aserty/ytresa' },
	]).appendTo(this.container)
}
 
p.setRoute([
	{ name: 'home', url: '/', fn: pageFactory('home'), arg: {a: 1, b: 2} },
	{ name: 'page 2', url: 'page2/::arg1[str]/::arg2[int]', fn: pageFactory('page 2'), arg: {a: 1, b: 2} },
	{ name: 'page 3', url: 'page3/::arg1[int]/::arg2[int]', fn: pageFactory('page 3'), arg: {a: 3, b: 4} },
	{ name: 'page 4', url: 'page4/::arg1[str]/::arg2[str]', fn: pageFactory('page 4'), arg: {a: 5, b: 6} },
])

p.navigate()
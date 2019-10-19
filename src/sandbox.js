import u from '@t1m0thy_michael/u'
import e from '@t1m0thy_michael/e'
import d from '@t1m0thy_michael/d'
d.setEventbus(e)

import p from './index'

const home = function () {
	d({
		a: 'Hello world',
		href: '/page2/one/123'
	}).appendTo(this.container)
}

p.setHomepage(home)

const app = {
	my: 'object'
}

p.setThis(app)

const pageFactory = (title) => function (...args) {
	d([
		{
			div: `${title} : ${args[0].arg1} : ${args[0].arg2}`
		},
		{ a: 'back', href: '/' },

	]).appendTo(this.container)
}
 
p.setRoute([
	{ name: 'page 2', url: 'page2/::arg1[str]/::arg2[int]', fn: pageFactory('page 2'), arg: {a: 1, b: 2} },
	{ name: 'page 3', url: 'page3/::arg1[int]/::arg2[int]', fn: pageFactory('page 3'), arg: {a: 3, b: 4} },
	{ name: 'page 4', url: 'page4/::arg1[str]/::arg2[str]', fn: pageFactory('page 4'), arg: {a: 5, b: 6} },
])

p.setTemplate([
	{h1: 'my heading'},
	{div: [], id: 'contentGoethEre'}
], 'body')

p.setContainer('#contentGoethEre')

//p.setContainer()

p.navigate()
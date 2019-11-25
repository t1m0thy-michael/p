import e from '@t1m0thy_michael/e'
window.e = e
import d from '@t1m0thy_michael/d'
d.setEventbus(e)
window.e = e

import p from './index'

d([
	{ h1: 'Title here'},
	{ div: [
		{ a: 'Home', name: 'Home', href: '/' },
		d.br(),
		{ a: 'Page 2', name: 'Page 2', href: '/page2/qwerty/123' },
		d.br(),
		{ a: 'Page 3', name: 'Page 3', href: '/page3/123/456' },
		d.br(),
		{
			a: 'Page 4',
			name: 'Page 4',
			href: '/page4/arg1/srg2'
		},
		d.br(), {
			a: 'Fake Route',
			name: 'No real',
			href: '/notreal/arg1/srg2'
		},
		d.br(), {
			a: 'external to SPA',
			name: 'external',
			href: '/page5'
		},
		d.br(), {
			a: 'page6a',
			name: 'page 6 a',
			href: '/page6/str/123'
		},
		d.br(), {
			a: 'page6b',
			name: 'page 6 b',
			href: '/page6/str/123/test'
		},
		d.br(), {
			a: 'any1',
			name: 'page 6 b',
			href: '/any/blahsadas'
		},
		d.br(), {
			a: 'any2',
			name: 'page 6 b',
			href: '/any/blahsadas/wf423f43/123123'
		},
		d.br(), {
			a: 'any3',
			name: 'page 6 b',
			href: '/any'
		},
	]},
	{ div: [], id: 'cont1', width: '100%', height: '500px', background: { colour: 'rgb(106, 137, 202)'}},
]).appendTo('body')

p.setContainer('#cont1')



const pageFactory = (title) => function (...args) {

	if (!this.page.state.name) this.page.state.name = this.page.name

	const APP = this

	const ag = d({
		div: [
			'Args',
			JSON.stringify(args)
		]
	})

	const state = d({
		div: [
			'APP state: ',
			APP.state.clickCount || '',
		],
		sub: {
			topic: 'testClick',
			fn: function () {
				console.log(APP.state, this, 'hello?')
				this.innerHTML(`APP state: ${APP.state.clickCount}`)
			}
		}
	})

	const pageState = d({
		div: [
			'PAGE state: ',
			APP.page.state.clickCount || '',
		],
		sub: {
			topic: 'testClick',
			fn: function () {
				console.log(APP.state, this, 'hello?')
				this.innerHTML(`PAGE state: ${APP.page.state.clickCount}`)
			}
		}
	})

	d([
		{ h3: title },
		ag,
		state,
		pageState,
		{
			button: 'click me',
			on: {
				event: 'click',
				fn: () => {
					this.state.clickCount = this.page.name
					this.page.state.clickCount = this.page.name
					console.log(this.page.state)

				},
				topic: 'testClick'
			}
		}
	]).appendTo(this.container)
}
 
p.setRoute([
	{
		name: 'home',
		url: '/',
		fn: pageFactory('home'),
		// onLeave: () => alert('bye, bye home page')
	},{
		name: 'page 2',
		url: 'page2/::arg1[str]/::arg2[int]',
		fn: pageFactory('page 2'),
		// onLeave: () => alert('bye, bye 2')
	}, {
		name: 'page 3',
		url: 'page3/::arg1[int]/::arg2[int]',
		fn: pageFactory('page 3'),
		onLeave: function () {
			console.log(this)
		}
	}, {
		name: 'page 4',
		url: 'page4/::arg1[str]/::arg2[str]',
		fn: pageFactory('page 4'),
		// onLeave: () => alert('bye, bye 4')
	}, {
		name: 'outside SPA',
		url: 'page5',
		fn: pageFactory('page 4'),
		external: true
	}, {
		name: 'optional args',
		url: 'page6/::arg1[str]/::opt1[int]/::?opt2[str]',
		fn: pageFactory('page 6'),
	}, {
		name: 'optional args',
		url: 'any/',
		fn: () => console.log('any'),
	}, {
		name: 'optional args',
		url: 'any/*',
		external: true
	},
])

p.setBeforeNavigate(function (){ console.log('before navigate', window.location.pathname, history.state, this.page.state) })
p.setAfterNavigate(function (){ console.log('after navigate', window.location.pathname, history.state, this.page.state) })

p.navigate()

p.setOn404(function (path) {
	window.location.href = path
})


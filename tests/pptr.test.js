const path = require('path')
const pptr = require('puppeteer')
const pti = require('puppeteer-to-istanbul')

const chai = require('chai')
const assert = chai.assert

let browser
let pagez

describe('dom pptr tests', function () {

	before(async () => {

		browser = await pptr.launch({
			headless: false,
			devtools: true
		})
		page = await browser.newPage()

		await Promise.all([
			page.coverage.startJSCoverage(),
			page.coverage.startCSSCoverage()
		]);

		await page.setViewport({ width: 800, height: 600 })
		await page.goto('file:///' + path.resolve('./build/pptr.html'))
	})

	describe('test test', () => {
		
		it('title contain "pptr"', async () => {
			let expected = 'pptr'
			let title = await page.title()
			assert.equal(title, expected)
		}).timeout(50000)

		it('tests attribute.id', async () => {

			await page.evaluate( //() => {
				"dom('h1').id('YO_BITCHES')"
				//}
			)

			let test = await page.evaluate( //() => {
				"dom('h1').id()"
				//}
			)
			console.log(test)
			assert.ok(test === 'YO_BITCHES')

		})
	})

	after(async () => {

		const [jsCoverage, cssCoverage] = await Promise.all([
			page.coverage.stopJSCoverage(),
			page.coverage.stopCSSCoverage(),
		]);
		pti.write([...jsCoverage, ...cssCoverage])
		await browser.close()

	})
})
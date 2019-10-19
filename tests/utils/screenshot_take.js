/*
	Factory requires save directory and pptr page object
*/
export const takeScreenshotFactory = ({
	dir = './tests/screenshots',
	page = false
}) => {
	if (!page) throw 'Where\'s the page at?'

	return async function (filename, UPDATE_GOLDEN = false) {
		await page.screenshot({
			path: `${dir_screenshots}/${filename}.png`,
			fullPage: true
		})
		if (UPDATE_GOLDEN) {
			await page.screenshot({
				path: `${dir_screenshots}/golden/${filename}.png`,
				fullPage: true
			})
		}
	}
}

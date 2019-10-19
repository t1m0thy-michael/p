const fs = require('fs')
const pixelmatch = require('pixelmatch')
const PNG = require('pngjs').PNG
	
export const compareScreenShotFactory = ({
	dir = './tests/screenshots',

}) => {
	return (filename) => new Promise((resolve) => {

		const img1 = fs.createReadStream(`${dir}/${filename}.png`)
			.pipe(new PNG())
			.on('parsed', compareImages)

		const img2 = fs.createReadStream(`${dir}/golden/${filename}.png`)
			.pipe(new PNG())
			.on('parsed', compareImages)

		let imgCount = 0

		function compareImages() {

			if (++imgCount < 2) return

			const diff = new PNG({
				width: img1.width,
				height: img1.height
			})
			const diffPixels = pixelmatch(
				img1.data,
				img2.data,
				diff.data,
				img1.width,
				img1.height, {
					threshold: 0.1
				}
			)

			diff.pack().pipe(fs.createWriteStream(`${dir}/${filename}_Compare.png`))

			resolve({ diffPixels })
		}
	})
}
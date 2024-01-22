import jimp from "jimp";

export default function resizeImage({ pathIn, pathOut, file, size, blur }) {
	return new Promise((resolve, reject) => {
		const src = `${pathIn}/${file}`;
		let dest = `${pathOut}/${size}/${file}`;

		if(dest.slice(-4)) {
			dest = dest.replace(".jpeg",".jpg");
		}

		// console.log(`- resizing ${file} -> ${size}`);

		jimp.read(src)
			.then(img => {
				if (blur) img
					.resize(size, jimp.AUTO)
					.blur(1)
					.quality(100)
					.write(dest, resolve);
				else img
					.resize(size, jimp.AUTO)
					.quality(70)
					.write(dest, resolve);
			})
			.catch(reject);
	});
}
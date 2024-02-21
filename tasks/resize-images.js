import fs from "fs";
import mkdirp from "mkdirp";
import resize from "./resize-image.js";

const CWD = process.cwd();
console.log(CWD)
const pathIn = `${CWD}/album_art`;
const pathOut = `${CWD}/album_art_resized`;
const sizes = [150];

function getNewImages() {
	const filesIn = fs.readdirSync(pathIn).filter(d => d.includes('.jpg'));
	const filesOut = fs.readdirSync(`${pathOut}/${sizes[0]}`).filter(d => d.includes('.jpg'));
	return filesIn.filter(d => !filesOut.includes(d));
}


function makeThumbnail(file) {
	return new Promise((resolve, reject) => {
		const promises = sizes.map(size => resize({ pathIn, pathOut, file, size, blur: size === sizes[0] }));

		Promise.all(promises)
			.then(resolve)
			.catch(reject);
	});
}

(async () => {
	console.log("task: resizing thumbnails - stories");

	sizes.forEach(size => mkdirp.sync(`${pathOut}/${size}`));

	const files = getNewImages();

	try {
		for (let file of files) {
			await makeThumbnail(file);
		}
	} catch (err) {
		console.error(err);
	}

	console.log('DONE: resizing thumbnails - stories');
	process.exit();
})();


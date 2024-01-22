import fs from "fs";
import mkdirp from "mkdirp";
import resize from "./resize-image.js";

const CWD = process.cwd();
console.log(CWD)
const pathIn = `${CWD}/rolling_test`;
const pathOut = `${CWD}/rolling_images_resized`;
const sizes = [256];

function getNewImages() {
	const filesIn = fs.readdirSync(pathIn).filter(d => d.match(/jpg|jpeg|png/))//.filter((d,i) => i < 3);//
	const filesOut = fs.readdirSync(`${pathOut}/${sizes[0]}`).filter(d => d.match(/jpg|jpeg/));
	return filesIn.filter(d => !filesOut.includes(d));
}


function makeThumbnail(file) {
    console.log(file)
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

    console.log(files)

	try {
		for (let file of files) {
            console.log(file)
			await makeThumbnail(file);
		}
	} catch (err) {
		console.error(err);
	}

	console.log('DONE: resizing thumbnails - stories');
	process.exit();
})();


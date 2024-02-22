import fs from  "fs"
import Spritesmith from "spritesmith"
import dsv from "d3-dsv"
import csvParser from "csv-parser";


let result = [];

fs.createReadStream("voters.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("end", () => {
    runSprites();
  });

// const Spritesmith = createRequire("spritesmith");
// const dsv = createRequire("d3-dsv");

const EXT = ".jpg";
const size = "100"
const PATH_IN = `rolling_images_resized/${size}`;

function runSprites(){


  result = result
    .filter(d => {
      return d;
    })
    .map(d => d["ID"]);

  console.log(result.length)

  const src = fs
    .readdirSync(PATH_IN)
    .filter(d => {
      let id = d.slice(0,d.length-4);
      return result.indexOf(id) > -1;
    })
    //   .filter(d => d.includes(EXT))
    .map(d => `${PATH_IN}/${d}`);

  Spritesmith.run({ src }, (err, result) => {
    const { width, height } = result.properties;
    if (err) console.log(err);
    const data = [];
    for (const img in result.coordinates) {
      const id = img.replace(`${PATH_IN}/`, "").replace(".jpg", "").replace(".png", "");
      const { x, y } = result.coordinates[img];
      data.push({ id, x, y, width, height });
    }

    const output = dsv.csvFormat(data);
    fs.writeFileSync(`sprite-data_voters_${size}.csv`, output);
    fs.writeFileSync(`spritesheet_voters_${size}.jpg`, result.image);
  });
}




  

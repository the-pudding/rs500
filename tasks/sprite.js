import fs from  "fs"
import Spritesmith from "spritesmith"
import dsv from "d3-dsv"
import csvParser from "csv-parser";


let result = [];

fs.createReadStream("albums.csv")
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
const size = "150"
const PATH_IN = `album_art_resized/${size}`;

function runSprites(){


  result = result
    .filter(d => {
      // return d;
      let rank1 = d["2003 Rank"];
      let rank2 = d["2020 Rank"];

      //for Spotify
      if(+rank2 == "" && rank1 !== "") {
        return d;
      }
      if(d["Spotify Popularity"] == "Not on Spotify") {
        return d;
      }

      //for intro
      // if(+rank1 < 51 && rank1 !== ""){
      //   return d;
      // }
      // else if(+rank2 < 51 && rank2 !== "") {
      //   return d;
      // }
    })
    .map(d => d["Album ID"]);

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
      const id = img.replace(`${PATH_IN}/`, "").replace(EXT, "");
      const { x, y } = result.coordinates[img];
      data.push({ id, x, y, width, height });
    }

    const output = dsv.csvFormat(data);
    fs.writeFileSync(`sprite-data_${size}.csv`, output);
    fs.writeFileSync(`spritesheet_${size}${EXT}`, result.image);
  });
}




  

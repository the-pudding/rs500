<script>
import Voters from "$data/voters.csv"
import data from "$data/albums.csv"


import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, groupSort,groups } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;
export let scrollY;


let voterCountGender = {
    2020:336,
    2003:269
}

let stepValue = "first";
let value;
let sceneSetTo = "first"
let sceneSetToSub = ""

let padding = 0;
let size = 25;
let rowSize = 10;


let textStep = {
    "first":"[21] voters intro",
    "second":"[22] point about gender on this list",
    "third":"[23] point about change in gender by year",
    "third":"[24] disgression on voting point system",
    "fourth":"[25] age for one set",
    "fourth2":"[25 continued] age for both sets",
    "fourth3":"[26] teenage years",
    "fifth":"[26 continued] release comparison",
    "sixth":"[27] concluding",
    "sixth2":"[27 continued] zoom",
    "sixth3":"[27 continued] zoom",
    "sixth4":"[27 continued] zoom",
    "sixth5":"[27 continued] zoom",
    "sixth6":"[27 continued zoom",
    "sixth7":"[27 continued] zoom",
    "sixth8":"[27 continued] zoom"
}

let scenes = Object.keys(textStep);
$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "first" ;
$: stepValue, setScene(stepValue);

$: console.log(sceneSetTo,sceneSetToSub)

let counterTextGroup = {
    0:"Charted at #1",
    1:"Charted #2-40",
    2:"Charted #41-200",
    3:"Never charted"
}

let counterTextGender = {
    0:"She/her",
    2:"Non-binary/They/Them",
    1:"He/Him",
    3:"Groups"
}

let firstScene = [
    {
        year:2003,
        layout:"large",
        dataset:"voters"
    }
]
let secondScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"

    }
]
let thirdScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"
    }
]
let fourthScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
]
let fifthScene = [
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"albums",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
]

let sixthScene = [
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"albums",
        direction:"horz"
    }
]

let cols = firstScene;

function setScene(sceneCount){
    sceneSetTo = sceneCount;
    sceneSetToSub = ""

    if(sceneCount == "first"){
        cols = firstScene;
    }
    if(sceneCount == "second"){
        cols = secondScene;  
    }
    if(sceneCount == "third"){
        cols = thirdScene;
    }
    if(sceneCount == "fourth"){
        cols = fourthScene;
    }
    if(sceneCount == "fourth2"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "2"
    }
    if(sceneCount == "fourth3"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "3"
    }
    if(sceneCount == "fifth"){
        cols = fifthScene;
    }
    if(sceneCount == "sixth"){
        cols = sixthScene;
    }
    if(sceneCount == "sixth2"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "2"
    }
    if(sceneCount == "sixth3"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "3"
    }
    if(sceneCount == "sixth4"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "4"
    }
    if(sceneCount == "sixth5"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "5"
    }
    if(sceneCount == "sixth6"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "6"
    }
    if(sceneCount == "sixth7"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "7"
    }
    if(sceneCount == "sixth8"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "8"
    }

}

function filterData(year,layout,sceneSetTo,sceneSetToSub,dataset,col){

    let temp;
    let test = [];

    let direction = col.direction;

    if(dataset !== "voters"){
        temp = JSON.parse(JSON.stringify(data));
        temp = temp
            .filter(d => d[`${year} Rank`] != "");
    }
    else {
        temp = JSON.parse(JSON.stringify(Voters));
        temp = temp
            .filter(d => d.Year == year);

        temp = temp.sort((a,b) => {
            return b["Gender"].localeCompare(a["Gender"])
        })
    }

    if(sceneSetTo == "first") {
        temp = temp
            .filter(d => d.Race !== "n/a");
    }

    if(sceneSetTo == "second" || sceneSetTo == "third" || sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){
        let tempGroup = [];

        let colCount = 7;

        if(sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){
            // size = 20;
            // rowSize = Math.floor((vw - 7*size)/7/size);
            // let bigCardsNeeded = 100;

            // if(sceneSetTo == "fifth" || sceneSetTo == "sixth"){
            //     bigCardsNeeded = 200;
            // }

            // let availableWidth = (vw - (25*(colCount - 1)))/colCount;
            // let availableHeight = vh/2-50;

            // if(sceneSetTo == "sixth" && sceneSetToSub !== ""){
            //     availableWidth = Math.min(vw,600);
            //     availableHeight = vh - 50;
            // }

            // let maxSquare = 300;
        
            // let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
            // squareSize = Math.min(maxSquare,squareSize);

            // let getMaxSizeOfSquaresInRect = function(n,w,h) {
            //     var sw, sh;
            //     var pw = Math.ceil(Math.sqrt(n*w/h));
            //     if (Math.floor(pw*h/w)*pw < n) sw = h/Math.ceil(pw*h/w);
            //     else sw = w/pw;
            //     var ph = Math.ceil(Math.sqrt(n*h/w));
            //     if (Math.floor(ph*w/h)*ph < n) sh = w/Math.ceil(w*ph/h);
            //     else sh = h/ph;
            //     return Math.max(sw,sh);
            // }
        
            // const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
        
            // squareSize = squareDimension;

            // size = squareSize;
            // rowSize = Math.floor(availableWidth/size);

            // if(dataset == "voters"){
            //     temp = temp.sort((a,b) => {
            //         return a["Birthyear"].localeCompare(b["Birthyear"])
            //     })

            //     temp = temp
            //         .filter(d => d.Birthyear.length == 4);
            // }
            // else {
            //     temp = temp.sort((a,b) => {
            //         return a["Release Year"].localeCompare(b["Release Year"])
            //     })
            // }
        }

        let grouped = groups(temp, d => {

            if(sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){

                if(dataset == "voters"){
                    let rank = d["Teenage Decade"];
                    if(rank == "1940s" || rank == "1930s" || rank == "1950s"){
                        return "1950s and earlier"
                    }
                    return rank;
                } 
                else {
                    let rank;
                    rank = +d["Release Year"];//.slice(2,4);
                    rank = Math.floor(rank / 10) * 10;

                    if(+rank < 196){
                        rank = 195;
                    }
                    return rank;
                }
            }
            
            let gender = d["Gender"];
            if(gender == "man"){
                return 1;
            }
            else if (gender == "woman"){
                return 0;
            }
            else if(gender == "mixed gender group"){
                return 3;
            }
            return 2;
        });
 
        grouped = grouped.sort((a,b) => {
            return a[0] - b[0];
        })

        console.log(grouped)
        
        let groupLengths = [];
        let groupAmounts = [];

        grouped.forEach((d,e) => {
            groupLengths.push(d[1].length)
            groupAmounts.push(e);
        })

        grouped.forEach((d,e) => {

            if(sceneSetTo == "sixth"){
                d[1] = d[1].sort((a,b) => {
                    return +a["2003 Rank"] - +b["2003 Rank"]
                })
            }

            let groupLength = d[1].length;
            
            d[1].forEach((j,i) => {
                j["count"] = i;
                j["adjust"] = Math.ceil(groupLength/rowSize)*size;
                j["rowSize"] = rowSize;
                j["scene"] = sceneSetTo;
                j["sceneSub"] = sceneSetToSub;

                j["size"] = size;
                j["groupCount"] = groupAmounts.indexOf(e)
                j["groupCounts"] = groupLengths
                j["groupLength"] = groupLength;
                j["groupOffset"] = 0;
                tempGroup.push(j)
            })
        });

        tempGroup = tempGroup.sort((a,b) => {
            return +b["ID"] - +a["ID"];
        })

        temp = tempGroup 
    }


    temp
        .forEach((d,i) => {

            if(sceneSetTo == "third"){
                rowSize = 15;
                size = (580/2)/rowSize;
            }

            if(sceneSetTo == "second"){
                size = 35;
                rowSize = Math.floor(600/size);
            }

            if(layout == "large"){
                padding = 2;
            }

            d.pos = getGridPosition(layout,i,d,vw,vh,size,padding,rowSize,direction);

            if(sceneSetTo == "fourth" && col.year == "2003"){
                d.pos[1] = d.pos[1] * -1;
            }
            if(["fifth","sixth"].indexOf(sceneSetTo) > -1 && col.dataset == "albums"){
                d.pos[1] = d.pos[1] * -1;
            }
        });

    return temp;
}

function getColOffset(col,count,vw,sceneSetTo){
    let left = 0;
    let top = 0;

    if(sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){
        top = vh/2;

        if(sceneSetTo == "sixth" && sceneSetToSub !== ""){
            top = vh - 100;
            left = (vw - 600)/2;
        }

        if(col.year == 2003 && sceneSetTo == "fourth"){
            top = top - 50;
        }
        if(col.dataset == "albums" && sceneSetTo == "fifth"){
            top = top - 50;
        }
    }
    else if(sceneSetTo == "first"){
        top = -1000;
    }
    else if(cols[count].layout == "grouped-voter-gender" && cols[count].year == "2020 "){
        if(vw > 600){
            if(cols[count].direction == "vert"){
                let rowSize = 15;
                let size = (580/2)/rowSize;
                left = rowSize*size + 20;
            }
        }
    }
    else {
        if(cols[count].layout == "grid" && cols[count].year == "2020"){
            if(vw > 600){
                left = 15*(580/2)/15 + 20;
            }
            else {
                left = 100*count;
            }
        }
    }
    
    return `${left}px,${top}px`
}


function getVisibility(col,album,sceneSetTo,sceneSetToSub){
    if(sceneSetTo == "sixth"){
        if(+album["2003 Rank"] > 0){
            return 1;
        }
        return .1;
    }
    return null;
}



</script>


<section style="height:100vh; background:red;">
    <h1>test</h1>
</section>

<section>
    <div 
        class="voter-grid year-wrapper {sceneSetTo} {sceneSetTo}-{sceneSetToSub}"
        style="
            height:{vh}px;
        "
    >
        <!-- <div class="buttons">
            <button on:click={() => setScene("first")}>first</button>
            <button on:click={() => setScene("second")}>second</button>
            <button on:click={() => setScene("third")}>third</button>
            <button on:click={() => setScene("fourth")}>fourth</button>
            <button on:click={() => setScene("fifth")}>fifth</button>
        </div> -->
        
        {#each cols as col, i (JSON.stringify(col.year).concat(col.dataset))}
            <div in:fly={{delay:1000, y:50}} class="direction-{sceneSetTo == "third" ? col.direction : 'none'} year year-{col.dataset} year-{col.year} year-{col.layout} scene-{sceneSetTo}"
                style="
                    transform:translate({getColOffset(col,i,vw,sceneSetTo)});
                "
            >
                    {#if col.dataset == "voters"}
                        {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset,col) as voter, j (+voter["ID"])}
                            <div
                                class="img-wrapper"
                                style="--delay: {0}; transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0); width:{voter.pos[2]}px; height:{voter.pos[2]}px;"
                            >

                                {#if sceneSetTo == "fourth" || sceneSetTo == "fifth"}
                                    {#if +voter.count == 0}
                                        {#key sceneSetToSub}
                                            <div class="counter counter-big"
                                                transition:fly={{duration:1000, y:50}}
                                                style="width:{Math.min(10,+voter["groupLength"])*voter["size"]}px;"
                                            >
                                                {#if voter["groupCount"] == 0}
                                                    {#if sceneSetToSub == "3"}
                                                        Teen pre-1960s
                                                    {:else if sceneSetTo == "fifth"}
                                                        pre-1960s
                                                    {:else}
                                                        Born pre-1940s
                                                    {/if}
                                                {:else}
                                                    {#if sceneSetToSub == "3"}
                                                        Teen in {voter["Teenage Decade"]}
                                                    {:else if sceneSetTo == "fifth"}
                                                        {""}
                                                    {:else}
                                                        Born in {voter["Birthyear"].slice(0,3)}0s
                                                    {/if}
                                                {/if}
                                            </div>
                                        {/key}
                                    {/if}
                                {/if}

                                {#if sceneSetTo == "fourth" || sceneSetTo == "fifth"}
                                    {#if voter["count"] == 0 && voter["groupCount"] == 0}
                                        <p
                                            class="year-label"
                                            style="width:200px; transform:translate(0,{+col.year == 2020 ? voter["adjust"] + 20 : -voter["adjust"] - 30}px);"
                                        >
                                            {col.year} Voters
                                        </p>
                                    {/if}
                                {/if}

                                {#if sceneSetTo == "third" && j == 0}
                                    <p class="year-label" style="width:200px;">{col.year} Voters</p>
                                {/if}

                                {#if ["second","third"].indexOf(sceneSetTo) > -1 && +voter.count == 0}
                                    <div class="counter counter-big"
                                        style="width:{(580/2)}px;"
                                    >
                                        {counterTextGender[+voter.groupCount]}, {Math.round(+voter.groupLength/voterCountGender[col.year]*1000)/10}%
                                    </div>
                                {/if}

                                
                                <img class="voter-image" style="" width="100%" height="100%" src="assets/rolling_images_resized/256/{voter["ID"]}.jpg" alt="" />
                                
                                
                            </div>
                        {/each}
                    {:else}
                        {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset,col) as album, j (album["Album ID"])}
                            {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}

                            <div
                                class="img-wrapper" data-count={album.count} data-group={album.groupCount}
                                style="--delay: {0}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                            >

                                {#if sceneSetTo == "fifth" || sceneSetTo == "sixth"}
                                    {#if +album.count == 0}
                                            <div class="counter counter-big"
                                                transition:fly={{duration:1000, y:50}}
                                                style="width:{Math.min(10,+album["groupLength"])*album["size"]}px;"
                                            >
                                                {#if +album.groupCount !== 0}
                                                    {Math.floor(+album["Release Year"]/10)}0s
                                                {:else}
                                                    pre-1960s
                                                {/if}
                                            </div>
                                    {/if}
                                {/if}

                                {#if sceneSetTo == "fifth" || sceneSetTo == "sixth"}
                                    {#if album["count"] == 0 && album["groupCount"] == 0}
                                        <p
                                            class="year-label"
                                            style="width:200px; transform:translate(0,calc(-100% - 25px));"
                                        >
                                            {col.year} Album Rankings
                                        </p>
                                    {/if}
                                {/if}
                            
                            <img style="opacity:{visibility};" class="album-image" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                            
                            
                        </div>
                        {/each}
                    {/if}

            </div>
        {/each}


    </div>
    <div class="steps">
        <Scrolly bind:value>    
            {#each scenes as scene, i}
                {@const active = value === i}

                <div class="step"
                     class:active
                     style="
                        margin-top: {i == 0 ? -vh/2 : ''}px;
                        padding-top: {i == 0 ? '0' : ''}px;
                        min-height: {vh*.75}px;
                    "
                >
                    <p>{textStep[scene]}</p>
                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<style>

.missing-image {
    background-color: black;
}

.voter-grid {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.voter-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.steps {
    pointer-events: none;
}

.fourth .counter {
    transform: translate(0,-100%);
}

.fourth- .year-2020 .img-wrapper img, .fourth- .year-2020 .img-wrapper .year-label {
    opacity: .2;
    transition: opacity .5s;
}

.fourth .year-2003 .counter {
    transform: translate(0,100%);
    top: 5px;
}



.fifth .year-albums .counter {
    transform: translate(0,100%);
    top: 5px;
}

.sixth .year-albums .counter {
    transform: translate(0,100%);
    top: 5px;
}

.fourth-3 .year-2020 .img-wrapper .counter {
    color: blue;
}

.fourth-3 .year-2003 .img-wrapper .counter {
    opacity: 0;
}

.voter {
    background-size: contain;
    width: 70px;
    height: 70px;
    background-color: black;
    background-repeat: no-repeat;
    background-position: center;
}

.wrapper {
    width: 500px;
}

.year {
    transition: transform .5s;
}

/* .fourth, .fifth {
    display: block;
    position: absolute;
    top: 50%;
} */

/* .fourth .wrapper, .fifth .wrapper {
    width: auto;
    position: absolute;
    left: 0;
    top: 100px;
} */

/* .fifth .wrapper:last-of-type {
    top: 500px
} */

.img-wrapper {
    position: absolute;
    /* transition: transform .5s; */
    transition: transform .5s calc(var(--delay) * calc(1s * 0.005));
}

.first .year {
    transform:translate(0,-1000px);
}

.buttons {
    position: absolute;
}

.img-wrapper img {
    transition: opacity .5s;
}

.third .year-label {
    top: -35px;
}

</style>
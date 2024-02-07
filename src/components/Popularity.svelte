<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, sum, groups } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;

let padding = 0;
let size = 25;
let rowSize = 15;

let stepValue = "second";
let value;
let textStep = {
    "second":"share of top 100 songs that charted at #1 or didn't chart",
    "third":"bottom 400 still chart well but not as high as top 100"
}

let scenes = Object.keys(textStep);
let sceneSetTo = "second"
let sceneSetToSub = ""

$: stepValue = setStepValue(value);
$: stepValue, setScene(stepValue);

function setStepValue(){    
    if(+value > -1){
        return scenes[value]
    }

    if(stepValue == scenes[scenes.length - 1]){
        return stepValue;
    }
    else {
        return "second";
    }
}


let yearLabelText = {
    0:"#1-100",
    1:"#101-500"
}

let layoutCounts = {
    "grouped":[0],
    "grouped-voter-gender":[0]
}

let counterTextGroup = {
    0:"Billboard #1 Album",
    1:"Charted #2-200",
    2:"Never Charted",
    3:"Never charted"
}

let secondScene = [
    {
        year:2020,
        layout:"grouped",
        rank:"top100",
        direction:"horz"
    },
    {
        year:2020,
        layout:"grouped",
        rank:"bottom400",
        direction:"horz"
    }
]

let thirdScene = [
    {
        year:2020,
        layout:"grouped",
        rank:"top100",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped",
        rank:"bottom400",
        direction:"horz"
    }
]

let cols = secondScene;

function setScene(sceneCount){
    sceneSetTo = sceneCount;
    sceneSetToSub = ""

    if(sceneCount == "second"){
        cols = secondScene;
    }
    if(sceneCount == "second2"){
        cols = secondScene;
        sceneSetTo = "second";
        sceneSetToSub = "2"
    }
    if(sceneCount == "third"){
        cols = thirdScene;
        sceneSetTo = "third";
        sceneSetToSub = ""
    }
}

function filterData(year,layout,sceneSetTo,sceneSetToSub,col){
    let temp = JSON.parse(JSON.stringify(data));
    
    temp = temp
            .filter(d => d[`${year} Rank`] != "");

    if(sceneSetTo == "second" || sceneSetTo == "third"){
        temp = temp
            .sort((a,b) =>  {
                let aRank = +a[`${year} Rank`]
                let bRank = +b[`${year} Rank`]
                return aRank - bRank;
            })
    }

    if(sceneSetTo == "second" || sceneSetTo == "third"){
        let ranking = col.rank;

        let rankingFloor = 0;
        let rankingCeil = 101;
        if(ranking == "bottom400"){
            rankingCeil = 501;
            rankingFloor = 100
        }
        temp = temp
            .filter(d => d[`${year} Rank`] < rankingCeil && d[`${year} Rank`] > rankingFloor)

        let tempGroup = [];

        let grouped = groups(temp, d => {
            let rank = +d["Peak Billboard Position"];
            if(rank == 1){
                return 0
            }
            // if(rank < 41){
            //     return 1
            // }
            if(rank == 201){
                return 2
            }
            if(rank > 1){
                return 1
            }
        })

        grouped = grouped.sort((a,b) => {
            return a[0] - b[0];
        })

        let groupLengths = [];
        let groupAmounts = [];
        let rowMax = 10;

        grouped.forEach((d,e) => {
            groupLengths.push(d[1].length)
            groupAmounts.push(e);
        })

        grouped.forEach((d,e) => {
            let groupLength = d[1].length;
            
            d[1].forEach((j,i) => {
                j["count"] = i
                j["groupCount"] = groupAmounts.indexOf(e)
                j["groupCounts"] = groupLengths
                j["groupLength"] = groupLength;
                j["groupOffset"] = 0;
                tempGroup.push(j)
            })
        });
        temp = tempGroup 
    }

    if(col.direction == "vert"){
        rowSize = 10;
    }
    else {
        rowSize = 15;
    }

    temp
        .forEach((d,i) => {
            d.rank = d[`${year} Rank`];            
            d.year = year;
            d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize,col.direction);
        });

    return temp;
}

function getColOffset(col,count,vw,sceneSetTo){
    let left = 0;
    let top = 0;

    if(sceneSetTo == "third" || sceneSetTo == "second"){
        if(count == 1){
            if(col.direction == "horz"){
                top = size*10;
            }
            else {
                left = 10*size;
            }
            
        }
    }

    return `${left}px,${top}px`
}

</script>

<section>
    <p class="center">transition to shifting music tastes.
    </p>
    <div 
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >
        {#each cols as col, i (JSON.stringify(col.year).concat(col.rank))}

            {@const baseline = col.rank == "top100" ? 100 : 400}

            <div class="year year-{col.year} year-{col.layout} year-{col.rank}"
                style="transform:translate({getColOffset(col,i,vw,sceneSetTo)});"
            >
                {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col) as album, albumCount (album["Album ID"])}
                    <div
                        class="img-wrapper {album[`${col.year} Rank`]} {+album["rank"] > 100 ? "low-rank": ''}"
                        style="transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >
                        {#if layoutCounts[col.layout].indexOf(+album.count) > -1}
                            <div class="counter counter-big"
                                style="width:{rowSize*size}px"
                            >
                                {#if i == 0}
                                    <strong>{counterTextGroup[+album.groupCount]}</strong>:
                                {/if}
                                {Math.floor(album.groupLength/baseline*100)}%{+album.groupCount == 0 ? " of albums" : ' of albums'}
                            </div>
                            {#if +album.groupCount == 0}
                                <p style="width:{rowSize*size*4}px;" class="year-label">
                                    {@html yearLabelText[i]} Ranking by Rolling Stone
                                </p>
                            {/if}
                        {/if}
                        <img class="{album["Album Genre"]}" style="filter:{sceneSetTo == "first" ? album["Album Genre"] == "Hip-Hop/Rap" ? '':'brightness(.1)' : ''};" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                    </div>
                {/each}
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
                        padding-top: {i == 0 ? '0' : vh*.3}px;
                        min-height: {vh*.75}px;
                        padding-bottom: {i==1 ? vh : ''}px;
                    "

                >
                    <p>{textStep[scene]}</p>

                    
                </div>
            {/each}
        </Scrolly>
    </div>
</section>


<style>

    .year-label {
        width: 100px;
        top: -30px;
    }
    .button {
        position: absolute;
    }
    .second .img-wrapper {
        width: 10px;
        height: 10px;
        background-color: white;
    }

    .second .counter {
        transform: translate(0,-100%);
        width: max-content;
        display: block;
    }
    .graphic {
        display: flex;
    }

    .img-wrapper {
        position: absolute;
    }

    .second .year-bottom400 {
        opacity: .2;
    }
</style>
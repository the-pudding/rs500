<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, sum, groups } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";
	import { Rows } from "lucide-svelte";

export let copy;
export let vw;
export let vh;
export let spriteMap;
export let spriteMapBig;

let padding = 0;
let size = 25;
let rowSize = 15;

let stepValue = "second";
let value;
let textStep = {
    "second":copy.poptwo,
    "third":copy.popthree
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
    0:"Top 100",
    1:"Bottom 400"
}

let layoutCounts = {
    "grouped":[0],
    "grouped-voter-gender":[0]
}

let counterTextGroup = {
    0:"Billboard #1 Album",
    1:"Billboard #2-100",
    2:"#101+",
    3:"Never charted"
}

let secondScene = [
    {
        year:2020,
        layout:"grouped",
        rank:"top100",
        direction:"stacked"
    }
    ,
    {
        year:2020,
        layout:"grouped",
        rank:"bottom400",
        direction:"stacked"
    }
]

let thirdScene = [
    {
        year:2020,
        layout:"grouped",
        rank:"top100",
        direction:"stacked"
    }
    ,
    {
        year:2020,
        layout:"grouped",
        rank:"bottom400",
        direction:"stacked"
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
    if(col.direction == "vert"){
        rowSize = 10;
    }
    else if (col.direction == "stacked"){
        if(col.rank == "top100"){
            rowSize = 3;
        }
        else {
            rowSize = 12;
        }
        
    }
    else {
        rowSize = 15;
    }

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
            if(vw < 600){
                if(rank == 1){
                    return 0
                }
                if(rank < 201){
                    return 1
                }
                if(rank == 201){
                    return 2
                }
            }
            if(rank == 1){
                return 0
            }
            if(rank < 101){
                return 1
            }
            if(rank < 201){
                return 2
            }
            if(rank == 201){
                return 3
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
                j["rowSize"] = rowSize
                j["groupCount"] = groupAmounts.indexOf(e)
                j["groupCounts"] = groupLengths
                j["groupLength"] = groupLength;
                j["groupOffset"] = 0;
                tempGroup.push(j)
            })
        });
        temp = tempGroup 
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
            else if (col.direction == "stacked"){
                if(col.rank == "bottom400"){
                    top = 7*size;
                }
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
    <div class="center-col">
        {#each copy.popone as text, i}
            <p class="center">
                {@html text.value}
            </p>
        {/each}
    </div>
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
                    {@const filePath = album.pos[2] > 100 ? album.pos[2] > 200 ? "full" : "256" : "256"}
                    {@const spriteData = album.pos[2] > 50 ? spriteMapBig.get(`${album["Album ID"]}`)[0] : spriteMap.get(`${album["Album ID"]}`)[0]}
                    {@const spriteBase = album.pos[2] > 50 ? 192 : 96}
                    {@const spriteAdjust = spriteBase/album.pos[2]}
                    {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
                    {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}

                    <div
                        class="img-wrapper {album[`${col.year} Rank`]} {+album["rank"] > 100 ? "low-rank": ''}"
                        style="transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >
                        {#if layoutCounts[col.layout].indexOf(+album.count) > -1}
                            <div class="counter counter-big"
                                style="width:{Math.max((Math.ceil(album.groupLength/album.rowSize)+1)*size,3*size)}px"
                            >
                                <!-- {#if i == 0} -->
                                    <strong>{counterTextGroup[+album.groupCount]}:</strong>
                                <!-- {/if} -->
                                {Math.floor(album.groupLength/baseline*100)}%{+album.groupCount == 0 && i == 0 ? " of albums" : ''}
                            </div>
                            {#if +album.groupCount == 0}
                                <p style="width:{400}px;" class="year-label">
                                    {@html yearLabelText[i]} Albums by Rolling Stone
                                </p>
                            {/if}
                        {/if}

                        {#if album.pos[2] > 100}
                            <img style="
                                "
                                year={album.year} width="100%" height="100%" src="assets/album_art_resized/{filePath}/{album['Album ID']}.jpg" alt=""
                            />
                        {:else}
                            <div class="img-sprite {album["Album Genre"]}" style="
                                background-image:url(assets/spritesheet_{album.pos[2] > 50 ? "192" : "96"}.jpg);
                                background-size:{size};
                                background-position:{pos};
                            "
                            >
                            </div>
                        {/if}
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
                    {#each textStep[scene] as text, i}
                        <div class="text-wrapper">
                            <p class="text-fg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                            <p class="text-bg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                        </div>
                    {/each}
                    
                </div>
            {/each}
        </Scrolly>
    </div>
</section>


<style>

    .year-label {
        width: 100px;
        top: -50px;
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
    .counter strong {
        display: block;
        line-height: 1;
    }

    .second .year-bottom400 {
        opacity: .2;
    }

    .steps {
        pointer-events: none;
    }
</style>
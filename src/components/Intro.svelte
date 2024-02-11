<script>
import data from "$data/albums.csv"

import { getGridPosition } from '$actions/getGridPosition.js';
// import { tweened } from 'svelte/motion';
import {fade, fly, scale} from 'svelte/transition';
// import { flip } from 'svelte/animate';

import { cubicOut } from 'svelte/easing';
import { onMount } from "svelte";
import { setResponse } from "@sveltejs/kit/node";
import { index } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;
export let scrollY;


let stepValue = "fill";
let value;
$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "fill" ;
$: stepValue, setScene(stepValue);

$: console.log(stepValue)

let textStep = {
    "fill":"title",
    "first":"[1] intro to 500 greatest albums, highlight sgt peppers",
    "second":"[2] show 2012 list, things are unchanged. wouldn't last...",
    "third":"[3] new top 10 in 2020...",
    "fourth":"[4] comparison of top 10 in 2020 to where it was in 2003.",
    "fourth2":"[5] Lauryn Hill highlight",
    "fifth":"[6] 174 albums in the 2003 ranking don’t appear at all in the 2020 ranking...CCR highlight",
    "sixth":"[7] switch to 2020 ranking and the empty slots from what dropped",
    "sixth2":"[8] Lemonade...",
    "sixth3":"[9] Kate Bush and Joy Division",
    "sixth4":"[10] Billie Holiday",
    "sixth5":"[11] tk transition..."
}

let scenes = Object.keys(textStep);

let sceneSetTo = "fill"
let sceneSetToSub = ""
let toAnnotate = [];


let counterTextFull = {
    1:"#1 Greatest Album",
    2:"The Remaining Top 10",
    11:"#11 - #250",
    251:"#251 - 500"
}

if(vh < 900){
    counterTextFull = {
        1:"#1",
        5:"#5",
        10:"#10",
        11:"#11 - #250",
        251:"#251 - 500"
    }
}

let counterTextCol = {
    1:"#1",
    5:"#5",
    10:"#10"
}

let layoutCounts = {
    "full":Object.keys(counterTextFull).map(d => +d),
    "col":[1,5,10],
    "fill":[]
}

let fillScene = [
    {
        year:2003,
        layout: "fill"
    }
]

let firstScene = [
    {
        year:2003,
        layout:"full"
    }
]

let secondScene = [
    {
        year:2003,
        layout:"col"
    },
    {
        year:2012,
        layout:"col"
    }
]

let thirdScene = [
    {
        year:2003,
        layout:"col"
    },
    {
        year:2012,
        layout:"col"
    },
    {
        year:2020,
        layout:"col"
    }
]

let fourthScene = [
    {
        year:2003,
        layout:"full"
    },
    {
        year:2020,
        layout:"col"
    }
]

let fifthScene = [
    {
        year:2003,
        layout:"full"
    }
]

let sixthScene = [
    {
        year:2003,
        layout:"full"
    }
]

let cols = [
]

let sizing = {
    "fill":{
        size:80,
        padding:10
    },
    "first":{
        size:40,
        padding:0
    },
    "second":{
        size:40,
        padding:0
    },
    "third":{
        size:40,
        padding:0
    },
    "fourth":{
        size:40,
        padding:0
    },
    "fourth2":{
        size:40,
        padding:0
    },
    "fifth":{
        size:40,
        padding:0
    },
    "sixth":{
        size:40,
        padding:0
    },
    "sixth2":{
        size:40,
        padding:0
    },
    "sixth3":{
        size:40,
        padding:0
    },
    "sixth4":{
        size:40,
        padding:0
    },
    "sixth5":{
        size:40,
        padding:0
    }
}

function filterData(year,layout,sceneSetTo,scrollY){
    
    let size = sizing[sceneSetTo].size;
    let padding = sizing[sceneSetTo].padding;
    let rowSize;

    let temp = JSON.parse(JSON.stringify(data));
    
    if(sceneSetTo == "sixth"){
        temp = temp
            .filter(d => d[`2020 Rank`] !== "")
    }
    else if (sceneSetTo == "fill"){

        temp = temp
            .filter(d => d[`${year} Rank`] !== "")

        rowSize = Math.ceil(vw / size);

        temp = temp.sort((a,b) => {
            return +a[`${year} Rank`] - +b[`${year} Rank`];
        })

        let screenspace = vh*vw;
        let avail = screenspace/((size)*(size));
        console.log(avail)


        temp = temp.slice(0,avail);
    }
    else {
        temp = temp
            .filter(d => d[`${year} Rank`] !== "")
    }

    if(layout == "col"){
        temp = temp.filter(d => d[`${year} Rank`] < 11)
    }

    temp
        .forEach((d) => {
            if(sceneSetTo == "sixth"){
                d.rank = d[`2020 Rank`]
            }
            else {
                d.rank = d[`${year} Rank`]
                d.scroll = scrollY;
            }
            
            d.year = year;
            d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize);
        });

    return temp;
}

function setScene(sceneCount){
    toAnnotate = [];

    if(sceneCount == "fill"){
        cols = fillScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
    }

    if(sceneCount == "first"){
        cols = firstScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
    }
    if(sceneCount == "second"){
        cols = secondScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""

    }
    if(sceneCount == "third"){
        cols = thirdScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""

    }
    if(sceneCount == "fourth"){
        cols = fourthScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
    }
    if(sceneCount == "fourth2"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "2";
        toAnnotate = ["1BZoqf8Zje5nGdwZhOjAtD"]

    }
    if(sceneCount == "fifth"){
        cols = fifthScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
        toAnnotate = ["0i9mOB6mPGqwVvtJEXiwPG"]
    }
    if(sceneCount == "sixth"){
        cols = sixthScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
    }
    if(sceneCount == "sixth2"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "2"
        toAnnotate = ["7dK54iZuOxXFarGhXwEXfF"]
    }
    if(sceneCount == "sixth3"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "3"
        toAnnotate = ["7dK54iZuOxXFarGhXwEXfF","5G5UwqPsxDKpxJLX4xsyuh","5Dgqy4bBg09Rdw7CQM545s"]
    }
    if(sceneCount == "sixth4"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "4"
        toAnnotate = ["7dK54iZuOxXFarGhXwEXfF","5G5UwqPsxDKpxJLX4xsyuh","5Dgqy4bBg09Rdw7CQM545s","4LrLP7DM1KBj8r2Sc098JA"]
    }
    if(sceneCount == "sixth5"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "5"
        toAnnotate = []
    }
}

function getColOffset(col,count,vw){
    if(count == 0){
        if(cols.length > 1 && cols[count].layout == "full"){
            if(cols[count+1].layout == "col"){
                return -50;
            }
        }
        return 0
    }
    else {
        if(cols[count-1].layout == "col"){
            if(vw > 600){
                return 150*count;
            }
            return 100*count;
        }
        else if(cols[count-1].layout == "full"){
            if(vw > 600){
                return 600;
            }
            return 100*count;
        }
        return 0;
    }
}

function getVisibility(col,album,sceneSetTo,sceneSetToSub){
    // console.log(sceneSetTo,sceneSetToSub)
    if(sceneSetTo == "fourth"){
        if(col.year == 2003){
            if(sceneSetToSub == "2"){
                if(album["Album ID"]=="1BZoqf8Zje5nGdwZhOjAtD"){
                    return 1;
                }
                return .2;
            }
            if(+album["2020 Rank"] < 11 && album["2020 Rank"] != ""){
                return 1
            }
            else {
                return .2
            }
        }
        else {
            if(sceneSetToSub == "2"){
                if(album["Album ID"]=="1BZoqf8Zje5nGdwZhOjAtD"){
                    return 1;
                }
                return .2;
            }
            return 1;
        }
        
    }
    if(sceneSetTo == "fifth" && +col.year == 2003){
        if(+album["2020 Rank"] == ""){
            return .2
        }
        else {
            1;
        }
    }

    if(sceneSetTo == "sixth" && +col.year == 2003){
        if([2,3,4].indexOf(+sceneSetToSub) > -1){
            return .2;
        }
        if(sceneSetToSub == "5"){
            return 1;
        }
        if(+album["2003 Rank"] == ""){
            return 0
        }
        else {
            return 1;
        }
    }
    return 1;
}

onMount(() => {
    cols = fillScene;
})

</script>

<section>
    <div
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >        
        {#each cols as col, i (col.year)}
            <div transition:fly={{delay:100, y:50}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw)}px,0px);"> 
                <div class="img-grid">
                    {#each filterData(col.year,col.layout,sceneSetTo,scrollY) as album, i (album["Album ID"])}
                        {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}
                        {@const filePath = album.pos[2] > 100 ? "256" : "256"}

                        <div
                            class="{album["2020 Rank"]} img-wrapper {album[`${col.year} Rank`]}"
                            style="--delay: {album.rank < 11 ? album.rank : 50}; --duration: {album.rank < 11 ? ".5s" : ".5s"}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                        >
                            {#if layoutCounts[col.layout].indexOf(+album.rank) > -1}
                                <div class="counter {col.layout == "full" && +album.rank < 11 ? 'counter-big' : ''}"
                                    style=""
                                >
                                    {col.layout == "full" ? counterTextFull[album.rank] : counterTextCol[album.rank]}
                                </div>
                            {/if}

                            {#if ["col","full"].indexOf(col.layout) > -1 && album[`${col.year} Rank`] == 1}
                                <p class="year-label"
                                    style="width:{album.pos[2]*10}px; display:{sceneSetTo == "sixth" && +col.year == 2003 ? 'none' : ''};"
                                >
                                    {sceneSetTo == "first" ? "500 Greatest Albums of All-time" : col.year}
                                </p>
                            {/if}
                            {#if sceneSetTo == "sixth" && album["2020 Rank"] == 1}
                                <p in:fly={{delay:1000, duration:500, y: 50}} class="year-label">2020 Ranking</p>
                            {/if}

                            <img style="opacity:{visibility};" year={album.year} width="100%" height="100%" src="assets/album_art_resized/{filePath}/{album['Album ID']}.jpg" alt="" />
                        </div>
                    {/each}
                    {#each filterData(col.year,col.layout,sceneSetTo).filter(d => toAnnotate.indexOf(d["Album ID"]) > -1) as album (album["Album ID"])}
                            <div
                                in:scale
                                class="{album["2020 Rank"]} img-wrapper img-annotation"
                                style="
                                    transform:translate3D(calc({album.pos[0]}px - 15px),calc({album.pos[1]}px - 15px),0);
                                    display:{sceneSetTo == "fourth" && +col.year == 2020 ? 'none' : ''};
                                "
                            >
                                <img year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                            </div>
                        <!-- {/if} -->
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    <div class="steps">
        <Scrolly bind:value>    
            {#each scenes as scene, i}
                {@const active = value === i}
                {@const size = sizing[sceneSetTo].size}
                {@const padding = sizing[sceneSetTo].padding}


                <div class="step"
                     class:active
                     style="
                        margin-top: {i == 0 ? -vh : ''}px;
                        padding-top: {i == 0 ? '0' : ''}px;
                        min-height: {vh*.75}px;
                        padding-left: {i == 0 ? '0' : ''}px;
                    "

                >
                    {#if i == 0}
                        <div class="title"
                            style="
                                margin-top:{(sizing["fill"].size+sizing["fill"].padding)*3}px;
                                margin-left:{sizing["fill"].size*2 + sizing["fill"].padding*2}px;
                                width:{(sizing["fill"].size+sizing["fill"]["padding"])*6}px;
                                min-height:{(sizing["fill"].size+sizing["fill"]["padding"])*4}px;
                            "
                        >
                            <h1>What defines greatness?</h1>
                            <h3>Analyzing the Rolling Stone 500</h3>
                            <p>by Chris Dalla Riva</p>
                        </div>
                    {:else}
                        <p>{textStep[scene]}</p>
                    {/if}
                    
                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<style>

.title {
    background-color: var(--color-bg);
    padding: 30px;
}

h1 {
    margin: 0;
    line-height: 1;
    margin-bottom: 25px;
}

h3 {
    margin: 0;
    line-height: 1.3;
}
/* .year-full {
    left: 0;
    right: 0;

} */





.year-full .year-label {
    transform: translate(0,calc(-100% - 22px));
    width: 300px;
}

.year-col .counter{
    transform: translate(calc(-100% - 10px),0%);
    text-align: right;
}

.img-grid {
    position: relative;
    width: 400px;
    height: 600px;
}

.fill .img-wrapper {
    opacity: .7;
}

.img-wrapper {
    position: absolute;
    /* box-shadow: rgba(16, 26, 64, 0) 0px 0px 1px, rgba(16, 26, 64, 0.05) -1px 4px 3px, rgba(16, 26, 64, 0.05) -4px 11px 6px, rgba(16, 26, 64, 0.05) -7px 22px 10px, rgba(16, 26, 64, 0.05) -13px 38px 15px, rgba(16, 26, 64, 0.05) -19px 58px 21px; */
}

.year {
    transition: transform .5s;
}

.year-col .img-wrapper {
    transition: transform var(--duration) calc(var(--delay) * calc(1s * 0.005)), width .5s, height .5s;
    transition-timing-function: ease-in-out;
}

.year-full .img-wrapper {
    transition: transform var(--duration) calc(var(--delay) * calc(1s * 0.005));
    transition-timing-function: ease-in-out;
}

.img-annotation {
    width: 50px;
    height: 50px;
    border: 2px solid white;
    box-shadow: 0px 0px 42px black;
}

.fifth .img-annotation img {
    filter: brightness(0.5);
}

img {
    transition: opacity 1s;
    /* width: calc(100% - 10px); */
    /* height: calc(100% - 10px); */
}
.buttons {
    position: absolute;
    z-index: 100000;
}

@media (max-height: 900px) {
    .year-full .counter-big {
        transform: none;
        font-family: var(--sans);
        width:auto;
        font-size: 14px;
        font-weight: 600;
        -webkit-font-smoothing: antialiased;
        padding-right: 3px;
        padding-left: 3px;
        border-top-left-radius: 3px;
        border-bottom-right-radius: 3px;
        background: var(--color-bg);
    }
}


</style>

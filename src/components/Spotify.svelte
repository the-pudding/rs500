<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, scale, fly} from 'svelte/transition';
import { group, sum } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;

let stepValue = "first";
let value;
let sceneSetTo = "first"
let sceneSetToSub = ""
let padding = 0;
let size = 25;
let rowSize = 10;

let textStep = {
    "first":"let's look at 174",
    "second":"here are those",
    "second2":"compilations",
    "second3":"spotify",
    "third":"change in rankings",
    "third2":"change in rankings - highlight"
}

let scenes = Object.keys(textStep);

$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "first" ;
$: stepValue, setScene(stepValue);



let layoutCounts = {
    "grouped":[0],
    "full":[1,2,11,251],
    "waffle-single":[]
}

let counterTextFull = {
    1:"#1 Greatest Album",
    2:"The Remaining Top 10",
    11:"#11 - #249",
    251:"#251 - 500"
}

let counterTextGroup = {
    0:"Charted at #1 on Billboard",
    1:"Charted #2-40",
    2:"Charted #41-200",
    3:"Never charted"
}

let firstScene = [
    {
        year:2003,
        layout:"full"
    }
]
let secondScene = [
    {
        year:2003,
        layout:"waffle-single"
    }
]

let thirdScene = [
    {
        year:2003,
        layout:"waffle"
    },
    {
        year:2020,
        layout:"waffle"
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
    if(sceneCount == "second2"){
        cols = secondScene;
        sceneSetTo = "second";
        sceneSetToSub = "2"
    }
    if(sceneCount == "second3"){
        cols = secondScene;
        sceneSetTo = "second";
        sceneSetToSub = "3"
    }
    if(sceneCount == "third"){
        cols = thirdScene;
    }
    if(sceneCount == "third2"){
        cols = thirdScene;
        sceneSetTo = "third";
        sceneSetToSub = "2"
    }
}

function filterData(year,layout,sceneSetTo,sceneSetToSub){
    let temp = JSON.parse(JSON.stringify(data));
    
    temp = temp
            .filter(d => d[`${year} Rank`] != "");

    if(sceneSetTo == "second"){
        temp = temp
            .filter(d => d[`2020 Rank`] == "");
    }

    if(sceneSetTo == "third"){
        temp = temp
            .filter(d => d["Spotify Popularity"] == "Not on Spotify")
            .sort((a,b) =>  {
                let aRank = +a[`${year} Rank`]
                let bRank = +b[`${year} Rank`]
                return aRank - bRank;
            })
    }

    temp
        .forEach((d,i) => {
            d.rank = d[`${year} Rank`];            
            d.year = year;
            if(layout == "waffle-single" || layout == "waffle"){

                if(layout == "waffle-single"){
                    size = 600/12;
                    rowSize = 12;
                }
                d.pos = getGridPosition(layout,i+1,d,vw,vh,size,padding,rowSize);
                // d.pos = getGridPosition(layout,i+1,d);
            }
            else {
                d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize);
                // d.pos = getGridPosition(layout,d.rank,d);
            }
        });

    return temp;
}

function getVisibility(col,album,sceneSetTo,sceneSetToSub){
    if(sceneSetTo == "first"){
        if(+album["2020 Rank"] == ""){
            return 1
        }
        else {
            return .2;
        }
    }

    if(sceneSetTo == "second"){
        if(sceneSetToSub == "2"){
            if(["Greatest Hits","Live","Compilation"].indexOf(album["Album Type"]) > -1){
                return 1
            }
            return .2;
        }
        if(sceneSetToSub == "3"){
            if(album["Spotify Popularity"] == "Not on Spotify"){
                return 1;
            }
            return .2;
        }
    }
    if(sceneSetTo == "third"){
        if(sceneSetToSub == "2"){
            if(album["Album ID"]=="NOS120"){
                return 1;
            }
            return .2;
        }
    }

    return 1
}

function getColOffset(col,count,vw){
    if(count == 0){
        return 0
    }
    else {
        if(cols[count-1].layout == "waffle" && cols[count].layout == "waffle"){
            if(vw > 600){
                return 300*count + 20;
            }
            return 100*count;
        }
        return 0;
    }
}

</script>

<section>
    <div 
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >
        <p class="chart-hed">2003 Rolling Stone Rankings</p>
        <div class="button">
            <button on:click={() => setScene("first")}>first</button>
            <button on:click={() => setScene("second")}>second</button>
            <button on:click={() => setScene("second2")}>second-2</button>
            <button on:click={() => setScene("second3")}>second-3</button>
            <button on:click={() => setScene("third")}>third</button>
            <button on:click={() => setScene("third2")}>third-2</button>
        
        </div>
        {#each cols as col, i (col.year)}
            <div in:fly={{delay:1000, y:50}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw)}px,0px);"> 
                <p class="year-label">{col.year}</p>
                {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub) as album (album["Album ID"])}
                    {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}

                    <div
                        class="img-wrapper {+album["rank"] > 100 ? "low-rank": ''}"
                        in:fade={{delay:1000}}
                        style="--delay: {album.rank}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >
                        {#if sceneSetTo == "first"}
                            {#if layoutCounts[col.layout].indexOf(+album.rank) > -1}
                                <div class="counter {col.layout == "full" && +album.rank < 10 ? 'counter-big' : ''}"
                                >
                                    {counterTextFull[album.rank]}
                                </div>
                            {/if}
                        {/if}
                        {#if sceneSetTo == "third"}
                            <div class="counter"
                                style="width:auto;"
                            >
                                #{album.rank}
                            </div>
                        {/if}
                        <img style="opacity:{visibility};" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
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
    .button {
        position: absolute;
        z-index: 10000000;
    }
    .second .img-wrapper {
        width: 10px;
        height: 10px;
    }

    .third .counter {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: black;
        color: white;
        transform: none;
    }

    .graphic {
        display: flex;
    }
    .img-wrapper {
        position: absolute;
        transition: all 1s,
			transform 1s;

    }

    .img-wrapper img {
        transition: opacity .5s;
    }
</style>
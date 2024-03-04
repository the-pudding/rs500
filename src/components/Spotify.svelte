<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, scale, fly} from 'svelte/transition';
import { group, sum } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";
	import { stringify } from "postcss";

export let vw;
export let vh;
export let copy;
export let spriteMap;
export let mobile = false;

let stepValue = "first";
let value;
let sceneSetTo = "first"
let sceneSetToSub = ""
let padding = 0;
let size = 25;
let rowSize = 10;
let toAnnotate = [];

let Annotations = {
    "third2":["NOS120","NOS116"],
    "second3":["NOS124"]
}
let highlighted = null;


let textStep = {
    "first":copy.spotifytwo,
    "second":copy.spotifythree,
    "second2":copy.spotifyfour,
    "second3":copy.spotifyfive,
    "third":copy.spotifysix,
    "third2":copy.spotifyseven
}

let scenes = Object.keys(textStep);

$: stepValue = getStepValue(value);
$: stepValue, setScene(stepValue);


$: console.log(stepValue,value);

function clickEvent(album){
    console.log("clcking")
    highlighted = album["Album ID"];   
}

let getMaxSizeOfSquaresInRect = function(n,w,h) {
    var sw, sh;
    var pw = Math.ceil(Math.sqrt(n*w/h));
    if (Math.floor(pw*h/w)*pw < n) sw = h/Math.ceil(pw*h/w);
    else sw = w/pw;
    var ph = Math.ceil(Math.sqrt(n*h/w));
    if (Math.floor(ph*w/h)*ph < n) sh = w/Math.ceil(w*ph/h);
    else sh = h/ph;
    return Math.max(sw,sh);
}

function getStepValue(){
    if(+value > -1){
        return scenes[value]
    }
    if(stepValue == scenes[scenes.length - 1]){
        return stepValue;
    }
    else {
        return "first";
    }
}

let counterTextFull = {
    1:"#1 Greatest Album",
    2:"The Remaining Top 10",
    11:"#11 - #249",
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

let layoutCounts = {
    "full":Object.keys(counterTextFull).map(d => +d),
    "grouped":[0],
    "waffle-single":[]
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
        layout:"waffle-single"
    }
    // {
    //     year:2003,
    //     layout:"waffle"
    // },
    // {
    //     year:2020,
    //     layout:"waffle"
    // }
]

let cols = firstScene;

function setScene(sceneCount){
    sceneSetTo = sceneCount;
    sceneSetToSub = ""
    toAnnotate = [];
    highlighted = null;


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
        toAnnotate = []
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

        // temp = JSON.parse(JSON.stringify(data));

        temp
            .forEach((d,i) => {
                d.rankText = getRankText(d);
                // d.rank = d.rankText;
            })

        temp = temp
            .filter(d => d["Spotify Popularity"] == "Not on Spotify")
            .sort((a,b) =>  {
                let aRank = +a.rankText
                let bRank = +b.rankText
                return aRank - bRank;
            })


    }

    if(sceneSetTo == "third" || sceneSetTo == "second"){
        let bigCardsNeeded = temp.length;
        let availableWidth = (Math.min(600,vw));
        let availableHeight = vh - 100;
        let maxSquare = 75;
        let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
        squareSize = Math.min(maxSquare,squareSize);
        const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
    
        squareSize = Math.min(squareDimension,maxSquare);
        size = squareSize;
        rowSize = Math.floor(availableWidth/squareSize);
    }

    temp
        .forEach((d,i) => {
            d.rank = d[`${year} Rank`];            
            d.year = year;
            if(layout == "waffle-single" || layout == "waffle"){

                padding = 3;

                if(layout == "waffle-single"){
                    // size = squareSize;
                    // rowSize = ;
                }
                else {
                    rowSize = 5;
                    size = 300/rowSize;
                }

                d.rowSize = rowSize;
                d.pos = getGridPosition(layout,i+1,d,vw,vh,size,padding,rowSize);
            }
            else {
                d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize);
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
            if(album["Album ID"]=="NOS120" || album["Album ID"] == "NOS116"){
                return 1;
            }
            return .2;
        }
    }

    return 1
}

function getRankText(album){
    if(album["2020 Rank"] !== ""){
        if(album["2003 Rank"] == ""){
            return "new";
        }
        return (album["2020 Rank"] - album["2003 Rank"])*-1;
    }
    return 0;
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



<section class:mobile>
    <div class="center-col">
        {#each copy.spotifyone as text, i}
            <p class="center">
                {@html text.value}
            </p>
        {/each}
    </div>
    <div 
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >
        {#each cols as col, i (col.year)}
            <div in:fly={{delay:1000, y:50}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw)}px,0px);"> 
                {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub) as album, j (album["Album ID"])}
                    {@const filePath = album.pos[2] > 100 ? album.pos[2] > 200 ? "full" : "256" : "256"}
                    {@const spriteData = spriteMap.get(`${album["Album ID"]}`)[0]}
                    {@const spriteBase = album.pos[2] > 100 ? sceneSetTo !== "first" ? 150 : 192 : 96}
                    {@const spriteAdjust = spriteBase/album.pos[2]}
                    {@const pos = `-${Math.ceil(+spriteData.x / spriteAdjust)}px -${Math.floor(+spriteData.y / spriteAdjust)}px`}
                    {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}
                    {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}


                    {#if highlighted == album["Album ID"]}
                        <div 
                            class="highlighted-click"
                            style="
                                transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0);
                                height:{album.pos[2]}px;
                                left:{album.pos[2]/2}px;
                            "
                        >
                            <span
                                style=" 
                                "
                            >{album["Album"]}</span>
                        </div>
                    {/if}

                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="img-wrapper {+album["rank"] > 100 ? "low-rank": ''}"
                        on:click={() => clickEvent(album)}
                        in:fade={{delay:1000}} out:fade={{delay:0,duration:1000}}
                        style="--delay: {j}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >

                        


                        {#if sceneSetTo == "first"}
                            {#if layoutCounts[col.layout].indexOf(+album.rank) > -1}
                                <div class="counter {col.layout == "full" && +album.rank < 11 ? 'counter-big' : ''}"
                                >
                                    {counterTextFull[album.rank]}
                                </div>
                            {/if}
                        {/if}


                        {#if ["full"].indexOf(col.layout) > -1 && album.rank == 1}
                            <p class="year-label"
                                style="width:{album.pos[2]*10}px; display:{sceneSetTo == "sixth" && +col.year == 2003 ? 'none' : ''};"
                            >
                                Rolling Stone&rsquo;s <span class="year2003title">2003</span> Ranking of Greatest Albums
                            </p>

                        {/if}


                        {#if ["col","waffle"].indexOf(col.layout) > -1 && j == 0}
                            <p class="year-label"
                                style="width:{album.pos[2]*10}px; display:{sceneSetTo == "sixth" && +col.year == 2003 ? 'none' : ''};"
                            >
                                {@html sceneSetTo == "first" ? "Rolling Stone&rsquo;s 2003 Ranking of Greatest Albums" : `${col.year}${col.layout !== "col" ? ' Ranking' : ''}`}
                            </p>
                        {/if}

                        {#if sceneSetTo == "third"}
                            {#if j == 0}
                                <p class="year-label" style="width:{album.rowSize * album.pos[2]}px;">Ranking Changes (Albums not on Spotify)</p>
                            {/if}

                            <div class="counter"
                                style="
                                    width:auto; opacity:{visibility};
                                    display:{visibility < 1 ? "none" : ''};
                                    color:{album.rankText > 0 ? "rgb(53, 185, 121)" : album.rankText == 0 ? "var(--color-fg)" : "rgb(217, 61, 66)"};
                                "
                            >
                                {+album.rankText > 0 ? "+".concat(JSON.stringify(album.rankText)) : album.rankText == 0 ? "n/a" : album.rankText}
                            </div>
                        {/if}

                        {#if album.pos[2] > 100}
                            <img loading="lazy" style="
                                    opacity:{visibility};
                                    filter:{visibility < 1 ? 'grayscale(.8)' : ''};
                                "
                                year={album.year} width="100%" height="100%" src="assets/album_art_resized/{filePath}/{album['Album ID']}.jpg" alt=""
                            />
                        {:else}
                            <div class="img-sprite {album["Album Genre"]}" style="
                                background-image:url(assets/spritesheet_{album.pos[2] > 100 ? sceneSetTo !== "first" ? "150" : "192" : "96"}.jpg);
                                background-size:{size};
                                filter:{visibility < 1 ? 'grayscale(.8)' : ''};
                                opacity:{visibility};
                                background-position:{pos};
                            "
                            >
                            </div>
                        {/if}


                        <!-- <img style="opacity:{visibility};" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" /> -->
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
                    {#each textStep[scene] as text, i}
                        <div class="text-wrapper">
                            <p class="text-fg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                            <p class="text-bg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                        </div>
                        {#if scene == "third2"}
                            <div
                                in:scale
                                class="img-annotation text-annotation"
                                style="
                                "
                            >
                                <img loading="lazy" width="100%" height="100%" data={Annotations[scene][i]} src="assets/album_art_resized/256/{Annotations[scene][i]}.jpg" alt="" />
                            </div>
                        {/if}

                        {#if scene == "second3" && i == 1}
                            <div
                                in:scale
                                class="img-annotation text-annotation"
                                style="
                                "
                            >
                                <img loading="lazy" width="100%" height="100%" data={Annotations["second3"][0]} src="assets/album_art_resized/256/{Annotations["second3"][0]}.jpg" alt="" />
                            </div>
                        {/if}

                    {/each}


                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<style>

    .steps {
        pointer-events: none;
    }

    .button {
        position: absolute;
        z-index: 10000000;
    }
    .second .img-wrapper {
        width: 10px;
        height: 10px;
    }

    .graphic {
        display: flex;
    }
    .img-wrapper {
        position: absolute;
        transition: transform .5s calc(var(--delay) * calc(1s * 0.005));
        transition-timing-function: ease-in-out;
    }

    .year-waffle .year-label {
       top: -10px;
    }

    .img-wrapper img, .img-wrapper .img-sprite {
        transition: opacity .5s;
    }

    .year-full .year-label {
        transform: translate(0,calc(-100% - 22px));
        width: 300px;
    }

    .third .counter {
        font-weight: 600;
        -webkit-font-smoothing: auto;
        font-size: 16px;
    }

    .third .year-label {
        transform: translate(0,calc(-100% - 5px));
    }

    .mobile .year-label {
        font-size: 16px;
    }

    @media (max-height: 900px) {
        .year-full .counter-big, .year-col .counter-big {
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

        .year-full .year-label {
            transform: translate(0,calc(-100% - 5px));
        }
    }

</style>
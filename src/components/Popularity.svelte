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
export let mobile = false;

let padding = 0;
let size = 25;
let rowSize = 15;
let highlighted = null;

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

let counterTextGroupMobile = {
    0:"Billboard #1",
    1:"#2-200",
    2:"Never charted"
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

function clickEvent(album){
    console.log("clcking")
    highlighted = album["Album ID"];   
}

function setScene(sceneCount){
    sceneSetTo = sceneCount;
    sceneSetToSub = ""
    highlighted = null;

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

        let bigCardsNeeded = 400;
        let availableWidth = (vw-20)*.65;
        let availableHeight = vh - 100;
        let maxSquare = 75;
        let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
        squareSize = Math.min(maxSquare,squareSize);
        const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
    
        squareSize = Math.min(squareDimension,maxSquare);
        let sizeMobile = squareSize;
        let rowSizeMobile = Math.floor(availableWidth/squareSize);

        if(col.rank == "top100"){
            rowSize = 3;
            if(vw < 1100){
                size = sizeMobile
                // console.log(vw,(vw*.25) - 20,sizeMobile,((vw*.25) - 20)/sizeMobile);
                rowSize = Math.floor(((vw*.35) - 20)/sizeMobile);
            }
        }
        else {
            rowSize = 12;
            if(vw < 1100){
                rowSize = rowSizeMobile;
                size = sizeMobile
            }
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
            if(vw < 1100){
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
                j["size"] = size;
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

                    if(vw < 1100){
                        left = vw*.35;
                        top = 0;
                    }
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

<section class:mobile class="{vw < 1100 ? 'vert-stacked' : ''}">
    <div class="center-col" style="margin-top:0px;">
        {#each copy.popone as text, i}
            <p class="center {text.value.match(/class=big/) ? "span-big" : ''}">
                <span class="text-inner">{@html text.value}</span>
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
                    {@const filePath = album.pos[2] > 200 ? "full" : "256"}
                    {@const spriteData = spriteMap.get(`${album["Album ID"]}`)[0]}
                    {@const spriteBase = 96}
                    {@const spriteAdjust = spriteBase/album.pos[2]}
                    {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
                    {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}

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

                    <div
                        class="img-wrapper {album[`${col.year} Rank`]} {+album["rank"] > 100 ? "low-rank": ''}"
                        on:click={() => clickEvent(album)}
                        role="button"
                        tabindex=0
                        on:keydown={() => clickEvent(album)}

                        style="transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >

                        {#if layoutCounts[col.layout].indexOf(+album.count) > -1}
                            <div class="counter counter-big"
                                style="
                                        width:{vw < 1100 && i == 0 ? vw*.3 : Math.max((Math.ceil(album.groupLength/album.rowSize)+1)*album.size,3*album.size)}px;
                                        left:{i == 0 ? '' : ''}px;
                                    "
                            >
                                {#if vw > 1099}
                                    <strong>{counterTextGroup[+album.groupCount]}:</strong>
                                {:else}
                                    {counterTextGroupMobile[+album.groupCount]}
                                {/if}

                                {#if !mobile}
                                    {Math.floor(album.groupLength/baseline*100)}%{+album.groupCount == 0 && i == 0 ? " of albums" : ''}
                                {/if}
                            </div>
                            {#if +album.groupCount == 0}
                                <p style="
                                        width:{i == 0 ? mobile ? vw*.35 : 900 : vw*.7}px;
                                        left:{i == 0 ? '' : ''}px;
                                    "
                                    class="year-label"
                                >
                                    {@html yearLabelText[i]} Albums
                                    {#if vw > 1099}
                                        in the <span class='year2020title'>2020 Ranking</span>
                                    {/if}
                                </p>
                            {/if}
                        {/if}

                        {#if album.pos[2] > 100}
                            <img loading="lazy" style="
                                "
                                year={album.year} width="100%" height="100%" src="assets/album_art_resized/{filePath}/{album['Album ID']}.jpg"
                                alt="Cover art for {album["Clean Name"]}'s {album["Album"]}"
                            />
                        {:else}
                            <div class="img-sprite {album["Album Genre"]}" style="
                                background-image:url(assets/spritesheet_96.jpg);
                                background-size:{size};
                                background-position:{pos};
                            "
                            role="img"
                            aria-label="Ranked #{album.rank} in {col.year}, Cover art for {album["Clean Name"]}'s {album["Album"]}"
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
                            <p class="text-fg {text.value.match(/class=big/) ? "span-big" : ''}" style="margin-bottom:20px; height:100%;"><span class="text-inner">{@html text.value}</span></p>
                            <p class="text-bg {text.value.match(/class=big/) ? "span-big" : ''}" aria-hidden="true" style="margin-bottom:20px; height:100%;"><span class="text-inner">{@html text.value}</span></p>
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

    .vert-stacked .year-label {
        top: -18px;
    }

    .mobile .year-label {
        font-size: 16px;
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

    .vert-stacked .counter {
        font-size: 14px;
    }

    .steps {
        pointer-events: none;
    }
</style>
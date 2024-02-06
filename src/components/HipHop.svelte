<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, sum } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;

let size = 60;
let padding = 3;
let rowSize = 5;

let stepValue = "first";
let value;
let textStep = {
    "first":"In 2003, there were only 26 hip-hop albums on the list, the highest ranked of which was Public Enemy’s It Takes a Nation of Millions to Hold Us Back at 48, the only hip-hop album in the top 100. By 2020, hip-hop had cemented its cultural prominence. The updated list reflected that. 57 hip-hop albums made the cut, 17 of which were in the top 100.",
}

let scenes = Object.keys(textStep);
let sceneSetTo = "first"
let sceneSetToSub = ""

$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "first" ;
$: stepValue, setScene(stepValue);

// $: console.log("value",value)
// $: console.log("step",stepValue)


let layoutCounts = {
    "grouped":[0]
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
        layout:"waffle"
    },
    {
        year:2020,
        layout:"waffle"
    }
]
let secondScene = [
    {
        year:2020,
        layout:"grouped"
    }
]
let cols = secondScene;

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
}

function filterData(year,layout,sceneSetTo,sceneSetToSub){
    let temp = JSON.parse(JSON.stringify(data));
    
    temp = temp
            .filter(d => d[`${year} Rank`] != "");

    if(sceneSetTo == "first"){
        temp = temp
            .filter(d => d["Album Genre"] == "Hip-Hop/Rap")
            .sort((a,b) =>  {
                let aRank = +a[`${year} Rank`]
                let bRank = +b[`${year} Rank`]
                return aRank - bRank;
            })
    }

    if(sceneSetTo == "second"){
        let rankingCeil = 101;
        if(sceneSetToSub == "2"){
            rankingCeil = 501;
        }
        temp = temp
            .filter(d => d[`${year} Rank`] < rankingCeil)

        let tempGroup = [];

        let grouped = group(temp, d => {
            let rank = +d["Peak Billboard Position"];
            if(rank == 1){
                return 0
            }
            if(rank < 41){
                return 1
            }
            if(rank == 201){
                return 3
            }
            if(rank > 40){
                return 2
            }
        })

        let groupLengths = [];
        let rowMax = 10;

        grouped.forEach(d => {
            groupLengths.push(d.length)
        })

        grouped.forEach((d,e) => {

            let groupLength = d.length;

            d.forEach((j,i) => {
                j["count"] = i
                j["groupCount"] = e
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
            if(layout == "waffle"){
                d.pos = getGridPosition(layout,i+1,d,vw,vh,size,padding,rowSize);
            }
            else {
                d.pos = getGridPosition(layout,d.rank,d,vw,vh);
            }
        });

    return temp;
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
        <!-- <p class="chart-hed">Hip Hop Albums in the Rolling Stone 500</p> -->

        {#each cols as col, i (col.year)}
            <div in:fly={{delay:1000, y:50}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw)}px,0);">
                {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub) as album, i (album["Album ID"])}
                    <div
                        class="img-wrapper {album[`${col.year} Rank`]} {+album["rank"] > 100 ? "low-rank": ''}"
                        in:fade={{delay:1000}}
                        style="--delay: {album.rank}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >
                        {#if sceneSetTo == "first"}
                            <div class="counter"
                                style=""
                            >
                                {album.rank}
                            </div>
                        {/if}
                        {#if sceneSetTo == "second"}
                            {#if layoutCounts[col.layout].indexOf(+album5) > -1}
                                <div class="counter"
                                    style=""
                                >
                                    {counterTextGroup[+album.groupCount]}
                                </div>
                            {/if}
                        {/if}

                        {#if ["waffle"].indexOf(col.layout) > -1 && i == 0}
                            <p class="year-label" style="width:200px;">{col.year} Ranking</p>
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
    }
    .second .img-wrapper {
        width: 10px;
        height: 10px;
        background-color: white;
    }

    .second .low-rank {
        background-color: red;
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
        transition: all 1s,
			transform 1s;

    }
</style>
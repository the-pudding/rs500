<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, sum } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;

let padding = 0;
let size = 25;
let rowSize = 10;

let stepValue = "second";
let value;
let textStep = {
    "second":"tk point",
    "second2":"In fact, albums that peaked in the top 40 are more likely to be ranked in Rolling Stone’s top 100 than those that peaked at a lower position."
}

let scenes = Object.keys(textStep);
let sceneSetTo = "second"
let sceneSetToSub = ""

$: stepValue = value ? scenes[value] : "second" ;
// $: stepValue = scenes[value];
$: stepValue, setScene(stepValue);

$: console.log("value",value)
$: console.log("step",stepValue)


let layoutCounts = {
    "grouped":[0]
}

let counterTextGroup = {
    0:"Charted at #1",
    1:"Charted #2-40",
    2:"Charted #41-200",
    3:"Never charted"
}

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
}

function filterData(year,layout,sceneSetTo,sceneSetToSub){
    let temp = JSON.parse(JSON.stringify(data));
    
    temp = temp
            .filter(d => d[`${year} Rank`] != "");

    if(sceneSetTo == "second"){
        temp = temp
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
            d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize);
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
    <p class="center">But beyond shifting tastes, we found four non-musical factors that also help shape this list: popularity, demographics, how we listen, and vote scoring.
    </p>
    <p class="subhead center">tk subhead</p>
    <p class="center">
        You can’t - or at least shouldn’t - vote for something you haven’t heard. Thus, part of the reason Marvin Gaye’s What’s Going On topped Rolling Stone’s 2020 list is that many of the voters had heard it. 
    </p>
    <div 
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >
        <!-- <p class="chart-hed">2023 Rankings</p> -->

        <!-- <div class="buttons">
            <button on:click={() => setScene("second")}>second</button>
            <button on:click={() => setScene("second2")}>second-2</button>
        </div>
         -->
        {#each cols as col, i (col.year)}
            <div in:fly={{delay:1000, y:50}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw)}px,0);">

                {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub) as album, albumCount (album["Album ID"])}
                    <div
                        class="img-wrapper {album[`${col.year} Rank`]} {+album["rank"] > 100 ? "low-rank": ''}"
                        in:fade={{delay:1000}}
                        style="--delay: {album.rank}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                    >
                        {#if sceneSetTo == "first"}
                            <div class="counter"
                                style=""
                            >
                                #{album.rank}
                            </div>
                        {/if}
                        {#if sceneSetTo == "second"}
                            {#if layoutCounts[col.layout].indexOf(+album.count) > -1}
                                <div class="counter counter-big"
                                    style="width:{Math.min(10,+album.groupLength)*size}px"
                                >
                                    {counterTextGroup[+album.groupCount]}: {Math.floor(album.groupLength/100*100)}% of albums
                                </div>
                                {#if +album.groupCount == 0}
                                    <p style="width:{rowSize*size*4}px;" class="year-label">Rolling Stone #1-100</p>
                                {/if}
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
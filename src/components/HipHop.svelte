<script>

import data from "$data/albums.csv"
import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, scale} from 'svelte/transition';
import { group, sum } from "d3";

let sceneSetTo = "second"
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

    if(sceneCount == "first"){
        cols = firstScene;
    }
    if(sceneCount == "second"){
        cols = secondScene;
    }
}


function filterData(year,layout,sceneSetTo){
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
        temp = temp
            .filter(d => d[`${year} Rank`] < 101)

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
            console.log(e)

            d.forEach((j,i) => {
                j["count"] = i
                j["groupCount"] = e
                j["groupCounts"] = groupLengths
                j["groupLength"] = groupLength;
                j["groupOffset"] = 0;
                console.log(e)
                tempGroup.push(j)
            })
        });

        console.log(tempGroup)

        temp = tempGroup 
    }

    temp
        .forEach((d,i) => {
            d.rank = d[`${year} Rank`];            
            d.year = year;
            if(layout == "waffle"){
                d.pos = getGridPosition(layout,i+1,d);
            }
            else {
                d.pos = getGridPosition(layout,d.rank,d);
            }
        });

    return temp;
}

</script>

<button on:click={() => setScene("first")}>first</button>
<button on:click={() => setScene("second")}>second</button>
<button on:click={() => setScene("third")}>second</button>


<div class="{sceneSetTo}">
{#each cols as col, i (col.year)}
    <div in:fade={{delay:1000}} class="wrapper">
        <p class="year-label">{col.year}</p>
        {#each filterData(col.year,col.layout,sceneSetTo) as album (album["Album ID"])}
            <div
                class="img-wrapper {+album["rank"] > 100 ? "low-rank": ''}"
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
                <img class="{album["Album Genre"]}" style="filter:{sceneSetTo == "first" ? album["Album Genre"] == "Hip-Hop/Rap" ? '':'brightness(.1)' : ''};" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
            </div>
        {/each}
    </div>
{/each}
</div>

<style>
    .second .img-wrapper {
        width: 10px;
        height: 10px;
        background-color: white;
    }

    .second .low-rank {
        background-color: red;
    }
    .counter {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: black;
        color: white;
    }
    .graphic {
        display: flex;
    }
    .wrapper {
        margin-top: 20px;
        width: 500px;
        height: 300px;
    }
    .img-wrapper {
        position: absolute;
        transition: all 1s,
			transform 1s;

    }
</style>
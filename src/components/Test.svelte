<script>
import data from "$data/albums.csv"
import Voters from "$data/voters.csv"

import { getGridPosition } from '$actions/getGridPosition.js';
import { tweened } from 'svelte/motion';
import { fade } from 'svelte/transition';

import { cubicOut } from 'svelte/easing';
import { onMount } from "svelte";
import { setResponse } from "@sveltejs/kit/node";

let sceneSetTo = "first"

let counterText = {
    1:"#1 Greatest Album",
    2:"The Remaining Top 10",
    11:"#11 - #500"
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

function changePos(column){
    
    if(cols[column].layout == "full"){
        cols[column].layout = "col";
        cols.push({year:2020,layout:"col"})
    }
    else {
        cols[column].layout = "full"
    }
}

function changeYear(column){
    if(cols[column].year == 2020){
        cols[column].year = 2003;
    }
    else {
        cols[column].year = 2020
    }
}

function filterData(year,layout,sceneSetTo){
    let temp = JSON.parse(JSON.stringify(data));
    
    if(sceneSetTo == "sixth"){
        temp = temp
            .filter(d => d[`2020 Rank`] !== "")
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
            }
            
            d.year = year;
            d.pos = getGridPosition(layout,d.rank);
        });

    return temp;
}

function setScene(sceneCount){
    if(sceneCount == "second"){
        cols = secondScene;
    }
    if(sceneCount == "third"){
        cols = thirdScene;
    }
    if(sceneCount == "fourth"){
        cols = fourthScene;
    }
    if(sceneCount == "fifth"){
        cols = fifthScene;
    }
    if(sceneCount == "sixth"){
        cols = sixthScene;
    }
    sceneSetTo = sceneCount;
}

function getVisibility(col,album){
    if(sceneSetTo == "fourth" && +col.year == 2003){
        if(+album["2020 Rank"] < 11 && album["2020 Rank"] != ""){
            return 1
        }
        else {
            return .2
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
    cols = firstScene;
})

</script>
<!-- <div class="voter-grid">
{#each Voters.sort((a,b) => a.Gender.localeCompare(b.Gender)).filter(d => d["Year"] == "2020") as voter}
    <div class="voter" style="background-color:{voter.Gender == "man" ? "black" : "green"};background-image:url(assets/rolling_images_resized/256/{voter.ID}.jpg);" alt=""></div>
{/each}
</div> -->

<button on:click={() => setScene("second")}>second</button>
<button on:click={() => setScene("third")}>third</button>
<button on:click={() => setScene("fourth")}>fourth</button>
<button on:click={() => setScene("fifth")}>fifth</button>
<button on:click={() => setScene("sixth")}>sixth</button>


<div class="year-wrapper {sceneSetTo}">
    {#each cols as col, i (col.year)}
        <div in:fade={{delay:1000}} class="year year-{col.year}" style="transform:translate({320*i}px,0px);">
            <h1 on:click={() => changePos(i)}>{col.layout}</h1>
            <h1 on:click={() => changeYear(i)}>{col.year}</h1>
            <div class="img-grid">
                {#each filterData(col.year,col.layout,sceneSetTo) as album (album["Album ID"])}
                    {@const visibility = getVisibility(col,album)}
                    <div
                        class="{album["2020 Rank"]} img-wrapper"
                        style="--delay: {album.rank}; opacity:{visibility}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;">
                        {#if [1,2,11].indexOf(+album.rank) > -1}
                        <div class="counter"
                            style=""
                        >
                            {counterText[album.rank]}
                        </div>
                        {/if}
                        <img year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>


<style>

.fourth .year-2003 .img-wrapper:not(.fade) {
    opacity: .2;
}

.voter-grid {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.voter {
    background-size: contain;
    width: 70px;
    height: 70px;
    background-color: black;
    background-repeat: no-repeat;
    background-position: center;
}

.year-wrapper {
    /* display: flex; */
}

.year {
    position: absolute;
    transition: transform 1s;
}

.counter {
    position: absolute;
    left: 0;
    top: 0;
    width:150px;
    font-size: 12px;
    color: black;
    transform: translate(0,-100%);
    font-family: Arial, Helvetica, sans-serif;
}

.img-grid {
    position: relative;
    width: 400px;
    height: 600px;
}

.img-wrapper {
    position: absolute;
    transition: all 1s,
			transform 1s calc(var(--delay) * calc(var(--1s) * 0.01));
}

img {
    
    /* width: 32px;
    height: 32px; */
}
</style>

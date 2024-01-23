<script>
import data from "$data/albums.csv"
import Voters from "$data/voters.csv"

import { getGridPosition } from '$actions/getGridPosition.js';
import { tweened } from 'svelte/motion';
import {fade, scale} from 'svelte/transition';

import { cubicOut } from 'svelte/easing';
import { onMount } from "svelte";
import { setResponse } from "@sveltejs/kit/node";
	import { index } from "d3";

let text = {
    "first":"in 2003 RS released its top 500, with sgt peppers at #1",
    "second":"When the publication updated the list in 2012 to include the first decade of the new millennium, not only did The Beatles’ classic remain at number one but the entire top 10 was unchanged.",
    "third":"This certitude wasn’t to last, though. When Rolling Stone revised the list in 2020, the two decade consensus was no more. Except for Pet Sounds remaining at number two, the entire top 10 was different.",
    "fourth":"And not just a little different. Very different. Let’s look at what changed. Here we see where today’s top 10 ranked in 2003.",
    "fourth2":"In 2003, The Miseducation of Lauryn Hill was only 6 years-old and already ranked at #321 on the all-time list. Twenty years later, judges voted it into the #10 slot.",
    "fifth":"174 albums in the 2003 ranking don’t appear at all in the 2020 ranking. This includes albums such as Creedence Clearwater Revival’s Green River, which appeared canonical at #95 in 2003.",
    "sixth":"Many of the albums that replaced those 174 in the 2020 ranking were recent releases.",
    "sixth2":"Such as Beyonce's Lemonade (#73)",
    "sixth3":"But others had been out for decades. Released in 1985, Kate Bush’s Hounds of Love wasn’t on the list in 2003 or 2012 but was declared the 68th greatest album of all-time in 2020. Joy Division’s Unknown Pleasures, released just a few years before Bush’s masterpiece, saw a similar shift.",
    "sixth4":"And it wasn’t just the last few decades that saw a reevaluation. Billie Holiday’s Lady in Satin was suddenly one of the greatest albums of all-time despite being unranked in 2003, 45 years after its release."

}

let sceneSetTo = "first"
let sceneSetToSub = ""
let toAnnotate = [];


let counterTextFull = {
    1:"#1 Greatest Album",
    2:"The Remaining Top 10",
    11:"#11 - #500"
}

let counterTextCol = {
    1:"#1",
    5:"#5",
    10:"#10"
}

let layoutCounts = {
    "full":[1,2,11],
    "col":[1,5,10]
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
    toAnnotate = [];

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
        sceneSetToSub = "2"
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
}

function getColOffset(col,count){
    if(count == 0){
        return 0
    }
    if(count == 2){
        return 200;
    }
    else {
        if(cols[count-1].layout == "col"){
            return 100*count;
        }
    }
    return 340*count
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

<button on:click={() => setScene("first")}>first</button>
<button on:click={() => setScene("second")}>second</button>
<button on:click={() => setScene("third")}>third</button>
<button on:click={() => setScene("fourth")}>fourth</button>
<button on:click={() => setScene("fourth2")}>fourth-2</button>
<button on:click={() => setScene("fifth")}>fifth</button>
<button on:click={() => setScene("sixth")}>sixth</button>
<button on:click={() => setScene("sixth2")}>sixth-2</button>
<button on:click={() => setScene("sixth3")}>sixth-3</button>
<button on:click={() => setScene("sixth4")}>sixth-4</button>


<p>{sceneSetTo}</p>

<div class="year-wrapper {sceneSetTo}">
    {#each cols as col, i (col.year)}
        <div in:fade={{delay:1000}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i)}px,0px);">
            <p class="year-label">{sceneSetTo == "sixth" ? "2020" : col.year}</p>
            <div class="img-grid">
                {#each filterData(col.year,col.layout,sceneSetTo) as album (album["Album ID"])}
                    {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}
                    <div
                        class="{album["2020 Rank"]} img-wrapper"
                        style="--delay: {album.rank}; opacity:{visibility}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;">
                        {#if layoutCounts[col.layout].indexOf(+album.rank) > -1}
                        <div class="counter"
                            style=""
                        >
                            {col.layout == "full" ? counterTextFull[album.rank] : counterTextCol[album.rank]}
                        </div>
                        {/if}
                        <img year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                    </div>
                {/each}
                {#each filterData(col.year,col.layout,sceneSetTo).filter(d => toAnnotate.indexOf(d["Album ID"]) > -1) as album (album["Album ID"])}
                    <!-- {#if sceneSetTo == "fifth" || sceneSetTo == "sixth"} -->
                        <div
                            in:scale
                            class="{album["2020 Rank"]} img-wrapper img-annotation"
                            style="transform:translate3D(calc({album.pos[0]}px - 15px),calc({album.pos[1]}px - 15px),0);"
                        >
                            <img year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
                        </div>
                    <!-- {/if} -->
                {/each}
            </div>
        </div>
    {/each}
</div>

<p>{text[sceneSetTo.concat(sceneSetToSub)]}</p>


<style>

/* .fourth .year-2003 .img-wrapper:not(.fade) {
    opacity: .2;
} */

.year-label {
    font-size: 24px;
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
    height: 650px;
    max-width: calc(100% - 100px);
    margin: 0 auto;
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
    color: white;
    transform: translate(0,-100%);
    font-family: Arial, Helvetica, sans-serif;
}

.year-col .counter{
    transform: translate(calc(-100% - 10px),0%);
    width: 30px;
    text-align: right;

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
    
    /* width: 32px;
    height: 32px; */
}
</style>

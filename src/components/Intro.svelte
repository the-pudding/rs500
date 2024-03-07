<script>
import { onMount, setContext, getContext } from "svelte";
	
import { getGridPosition } from '$actions/getGridPosition.js';
// import { tweened } from 'svelte/motion';
import {fade, fly, scale} from 'svelte/transition';
import Risograph from '$components/Risograph.svelte'
// import { flip } from 'svelte/animate';
import sticker from "$svg/logo-sticker.svg";

import { cubicOut } from 'svelte/easing';
import { setResponse } from "@sveltejs/kit/node";
import { index } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;
export let scrollY;
export let spriteMap;
export let copy;
export let mobile = false;
export let noMotion = false;
export let data;
export let dataMap;

let stepValue = "fill";
let value;
let highlighted = null;
let highlightTimeout;






$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "fill" ;
$: stepValue, setScene(stepValue);

$: console.log(stepValue)

let textStep = {
    // "fill":"",
    "first":copy.introfirst,
    "second":copy.introsecond,
    "third":copy.introthird,
    "fourth":copy.introfourth,
    "sixth":copy.introfifth,
    // "fifth":[{value:"[6] 174 albums in the 2003 ranking don’t appear at all in the 2020 ranking...CCR highlight"}],
    // "sixth":[{value:"[7] switch to 2020 ranking and the empty slots from what dropped"}],
    "sixth2":copy.introsixtwo,
    "sixth3":copy.introsixthree,
    // "sixth4":[{value:"[10] Billie Holiday"}],
    // "sixth5":[{value:"[11] tk transition..."}]
}

console.log(textStep)

let scenes = Object.keys(textStep);

let sceneSetTo = "first"
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
        layout:"full"
        // layout: "fill"
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
    }
]

let fifthScene = [
    {
        year:2020,
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
        //newdesign
        let cutOff = 501;
        // let cutOff = 200;

        temp = temp
            .filter(d => d[`${year} Rank`] !== "" && +d[`${year} Rank`] < cutOff)

        rowSize = Math.ceil(vw / size);

        // temp = temp.sort((a,b) => {
        //     return +a[`${year} Rank`] - +b[`${year} Rank`];
        // })

        let screenspace = vh*vw;
        let avail = screenspace/((size)*(size));
        // console.log("counts:",avail,sceneSetTo)

        // new design
        // temp = temp.slice(0,avail);
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
                if(noMotion) {
                    d.scroll = 0;
                }
            }
            
            d.year = year;
            d.pos = getGridPosition(layout,d.rank,d,vw,vh,size,padding,rowSize);
        });

    return temp;
}

let Annotations = {
    "first":["6QaVfG1pHYl1z15ZxkvVDW"],
    // "fourth":["1BZoqf8Zje5nGdwZhOjAtD"],
    "sixth2":["20r762YmB5HeofjMCiPMLv","7ycBtnsMtyVbbwTfJwRjSP","7dK54iZuOxXFarGhXwEXfF","3mH6qwIy9crq0I9YQbOuDf"],
    "sixth3":["5G5UwqPsxDKpxJLX4xsyuh","5Dgqy4bBg09Rdw7CQM545s","4LrLP7DM1KBj8r2Sc098JA"]
}
function clickEvent(album){
    
    highlighted = album["Album ID"];
    
    clearTimeout(highlightTimeout)
    highlightTimeout = setTimeout(() =>{
        highlighted = null;
    },3000)

}


function setScene(sceneCount){
    toAnnotate = [];
    highlighted = null;

    if(sceneCount == "fill"){
        cols = fillScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
    }

    if(sceneCount == "first"){
        cols = firstScene;
        sceneSetTo = sceneCount;
        sceneSetToSub = ""
        toAnnotate = Annotations["first"]
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
        // toAnnotate = Annotations["fourth"]
    }
    if(sceneCount == "fourth2"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "2";
        // toAnnotate = Annotations["fourth"]

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
        toAnnotate = Annotations["sixth2"]
    }
    if(sceneCount == "sixth3"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "3"
        toAnnotate = Annotations["sixth3"]
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

function getColOffset(col,count,vw,sceneSetTo){
    let left = 0;
    let top = 0;

    if(count == 0){
        if(cols.length > 1 && cols[count].layout == "full"){
            if(cols[count+1].layout == "col"){
               left = -50;
            }
        }
        left = 0
    }
    else {
        if(cols[count-1].layout == "col"){
            if(vh < 900){
                top = 100*count;
            }
            else if(vw > 600){
                left = 150*count;
            }
            else {
                left = 100*count;
            }
            
        }
        else if(cols[count-1].layout == "full"){
            if(vw > 600){
                left = 600;
            }
            left = 100*count;
        }
    }
    return `${left}px,${top}px`

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
                return .6;
            }
            return 1;
        }
        
    }
    if(sceneSetTo == "fifth" && +col.year == 2003){
        if(+album["2020 Rank"] == ""){
            return .6
        }
        else {
            1;
        }
    }

    if(sceneSetTo == "sixth" && +col.year == 2003){
        if([2,3,4].indexOf(+sceneSetToSub) > -1){
            return .6;
        }
        if(sceneSetToSub == "5"){
            return 1;
        }
        if(+album["2003 Rank"] == ""){
            return 1
        }
        else {
            return 1;
        }
    }
    return 1;
}

onMount(() => {
    cols = fillScene;
    console.log(copy.headings)
    // console.log(spriteMapBig.get("6QaVfG1pHYl1z15ZxkvVDW"))
})

function getFly(){
    if(noMotion){
        return 0;
    }
    if(sceneSetTo == "fifth"){
        return 500;
    }
    return 50;
}
function getDelay(direction){
    if(sceneSetTo == "fifth"){
        if(direction == "in"){
            return 1000;
        }
        return 100;
        
    }
    return 100;
}






</script>

<section class="opener" style="width:{vw}px; height:{mobile ? '' : ''}px;">

    <div class="logo">
        <a href="https://pudding.cool" aria-label="The Pudding" target="_self"
            >{@html sticker}</a
        >
    </div>

    <div style="pointer-events:none;z-index:1000000;height:100%; width:100%; position:absolute; top:0; opacity:.4; left:0; background-image:url(assets/asfalt-dark.png);"></div>
    <div style="pointer-events:none;z-index:1000000;height:100%; width:100%; position:absolute; top:0; opacity:1; left:0; background-image:url(assets/noise-light.png);"></div>

    <div class="opener-text" style="width:calc(100% - 30px);">
        <h1 style="font-weight:600; opacity:.8;color:#000; letter-spacing:-3px;">{@html copy.headings[0].title}</h1>
        <p style="opacity:.8; color:#000; letter-spacing:-1px;">{@html copy.headings[0].byline}</p>
    </div>
    
    <img class="opener-album" style="" src="assets/img3.png" alt="series of cover art from the rolling stone 500 greatest albums of all time">
    <Risograph {vh}/>
</section>

<section class:mobile class:noMotion>
    <div
        class="year-wrapper {sceneSetTo}"
        style="height:{vh}px; overflow:hidden;"
    >
        {#each cols as col, i (col.year)}
            <div in:fly={{delay:getDelay("in"), y:getFly()}} out:fly={{delay:getDelay("out"), y:getFly()}} class="year year-{col.year} year-{col.layout}" style="transform:translate({getColOffset(col,i,vw,sceneSetTo)});"> 
                <div class="img-grid" style="will-change: transform;">
                    {#each filterData(col.year,col.layout,sceneSetTo,sceneSetTo == "fill" ? scrollY : '') as album, i (album["Album ID"])}
                        {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}
                        {@const filePath = album.pos[2] > 100 ? album.pos[2] > 200 ? "full" : "256" : "256"}
                        {@const spriteData = spriteMap.get(`${album["Album ID"]}`)[0]}
                        {@const spriteBase = album.pos[2] > 100 ? 192 : 96}
                        {@const spriteAdjust = spriteBase/album.pos[2]}
                        {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
                        {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}


                        {#if highlighted == album["Album ID"]}
                            <div 
                                transition:fly={{duration:500,y:20}}
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
                            class="{album["2020 Rank"]} album-id-{album["Album ID"]} img-wrapper {album[`${col.year} Rank`]}"
                            style="
                                --delay: {album.rank < 11 ? album.rank : 50};
                                --duration: {album.rank < 11 ? ".5s" : ".5s"};
                                transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0);
                                width:{album.pos[2]}px;
                                height:{album.pos[2]}px;
                            "
                            role="button"
                            tabindex=0
                            on:keydown={() => clickEvent(album)}
                            on:click={() => clickEvent(album)}
                        >
                            {#if layoutCounts[col.layout].indexOf(+album.rank) > -1}
                                <div class="counter {["full","col"].indexOf(col.layout) > -1 && +album.rank < 11 ? 'counter-big' : ''}"
                                    style=""
                                >
                                    {col.layout == "full" ? counterTextFull[album.rank] : counterTextCol[album.rank]}
                                </div>
                            {/if}

                            {#if ["col","full"].indexOf(col.layout) > -1 && album[`${col.year} Rank`] == 1}
                                <p class="year-label"
                                    style="width:{600}px; display:{sceneSetTo == "sixth" && +col.year == 2003 ? 'none' : ''};"
                                >
                                    {@html sceneSetTo == "first" ? mobile ? "Rolling Stone&rsquo;s <span class='year2003title'>2003</span> Album Ranking" : "Rolling Stone&rsquo;s <span class='year2003title'>2003 Ranking</span> of Greatest Albums" : `<span class='year${col.year}title'>${col.year}</span>${col.layout !== "col" ? ' Ranking' : ''}`}
                                </p>
                            {/if}
                            {#if sceneSetTo == "sixth" && album["2020 Rank"] == 1}
                                <p in:fly={{delay:1000, duration:500, y: 50}} class="year-label"><span class='year2020title'>2020</span> Ranking</p>
                            {/if}

                            {#if album.pos[2] > 250}
                                <img loading="lazy" style="
                                        opacity:{mobile ? '1' : visibility};
                                        filter:{visibility < 1 && !mobile ? 'grayscale(.8)' : ''};
                                    "
                                    year={album.year} width="100%" height="100%" src="assets/album_art_resized/full/{album['Album ID']}.jpg"
                                    alt="Ranked #{album.rank} in {col.year}, Cover art for {album["Clean Name"]}'s {album["Album"]}"
                                />
                            {:else}
                                <div class="img-sprite" style="
                                    background-image:url(assets/spritesheet_{album.pos[2] > 100 ? "192" : "96"}.jpg);
                                    background-size:{size};
                                    opacity:{mobile ? visibility : visibility};
                                    filter:{visibility < 1 && !mobile ? 'grayscale(.8)' : ''};
                                    background-position:{pos};
                                "
                                    role="img"
                                    aria-label="Ranked #{album.rank} in {col.year}, Cover art for {album["Clean Name"]}'s {album["Album"]}"
                                >
                                </div>
                            {/if}
                        </div>
                    {/each}
                    {#if sceneSetTo !== "first"}
                        {#each filterData(col.year,col.layout,sceneSetTo).filter(d => toAnnotate.indexOf(d["Album ID"]) > -1) as album (album["Album ID"])}
                            {@const spriteData = spriteMap.get(`${album["Album ID"]}`)[0]}
                            {@const spriteBase = 96}
                            {@const imageSize = mobile ? 35 : 50}
                            {@const move = mobile ? 7 : 15}
                            {@const spriteAdjust = spriteBase/imageSize}
                            {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
                            {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}

                            <div
                                in:fly={{y:50}}
                                class="{album["2020 Rank"]} img-wrapper img-annotation"
                                style="
                                    transform:translate3D(calc({album.pos[0]}px - {move}px),calc({album.pos[1]}px - {move}px),0);
                                    display:{["fourth"].indexOf(sceneSetTo) > -1 && +col.year == 2020 ? 'none' : ''};

                                    background-image:url(assets/spritesheet_96.jpg);
                                    background-size:{size};
                                    width:{imageSize}px;
                                    height:{imageSize}px;
                                    background-position:{pos};
                                "
                            >
                                <!-- <img loading="lazy" year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg"
                                    alt="Cover art for {album["Clean Name"]}'s {album["Album"]}"
                                /> -->
                            </div>
                        {/each}
                    {/if}
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


                <div class="step step-{i} scenes-{scenes.length-1} {i == 0 ? "title-step" : ''}"
                     class:active
                     style="
                        margin-top: {i == 0 ? -vh/2 : ''}px;
                        padding-top: {i == 0 ? '0' : vh*.2}px;
                        min-height: {vh*.75}px;
                        margin-bottom: {i == 0 ? vh/2 : ''}px;
                        padding-left: {i == 0 ? '' : ''}px;
                        padding-bottom: {mobile ? i == scenes.length - 1 ? vh : vh/2 : ''}px;
                    "

                >
                    <!-- {#if i == 10000000}
                        <div class="title"
                            style="
                                --vw: {vw}px;
                            "
                        >
                            <h1>{@html copy.headings[0].title}</h1>
                            <p>{@html copy.headings[0].byline}</p>
                        </div>
                    {:else} -->
                        {#each textStep[scene] as text, i}
                            {@const count = scene == "sixth3" ? i : i -1}

                            <div class="text-wrapper">
                                <p class="text-fg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                                <p class="text-bg" style="margin-bottom:20px;"><span>{@html text.value}</span></p>
                            </div>
                            {#if (scene == "sixth2" && i > 0) || scene == "sixth3"}
                                <div
                                    in:scale
                                    class="text-annotation"
                                    style="
                                    "
                                >
                                    <img loading="lazy" width="100%" height="100%" src="assets/album_art_resized/256/{Annotations[scene][count]}.jpg" alt="{dataMap.get(Annotations[scene][count])[0]["Album"]}" />
                                </div>
                            {/if}
                        {/each}
                        {#if scene == "first"}    
                                {#each Annotations[scene] as album}
                                    <div
                                        in:scale
                                        class="text-annotation"
                                        style="
                                        "
                                    >        
                                        <img loading="lazy" year={album.year} width="100%" height="100%" src="assets/album_art_resized/256/{album}.jpg" alt="{dataMap.get(album)[0]["Album"]}" />
                                    </div>
                                {/each}

                            {/if}
                    <!-- {/if} -->
                    
                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<style>


.title {
    background-color: var(--color-bg);
    padding: 30px;
    margin-top:270px;
    margin-left:180px;
    width:540px;
    min-height:360px;
    pointer-events: all;

}

.step {
    opacity: .2;
    transition: opacity .5s;
}

.active.step {
    opacity: 1;
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


.title-step {
    opacity: 0;
    transition: opacity .5s;
}

.mobile .title-step {
    opacity: 1;
    transition: none;
}

.title-step.active {
    opacity: 1;
}


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
}


/* new design */
/* .fill .img-wrapper { */
    /* opacity: .7; */
/* } */

.mobile .fill .img-wrapper {
    opacity: 1;
}

.img-wrapper {
    position: absolute;
}

.noMotion .year {
    transition: none;
}

.year-col .img-wrapper {
    transition: transform var(--duration) calc(var(--delay) * calc(1s * 0.005)), width .5s, height .5s;
    transition-timing-function: ease-in-out;
}

.mobile .year-col, .mobile .img-wrapper {
    transition: transform 1s;
}

.noMotion .year-col .img-wrapper {
    transition: none;
}

.year-col .year-label {
    transform: translate(0,calc(-100% - 5px));
}



.year-full .img-wrapper {
    transition: transform var(--duration) calc(var(--delay) * calc(1s * 0.005));
    transition-timing-function: ease-in-out;
}

.mobile .year-full, .mobile .img-wrapper {
    transition: transform 1s;
}


.noMotion .year-full .img-wrapper {
    transition: none;
}

.img-annotation {
    width: 50px;
    height: 50px;
    border: 2px solid white;
    box-shadow: 0px 0px 42px black;
}

/* .fifth .img-annotation img {
    filter: brightness(0.5);
} */

.buttons {
    position: absolute;
    z-index: 100000;
}

.steps {
    /* pointer-events: none; */
}

p a {
    color: inherit;
}

.mobile .first .year-full .year-label {
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
        color: #ddd;
    }

    .year-full .year-label {
        transform: translate(0,calc(-100% - 5px));
    }

    .title {
        pointer-events: all;
    }
}

.opener-album {
    margin: 0 auto;
    /* height: auto; */
    opacity:.7;
    pointer-events:none;
    /* width: 100%; */
    max-width: 1280px;
    padding-top: 110px;
    object-fit: none;
    object-position: top center;
    height: 1600px;
    width: 100%;

    /* filter: invert(28%) sepia(100%) hue-rotate(152deg) saturate(2.1); */
}

.opener-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    max-width:518px; margin: 0 auto; padding-top:200px;
}
.opener {
    background:#E2E1CB;
    position:relative;
    display:block;
    font-family:Arial, Helvetica;
    text-transform:uppercase;
    font-weight:bold;
    overflow: hidden;
    width: 100vw;
}

.logo a {
    border: none;
    text-decoration: none;
}

.logo {
    position: absolute;
    z-index: 1000000000000;
    top: 0;
    left: 0;
    transform: rotate(-7deg);
    width: 300px;
}


@media (max-width: 900px) {
    /* .title-step {
        width: 100%;
        max-width: none;
    } */
    .title {
        width: calc(var(--vw) - 100);
        margin-left: 90px;
        margin-top: 180px;
    }
}

@media (max-width: 600px) {
    .opener-text h1 {
        font-size: 40px;
    }

    .opener-text {
        padding-top: 180px;
    }
    .logo {
        width: 250px;
    }
}







</style>

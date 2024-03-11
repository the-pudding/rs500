<script>
import Voters from "$data/voters.csv"
import data from "$data/albums.csv"


import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, fly} from 'svelte/transition';
import { group, groupSort,groups } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";
	import { Rows } from "lucide-svelte";
	import translate from "../utils/translate";

export let vw;
export let vh;
export let copy;
export let spriteMapVoters;
export let spriteMapAlbums;
export let mobile = false;
export let noMotion = false;

let voterCountGender = {
    2020:336,
    2003:269
}


let highlighted = null;

let stepValue = "second";
let value;
let sceneSetTo = "second"
let sceneSetToSub = ""

let padding = 0;
let size = 25;
let rowSize = 10;
let transformAmount = 0;
let vertStack = false;

let textStep = {
    "second":copy.voterfive,
    "third":copy.votersix,
    "fourth":copy.voterseven,
    // "fourth2":"[25 continued] age for both sets",
    // "fourth3":"[26] teenage years",
    "fifth":copy.votereight,
    "fifth2":copy.voternine,
    "fifth3":copy.voterten,
    "sixth":copy.votereleven,
    "sixth2":copy.votertwelve,
    "sixth3":copy.voterthirteen,
    "sixth4":copy.voterfourteen,
    "sixth5":copy.voterfifteen,
    "sixth6":copy.votersixteen,
    "sixth6":copy.votersixteen
}

let scenes = Object.keys(textStep)//.filter(d => d !== "first");
$: stepValue = getStepValue(value);
$: stepValue, setScene(stepValue);
$: vertStack = vw < 1100 ? true : false;


function getStepValue(value){

    // value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "second" ;

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



$: console.log(sceneSetTo,sceneSetToSub,value,mobile);

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

let counterTextGroup = {
    0:"Charted at #1",
    1:"Charted #2-40",
    2:"Charted #41-200",
    3:"Never charted"
}

let counterTextGender = {
    0:"She/her, They/them",
    2:"Groups",//"They/Non-binary",
    1:"He/Him",
    //3:"Groups"
}

let firstScene = [
    {
        year:2003,
        layout:"large",
        dataset:"voters"
    }
];

let firstTwoScene = [
    {
        year:2020,
        layout:"fill-voters",
        dataset:"voters"
    }
];

let secondScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"
    }
]
let thirdScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"vert"
    }
]
let fourthScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
]
let fifthScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
]

let fifthTwoScene = [
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
    ,
    {
        year:2003,
        layout:"grouped-voter-gender",
        dataset:"albums",
        direction:"horz"
    }
]

let fifthThreeScene = [
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"voters",
        direction:"horz"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"albums",
        direction:"horz"
    }
]

let sixthScene = [
    {
        year:2020,
        layout:"grouped-voter-gender",
        dataset:"albums",
        direction:"horz"
    }
]

let cols = firstScene;

function setScene(sceneCount){
    sceneSetTo = sceneCount;
    sceneSetToSub = ""
    highlighted = null;

    if(sceneCount == "first"){
        cols = firstScene;
        sceneSetTo = "first"
    }
    if(sceneCount == "firstTwo"){
        cols = firstTwoScene;
        sceneSetTo = "firstTwo";
    }
    if(sceneCount == "second"){
        cols = secondScene;  
        sceneSetTo = "second"
    }
    if(sceneCount == "third"){
        cols = thirdScene;
        sceneSetTo = "third"
    }
    if(sceneCount == "fourth"){
        cols = fourthScene;
        sceneSetTo = "fourth"
    }
    if(sceneCount == "fourth2"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "2"
    }
    if(sceneCount == "fourth3"){
        cols = fourthScene;
        sceneSetTo = "fourth";
        sceneSetToSub = "3"
    }
    if(sceneCount == "fifth"){
        cols = fifthScene;
    }
    if(sceneCount == "fifth2"){
        cols = fifthTwoScene;
        sceneSetTo = "fifth";
        sceneSetToSub = "2"
    }
    if(sceneCount == "fifth3"){
        cols = fifthThreeScene;
        sceneSetTo = "fifth";
        sceneSetToSub = "3"
    }
    if(sceneCount == "sixth"){
        cols = sixthScene;
        sceneSetToSub = ""
    }
    if(sceneCount == "sixth2"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "2"
    }
    if(sceneCount == "sixth3"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "3"
    }
    if(sceneCount == "sixth4"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "4"
    }
    if(sceneCount == "sixth5"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "5"
    }
    if(sceneCount == "sixth6"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "6"
    }
    if(sceneCount == "sixth7"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "7"
    }
    if(sceneCount == "sixth8"){
        cols = sixthScene;
        sceneSetTo = "sixth";
        sceneSetToSub = "8"
    }

}

function filterData(year,layout,sceneSetTo,sceneSetToSub,dataset,col){

    let temp;
    let test = [];

    let direction = col.direction;

    if(layout == "large") {
        size = 60;
    }

    // transformAmount = Math.ceil(
    //         JSON.parse(JSON.stringify(Voters)).filter(d => d.Year == "2003").filter(d => d.Race !== "n/a").length/10
    //     ) * size;

    if(dataset !== "voters"){
        temp = JSON.parse(JSON.stringify(data));
        temp = temp
            .filter(d => d[`${year} Rank`] != "");
    }
    else {
        temp = JSON.parse(JSON.stringify(Voters));
        temp = temp
            .filter(d => d.Year == year);

        temp = temp.sort((a,b) => {
            return b["Gender"].localeCompare(a["Gender"])
        })
    }

    if(layout == "fill-voters"){
        temp = temp
            .filter(d => d.Race.slice(0,4) == "http");
    }

    if(sceneSetTo == "first" || sceneSetTo == "firstTwo") {

        temp = temp
            .filter(d => d.Race !== "n/a");
    }

    if(sceneSetTo == "second" || sceneSetTo == "third" || sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){
        let tempGroup = [];
        
        let bigCardsNeeded = 100;
        let colCount = 7;
        
        if(sceneSetTo == "fourth"){
            colCount = 5;
            bigCardsNeeded = 97;
        }
        if(sceneSetTo == "fifth"){
            colCount = 7;
            if(sceneSetToSub == ""){
                bigCardsNeeded = 97;
            }
            else if(sceneSetToSub == "3"){
                bigCardsNeeded = 160;
            }
            else {
                bigCardsNeeded = 200;
            }
        }

        if(sceneSetTo == "second" || sceneSetTo == "third"){
            let availableWidth = Math.min(580,(vw-20));
            bigCardsNeeded = temp.length;
            let availableHeight = vh-200;

            if(sceneSetTo == "third"){
                availableWidth = Math.min(580/2,(vw-20)/2);
                bigCardsNeeded = 336;
                availableHeight = vh-250;
            }
            
            let maxSquare = 75;
            let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
            squareSize = Math.min(maxSquare,squareSize);
            const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
            squareSize = squareDimension;
            size = squareSize;
            rowSize = Math.floor(availableWidth/size);
        }

        if(sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){

            if(sceneSetTo == "sixth"){
                bigCardsNeeded = 200;
            }

            let availableWidth = ((vw - 100) - (25*(colCount - 1)))/colCount;
            let availableHeight = vh/2-50;

            if(vertStack && ["fourth","fifth","sixth"].indexOf(sceneSetTo) > -1){
                availableHeight = ((vh - 50) - (25*(colCount - 1)))/colCount
                availableWidth = vw/2 - 100;
            }

            if(sceneSetTo == "sixth" && sceneSetToSub !== "" && !vertStack){
                availableWidth = (vw-100)/2;
                availableHeight = vh - 50;
            }

            if(sceneSetTo == "sixth" && sceneSetToSub !== "" && vertStack){
                availableWidth = vw-100;
                availableHeight = vh - 50;
            }
            

            let maxSquare = 300;
        
            let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
            squareSize = Math.min(maxSquare,squareSize);
        
            const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
        
            squareSize = squareDimension;

            size = squareSize;
            rowSize = Math.floor(availableWidth/size);
            if(vertStack && ["fourth","fifth","sixth"].indexOf(sceneSetTo) > -1){
                rowSize = Math.floor(availableHeight/size);
            }

            if(dataset == "voters"){
                temp = temp.sort((a,b) => {
                    return a["Birthyear"].localeCompare(b["Birthyear"])
                })

                temp = temp
                    .filter(d => d.Birthyear.length == 4);
            }
            else {
                temp = temp.sort((a,b) => {
                    return a["Release Year"].localeCompare(b["Release Year"])
                })
            }
        }

        let grouped = groups(temp, d => {


            if(sceneSetTo == "fifth" || sceneSetTo == "sixth"){
                if(dataset == "voters"){
                    // console.log(d)
                    // let rank = d["Birthyear"].slice(0,3);
                    // console.log(rank)
                    // if(+rank < 196){
                    //     return "pre 1970s"
                    // }
                    // return rank;

                    let rank = d["Teenage Decade"];
                    if(rank == "1940s" || rank == "1930s" || rank == "1950s"){
                        rank = "1950s and earlier"
                    }
                    return rank;
                }
                else {
                    let rank;
                    rank = +d["Release Year"];//.slice(2,4);
                    rank = Math.floor(rank / 10) * 10;

                    if(+rank < 196){
                        rank = 195;
                    }
                    return rank;
                }
            }

            if(sceneSetTo == "fourth"){
                let rank = Math.round(d["Age at Vote"]/10)*10;
                if(rank > 59){
                    return 0;
                }
                return 60-rank;
            }
            
            let gender = d["Gender"];
            if(gender == "man"){
                return 1;
            }
            else if (gender == "woman"){
                return 0;
            }
            else if(gender == "mixed gender group"){
                return 2;
            }
            return 0//2;
        });
 
        grouped = grouped.sort((a,b) => {
            return a[0] - b[0];
        })

        
        let groupLengths = [];
        let groupAmounts = [];

        grouped.forEach((d,e) => {
            groupLengths.push(d[1].length)
            groupAmounts.push(e);
        })

        grouped.forEach((d,e) => {

            if(sceneSetTo == "sixth"){
                d[1] = d[1].sort((a,b) => {
                    return +a["2003 Rank"] - +b["2003 Rank"]
                })
            }

            let groupLength = d[1].length;
            
            d[1].forEach((j,i) => {
                j["count"] = i;
                j["adjust"] = Math.ceil(groupLength/rowSize)*size;
                j["rowSize"] = rowSize;
                j["scene"] = sceneSetTo;
                j["sceneSub"] = sceneSetToSub;

                j["size"] = size;
                j["groupCount"] = groupAmounts.indexOf(e)
                j["groupCounts"] = groupLengths
                j["groupLength"] = groupLength;
                j["groupOffset"] = 0;
                tempGroup.push(j)
            })
        });

        tempGroup = tempGroup.sort((a,b) => {
            return +b["ID"] - +a["ID"];
        })

        temp = tempGroup 
    }

    temp
        .forEach((d,i) => {
            if(layout == "large"){
                padding = 2;
            }

            d.pos = getGridPosition(layout,i,d,vw,vh,size,padding,rowSize,direction);

            if(sceneSetTo == "fourth" && col.year == "2020"){
                if(vertStack){
                    d.pos[0] = d.pos[0] * -1 - d.pos[2];
                }
                else {
                    d.pos[1] = d.pos[1] * -1 - d.pos[2];
                }
                
            }

            if(sceneSetTo == "fifth" && sceneSetToSub == "" && col.year == "2020"){
                if(vertStack){
                    d.pos[0] = d.pos[0] * -1 - d.pos[2];
                }
                else {
                    d.pos[1] = d.pos[1] * -1 - d.pos[2];
                }
                
            }

            if(sceneSetTo == "fifth" && col.dataset == "albums"){
                if(vertStack){
                    d.pos[0] = d.pos[0] * -1 - d.pos[2];
                }
                else {
                    d.pos[1] = d.pos[1] * -1 - d.pos[2];
                }
                
            }

            if(["sixth"].indexOf(sceneSetTo) > -1 && col.dataset == "albums"){
                if(vertStack){
                    d.pos[0] = d.pos[0] * -1 - d.pos[2];
                }
                else {
                    d.pos[1] = d.pos[1] * -1;
                }
            }
        });

    return temp;
}

function getColOffset(col,count,vw,sceneSetTo){
    let left = 0;
    let top = 0;

    if(sceneSetTo == "fourth" || sceneSetTo == "fifth" || sceneSetTo == "sixth"){
        top = vh/2;

        if(sceneSetTo == "sixth" && sceneSetToSub !== ""){
            if(vertStack){
                top = 0//(vh - 600)/2;
                left = (vw - 50);
            } else {
                top = vh - 100;
                left = (vw - 600)/2;
            }
            
        }

        if(sceneSetTo == "fourth" || sceneSetTo == "fifth"){
            if(count == 0){
                top = top + 30;
            }
            left = 100;
            if(vertStack){
                top = 30;
                left = vw/2

                if(col.year == 2003 && col.dataset == "voters" && +sceneSetToSub < 2){
                    left = left + 25;
                }
                else if(col.dataset == "voters" && +sceneSetToSub < 2) {
                    left = left - 25;
                }
                else if(col.dataset == "albums"){
                    left = left - 25;
                }
                else {
                    left = left + 25;
                }
            }
        }

        if(sceneSetTo == "sixth"){
            if(vertStack && sceneSetToSub == ""){
                top = 30;
                left = vw/2
                // left = left;
            }
            else if(+sceneSetToSub > 0 && vertStack){
                left = vw - 70;
                // left = 100;
            }
            else if(!vertStack) {
                left = 100;
            }
        }
    }

    else if(sceneSetTo == "first"){
        top = -transformAmount + vh*.8;
        // top = 0;
    }

    else if(cols[count].layout == "grouped-voter-gender" && +cols[count].year == 2020){
        if(vw > 600){
            if(cols[count].direction == "vert"){
                let rowSize = 10;
                let size = (580/2)/rowSize;
                left = rowSize*size + 20;
            }
        }
        else {
            left = vw/2-5;
        }
    }

    else {
        if(cols[count].layout == "grid" && cols[count].year == "2020"){
            if(vw > 600){
                left = 15*(580/2)/15 + 20;
            }
            else {
                left = 100*count;
            }
        }
    }
    
    return [left,top]
}


function getVisibility(col,album,sceneSetTo,sceneSetToSub){
    if(sceneSetTo == "sixth"){
        if(+album["2003 Rank"] > 0){
            return 1;
        }
        return .3;
    }
    return 1;
    return null;
}

function getDelay(scene){
    if(scene == "firstTwo" || scene == "first" || scene == "second"){
        return 1000;
    }
    return 0;
}

function getDelayOut(scene){
    if(scene == "firstTwo"){
        return 0;
    }
}

function getDurationOut(scene){
    if(scene == "firstTwo"){
        return 1000;
    }
    return 0;
}

function getSpriteData(voter,type){

    if(type == "album"){
        return spriteMapAlbums.get(voter["Album ID"])[0];
    }

    if(spriteMapVoters.has(voter["ID"])){
        return spriteMapVoters.get(voter["ID"])[0];
    }
    return {x:0,y:0,width:0,height:0};
}


function clickEvent(voter,type){
    console.log("clcking")
    if(type=="album"){
        highlighted = voter["Album ID"]
    }
    else {
        highlighted = voter.ID;
    }
    
}

// 
</script>

<div class:mobile class="center-col" style="margin:0;">
    {#each copy.voterone as text, i}
        <p class="center">
            {@html text.value}
        </p>
    {/each}
</div>

<section class:mobile class="" style="">
    <div class="voter-grid year-wrapper" style="height:{vh}px;">

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#each filterData(2003,"fill-voters",null,"","voters",{year:2003,layout:"large",dataset:"voters"}) as voter, j (+voter["ID"])}

            {@const filePath = "100"}
            {@const spriteData = getSpriteData(voter,"voter")}
            {@const spriteBase = 100}
            {@const spriteAdjust = spriteBase/voter.pos[2]}
            {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
            {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}

            {#if highlighted == voter.ID}
                <div 
                    class="highlighted-click"
                    style="
                        transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0);
                        height:{voter.pos[2]}px;
                        left:{voter.pos[2]/2}px;
                    "
                >
                    <span
                        style=" 
                        "
                    >{voter.Voter}</span>
                </div>
            {/if}

            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="img-wrapper {voter.ID}"
                on:click={() => clickEvent(voter,"voter")}
                style="--delay: {j}; transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0); width:{voter.pos[2]}px; height:{voter.pos[2]}px;"
            >
                <div class="img-sprite" style="
                    background-image:url(assets/spritesheet_voters_100.jpg);
                    background-size:{size};
                    background-color:{spriteData.x == 0 ? "black" : ''};
                    background-position:{pos};
                    "
                    role="img"
                    aria-label="image of {voter["Voter"]}"
                >
                </div>
            </div>
        {/each}
    </div>
    <div class="steps">
        <Scrolly>
            {#each [copy.votertwo,copy.voterthree] as scene, i}
                <div class="voter-intro step"
                style="
                    opacity:1;
                    margin-top: {i == 0 ? -vh/2 : ''}px;
                    padding-top: {i == 0 ? 0 : vh/4}px;
                    padding-bottom: {i == 0 ? 0 : vh/2}px;
                    min-height: {i == 0 ? vh/2 : vh/2}px;
                "
                >
                    {#each scene as text, i}
                        <div class="text-wrapper" style="">
                            <p class="text-fg {text.value.match(/class=big/) ? "span-big" : ''}" style="height:100%;"><span class="text-inner">{@html text.value}</span></p>
                            <p class="text-bg {text.value.match(/class=big/) ? "span-big" : ''}" aria-hidden="true" style="height:100%;"><span class="text-inner">{@html text.value}</span></p>
                        </div>
                    {/each}
                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<div class:mobile class="center-col" style="margin:0;">
    {#each copy.voterfour as text, i}
        <p class="center {text.value.match(/class=big/) ? "span-big" : ''}">
            <span>{@html text.value}</span>
        </p>
    {/each}
</div>

<section class:mobile class="" style="">
    <div class="voter-grid year-wrapper" style="height:{vh}px;">

        {#each filterData(2020,"fill-voters",null,"","voters",{year:2003,layout:"large",dataset:"voters"}) as voter, j (+voter["ID"])}

            {@const filePath = "100"}
            {@const spriteData = getSpriteData(voter,"voter")}
            {@const spriteBase = 100}
            {@const spriteAdjust = spriteBase/voter.pos[2]}
            {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
            {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}


            {#if highlighted == voter.ID}
                <div 
                    class="highlighted-click"
                    style="
                        transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0);
                        height:{voter.pos[2]}px;
                        left:{voter.pos[2]/2}px;
                    "
                >
                    <span
                        style=" 
                        "
                    >{voter.Voter}</span>
                </div>
            {/if}

            <div
                class="img-wrapper {voter.ID}"
                on:click={() => clickEvent(voter,"voter")}
                style="--delay: {j}; transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0); width:{voter.pos[2]}px; height:{voter.pos[2]}px;"
            >
                <div class="img-sprite" style="
                    background-image:url(assets/spritesheet_voters_100.jpg);
                    background-size:{size};
                    background-color:{spriteData.x == 0 ? "black" : ''};
                    background-position:{pos};
                    "
                    role="img"
                    aria-label="image of {voter["Voter"]}"
                >
                </div>
            </div>
        {/each}
    </div>
</section>

<div class:mobile class="center-col" style="margin-bottom:0;">
    {#each copy.voterfourtwo as text, i}
        <p class="center">
            {@html text.value}
        </p>
    {/each}
</div>

<section class:mobile class:vertStack class:noMotion>
    <div 
        class="voter-grid year-wrapper {sceneSetTo} {sceneSetTo}-{sceneSetToSub}"
        style="
            height:{vh}px;
            overflow:hidden;
        "
    >            
        {#each cols as col, i (JSON.stringify(col.year).concat(col.dataset))}
            {@const offset = getColOffset(col,i,vw,sceneSetTo)}
            {@const count = i}
            {@const gridDesktopTop = i == 0 ? -3 : 0}
            {@const gridDesktopLeft = -offset[0]}
            {@const gridMobileLeft = i == 0 ? 0 : 0}
            {@const flyTime = noMotion ? 0 : 1000}

            <div
                class="direction-{sceneSetTo == "third" ? col.direction : 'none'} mobile-{mobile ? 'on' : 'off'} year year-{col.dataset} year-{col.year} year-{col.layout} scene-{sceneSetTo} scene-sub-{sceneSetToSub}"
                style="
                    transform:translate({offset[0]}px,{offset[1]}px);
                "
                transition:fly={{y:50, duration:flyTime}}
            >
                {#if ["fourth","fifth","sixth"].indexOf(sceneSetTo) > -1}
                    <div class="grid grid-{i}"
                        style="
                            --vh:{vh}px;
                            transform:translate(
                                {vertStack && ["fourth","fifth","sixth"].indexOf(sceneSetTo) > -1 ? gridMobileLeft : gridDesktopLeft}px,
                                {vertStack && ["fourth","fifth","sixth"].indexOf(sceneSetTo) > -1 ? '0' : gridDesktopTop}px
                            );
                        "
                    >
                        <p
                        class="year-label"
                        style="
                            "
                        >
                            <span class="{col.dataset == 'albums' ? 'year' : 'voters'}{col.year}title">{col.year} {col.dataset}</span>
                        </p>
                    </div>
                {/if}



                {#if col.dataset == "voters"}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset,col) as voter, j (+voter["ID"])}

                        {@const filePath = "100"}
                        {@const spriteData = getSpriteData(voter,"voter")}
                        {@const spriteBase = 100}
                        {@const spriteAdjust = spriteBase/voter.pos[2]}
                        {@const pos = `-${Math.round(+spriteData.x / spriteAdjust)}px -${Math.round(+spriteData.y / spriteAdjust)}px`}
                        {@const size = `${Math.round(+spriteData.width / spriteAdjust)}px ${Math.round(+spriteData.height / spriteAdjust)}px`}

                        {#if highlighted == voter.ID}
                            <div 
                                class="highlighted-click"
                                style="
                                    transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0);
                                    height:{voter.pos[2]}px;
                                    left:{voter.pos[2]/2}px;
                                "
                            >
                                <span
                                    style=" 
                                    "
                                >{voter.Voter}</span>
                            </div>
                        {/if}


                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="img-wrapper {voter.ID}"
                            on:click={() => clickEvent(voter,"voter")}
                            style="--delay: {j}; transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0); width:{voter.pos[2]}px; height:{voter.pos[2]}px;"
                        >

                            {#if sceneSetTo == "fourth" || sceneSetTo == "fifth"}
                                {#if +voter.count == 0}
                                    {#key sceneSetToSub}
                                        <div class="count-{count} counter counter-big teen-{voter["Teenage Decade"]}"
                                            transition:fly={{duration:flyTime, y:50}}
                                            style="
                                                display:{count == 0 ? 'none' : ''};
                                                width:{vertStack ? '' : Math.min(10,+voter["groupLength"])*voter["size"]}px;
                                                transform:{vertStack ? `translate(${voter.pos[2]}px,0px)` : ''};
                                            "
                                        >
                                            {#if voter["groupCount"] == 0}
                                                {#if sceneSetToSub == "3"}
                                                    Teen pre-1960s
                                                {:else if sceneSetTo == "fifth"}
                                                    {@html vertStack ? '&rsquo;40s to &rsquo;60s Teen' : 'Teen pre-1960s'}
                                                {:else}
                                                    Ages 60+
                                                {/if}
                                            {:else}
                                                {#if sceneSetToSub == "3"}
                                                    Teen in {voter["Teenage Decade"]}
                                                {:else if sceneSetTo == "fifth"}
                                                    <!-- Born in {voter["Birthyear"].slice(0,3)}0s -->
                                                    {@html vertStack ? `&rsquo;${voter["Teenage Decade"].slice(2,4)}s Teen` : `Teen in ${voter["Teenage Decade"]}`}
                                                    
                                                {:else}
                                                    Age {Math.round(voter["Age at Vote"]/10)*10}s
                                                    <!-- Born in {voter["Birthyear"].slice(0,3)}0s -->
                                                {/if}
                                            {/if}
                                        </div>
                                    {/key}
                                {/if}
                            {/if}

                            {#if ["second","third"].indexOf(sceneSetTo) > -1}
                                {#if voter["count"] == 0 && voter["groupCount"] == 0}
                                    <p class="year-label " style="width:200px;"><span class="voters{col.year}title">{col.year}</span> Voters</p>
                                {/if}
                            {/if}

                            {#if ["second","third"].indexOf(sceneSetTo) > -1 && +voter.count == 0}
                                <div class="counter counter-big"
                                    style="width:{(580/2)}px; letter-spacing: -1px;"
                                >
                                    {counterTextGender[+voter.groupCount]}, {Math.round(+voter.groupLength/voterCountGender[col.year]*1000/10)}%
                                </div>
                            {/if}

                            <div class="img-sprite" style="
                                background-image:url(assets/spritesheet_voters_100.jpg);
                                background-size:{size};
                                background-color:{spriteData.x == 0 ? "#666666" : ''};
                                background-position:{pos};
                                "
                                role="img"
                                aria-label="image of {voter["Voter"]}"
                            >
                            </div>
                                
                            <!-- <img loading="lazy" class="voter-image" style="" width="100%" height="100%" src="assets/rolling_images_resized/256/{voter["ID"]}.jpg" alt="" /> -->
                            
                            
                        </div>
                    {/each}
                {:else}
                    {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset,col) as album, j (album["Album ID"])}
                        {@const visibility = getVisibility(col,album,sceneSetTo,sceneSetToSub)}
                        {@const filePath = "100"}
                        {@const spriteData = getSpriteData(album,"album")}
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
                            class="img-wrapper" data-count={album.count} data-group={album.groupCount}
                            on:click={() => clickEvent(album,"album")}
                            role="button"
                            tabindex=0
                            on:keydown={() => clickEvent(album)}    
                            style="--delay: {0}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                        >

                            {#if sceneSetTo == "fifth" || sceneSetTo == "sixth"}
                                {#if +album.count == 0}            

                                        {#if Math.floor(+album["Release Year"] / 10) * 10 == 1990}
                                            <div class="shading"
                                                style="width:{vertStack ? (Math.ceil(album.groupLength/album.rowSize))*album.pos[2]*2 : album.rowSize*album.pos[2] + 10}px; height:{vertStack ? album.rowSize*album.pos[2] + 10 : (Math.ceil(album.groupLength/album.rowSize))*album.pos[2]*2}px"
                                            >
                                            </div>
                                        {/if}

                                        <div class="counter counter-big scene-{sceneSetToSub}" 
                                            transition:fly={{duration:flyTime, y:50}}
                                            data-scene={sceneSetToSub}
                                            style="
                                                width:{vertStack ? '' : Math.min(10,+album["groupLength"])*album["size"]}px;
                                                transform:{vertStack ? `translate(${album.pos[2]}px,0px)` : ''};
                                            "
                                        >
                                            {#if +album.groupCount !== 0}
                                                {@html vertStack ? `&rsquo;${JSON.stringify(Math.floor(+album["Release Year"]/10)).slice(2,4)}` : Math.floor(+album["Release Year"]/10)}0s
                                            {:else}
                                                {#if sceneSetTo == "sixth"}
                                                    {@html vertStack ? '&rsquo;50s' : '1950s'}
                                                {:else}
                                                    pre-1960s
                                                {/if}
                                            {/if}
                                        </div>
                                {/if}
                            {/if}

                            <!-- {#if sceneSetTo == "fifth" || sceneSetTo == "sixth"}
                                {#if album["count"] == 0 && album["groupCount"] == 0}
                                    <p
                                        class="year-label"
                                        style="width:200px; transform:translate(0,calc(-100% - 25px));"
                                    >
                                        {col.year} Album Rankings
                                    </p>
                                {/if}
                            {/if} -->

                            <div 
                                class="
                                img-sprite album-image {album["Album Genre"]}"
                                style="
                                background-image:url(assets/spritesheet_96.jpg);
                                background-size:{size};
                                opacity:{visibility};
                                background-position:{pos};
                                "
                                role="img"
                                aria-label="Cover art for {album["Clean Name"]}'s {album["Album"]}"
                            >
                        </div>


                        <!-- <img loading="lazy" style="opacity:{visibility};" class="album-image" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" /> -->
                        
                        
                    </div>
                    {/each}
                {/if}

            </div>
        {/each}


    </div>
    <div class="steps">
        <Scrolly bind:value>    
            {#each scenes as scene, i}
                {@const active = value === i}

                <div class="step"
                    data-scene={scene}
                     class:active
                     style="
                        margin-top: {i == 0 ? -vh/2 : ''}px;
                        padding-top: {i == 0 ? '0' : vertStack ? vh*.25 : vh*.25}px;
                        min-height: {vh*.75}px;
                        padding-bottom: {vertStack ? vh*.75 : ''}px;
                    "
                >

                    {#each textStep[scene] as text, i}
                        <div class="text-wrapper">
                            <p class="text-fg {text.value.match(/class=big/) ? "span-big" : ''}" style="height:100%;"><span class="text-inner">{@html text.value}</span></p>
                            <p class="text-bg {text.value.match(/class=big/) ? "span-big" : ''}" aria-hidden="true" style="height:100%;"><span class="text-inner">{@html text.value}</span></p>
                        </div>
                    {/each}

                    {#if scene == "second"}
                        <div class="text-wrapper">
                            <p class="text-fg" style="margin-bottom:30px;">
                                <span>
                                    <details><summary>Wayne Coyne&rsquo;s Ballot</summary>#1 Debut, Bjork, #2 White Album, Beatles, #3 Soundtrack, The Wizard of Oz, #4 Donovan's Greatest Hits, Donovan, #5 Bitches Brew, Miles Davis, #6 In the Court of the Crimson King, King Crimson, #7 Elephant, White Stripes, #8 Dark Side of the Moon, Pink Floyd, #9 Sea Change, Beck, #10 Physical Graffiti, Led Zeppelin</details>
                                    <details><summary>Billie Joe Armstrong&rsquo;s Ballot</summary>#1 Revolver, Beatles, #2 Rise and Fall of Ziggy Stardust, David Bowie, #3 Beggars Banquet, The Rolling Stones, #4 London Calling, The Clash, #5 The Doors, The Doors, #6 Bringing it all Back Home, Bob Dylan, #7 Never Mind the Bollocks, The Sex Pistols, #8 Nevermind, Nirvana, #9 Rocket to Russia, Ramones, #10 Tim, The Replacements</details>
                                    <details><summary>Moby&rsquo;s Ballot</summary>#1 What's Going On, Marvin Gaye, #2 London Calling, The Clash, #3 Closer, Joy Division, #4 Roxy Music, Roxy Music, #5 Marquee Moon, Television, #6 Bryter Layer, Nick Drake, #7 Low, David Bowie, #8 Freedom of Choice, Devo, #9 The Man-Machine, Kraftwerk, #10 Heaven Up Here, Echo and the Bunnymen</details>
                                    <details><summary>James Hetfield&rsquo;s Ballot</summary>#1 Led Zeppelin, Led Zeppelin, #2 Black Sabbath, Black Sabbath, #3 Welcome to my Nighmare, Alice Cooper, #4 Pet Sounds, Beach Boys, #5 Rocks, Aerosmith, #6 Ace of Spades, Motorhead, #7 Van Halen, Van Halen, #8 (pronounced Leh-Nerd Skin-Nerd), Lynyrd Skynyrd, #9 Strangers in the Night, UFO, #10 White Light, White Heat, White Trash, Social Distortion</details>
                                    <details><summary>Flea&rsquo;s Ballot</summary>#1 London Calling, The Clash, #2 A Love Supreme, John Coltrane, #3 Catch a Fire, Bob Marley, #4 Trout Mask Replica, Captain Beefheart, #5 Are you Experienced, Jimi Hendrix, #6 One Nation under a groove, Funkadelic, #7 Blue, Joni Mitchell, #8 After the Gold Rush, Neil Young, #9 Songs in the Key of Life, Stevie Wonder, #10 Horses, Patti Smith</details>
                                    <details><summary>Britney Spears&rsquo;s Ballot</summary>#1 Thriller, Michael Jackson, #2 Rhythm Nation 1814, Janey Jackson, #3 Bad, Michael Jackson, #4 Like a Prayer, Madonna, #5 Off the Wall, Michael Jackson, #6 Whitney Houston, Whitney Houston, #7 The Dock of the Bay, Otis Redding, #8 Purple Rain, Prince, #9 Sign o the Times, Prince, #10 CrazySexyCool, TLC</details>   
                                </span>
                            </p>
                        </div>
                    {/if}

                </div>
            {/each}
        </Scrolly>
    </div>
</section>

<div class:mobile class="center-col" style="">
    {#each copy.conclusion as text, i}
        <p class="center">
            {@html text.value}
        </p>
    {/each}
</div>

<div class:mobile class="center-col method" style="">
    <h3 class="center">Methods</h3>
    {#each copy.methods as text, i}
        <p class="center">
            {@html text.value}
        </p>
    {/each}
</div>

<style>

.method h3 {
    font-size: 18px;
    font-weight: 600;
}

.method p {
    font-size: 15px;
}

.mobile .method h3 {
    font-size: 14px;
}


.mobile .method p {
    font-size: 12px;
}

details {
    font-size: 14px;
    background-color: rgba(25,25,25,.93);
    padding-bottom: 7px;
    padding-left: 7px;
    padding-top: 5px;
    margin-top: -1px;
    pointer-events: all;
    /* box-shadow: 15px 0 var(--color-bg), -15px 0 var(--color-bg); */
}

details::selection, summary::selection {
  color: black;
  background: white;
}

summary {
    color: #969696;
}

.missing-image {
    background-color: black;
}

.voter-grid {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
}

.voter-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.voter-intro {
    position: relative;
}

.voter-intro .text-transform {
    z-index: 1000;
    position: absolute;
    top: 50%;
    transform: translate(0,-50%);


}

.steps {
    pointer-events: none;
}

.step {
    margin-left: 65px;
}

.mobile .step {
    margin-left: auto;
}

.text-fg {
    pointer-events: all;
}

.vertStack .fourth .counter, .vertStack .fifth .counter, .vertStack .sixth .counter {
    transform: translate(0,100%);
}

.vertStack .fourth- .year-2020 .img-wrapper img, .fourth- .year-2020 .img-wrapper .year-label
.vertStack .fifth- .year-2020 .img-wrapper img, .fifth- .year-2020 .img-wrapper .year-label {
    opacity: .2;
    transition: opacity .5s;
}

.vertStack .fourth .year-2020 .counter,
.vertStack .fifth .year-2020 .counter,
.vertStack .fifth .year-albums .counter,
.vertStack .sixth .year-albums .counter {
    transform: translate(0,100%);
    top: 15px;
    width: 50px;
}

.vertStack .fourth .year-2003 .counter, .vertStack .fifth .year-2003 .counter {
    display: none;
}

.vertStack .fifth .year-albums .counter {
    display: block;
}

.fifth .counter, .sixth .counter, .fourth .counter {
    transform: translate(0,100%);
    top: auto;
    display: block;
    bottom: -3px;
}

.fifth .year-2003 .counter {
    display: none;
}

.fifth .year-albums .counter {
    display: block;
}

.fourth-3 .year-2020 .img-wrapper .counter {
    color: blue;
}

.fourth-3 .year-2003 .img-wrapper .counter {
    opacity: 0;
}

.voter {
    background-size: contain;
    width: 70px;
    height: 70px;
    background-color: black;
    background-repeat: no-repeat;
    background-position: center;
}

.wrapper {
    width: 500px;
}

.sixth .counter.scene-2, .sixth .counter.scene-3, .sixth .counter.scene-4, .sixth .counter.scene-5, .sixth .counter.scene-6 {
    font-size: 24px;
    transform:translate(0,calc(100% + 5px));
}

.year {
    transition: transform .5s;
}

.noMotion .year {
    transition: none;
}



.mobile .counter {
    font-size: 14px;
}

/* .fourth, .fifth {
    display: block;
    position: absolute;
    top: 50%;
} */

/* .fourth .wrapper, .fifth .wrapper {
    width: auto;
    position: absolute;
    left: 0;
    top: 100px;
} */

/* .fifth .wrapper:last-of-type {
    top: 500px
} */

.img-wrapper {
    position: absolute;
    transition: transform .5s calc(var(--delay) * calc(1s * 0.005));
    transform: translate3d(0,0,0);
}

.noMotion .img-wrapper {
    transition: none;
}

.first .year {
    transform:translate(0,-1000px);
}

.vertStack .fourth  .counter-big, .vertStack .fifth .counter-big, .vertStack .sixth .counter-big {
    font-size: 14px;
    right: auto;
    line-height: 1.2;
    text-align: center;
}

.buttons {
    position: absolute;
}

.img-wrapper img {
    transition: opacity .5s;
}

.third .year-label, .second .year-label {
    top: -25px;
    font-size: 22px;
}

.grid {
    width: 100%;
    height: 1px;
    /* top: 50%; */
    transform: translate(0,-36px);
    z-index: 1000;
    left: 0;
    position: absolute;
    background-color: #50555b;
}

.scene-sixth .grid {
    background: none;
}

.scene-sixth .grid .year-label {
    text-align: left;
    transform: translate(100px,100%);
    width: 150px;
    padding: 0;
    top: 24px;
    font-size: 24px;
}

.scene-sixth:not(.scene-sub-) .grid .year-label {
    display: none;
}



.grid-2 {
    transform: translate(0,-5px);
}

.grid .year-label {
    line-height: 1.1;
    width:100px;
    padding: 5px;
    font-size:18px;
    font-weight:500;
    text-align:right;
    transform:translate(0,0);
}
.grid-1 .year-label {
    transform:translate(0,-100%);
}

.vertStack .grid {
    width: 1px;
    left: 0;
    height: var(--vh);
}

.vertStack .fourth .grid .year-label, .vertStack .fifth .grid .year-label {
    width: 150px;
    text-align: left;
    transform:translate(-100%,-100%);   
}

.vertStack .year-label {
    padding-left: 0;
    padding-right: 0;
}

.vertStack .sixth .year-label {
    transform: translate(-100%,0);
    top: 0;
    left: -30px;
}

.shading {
    background: linear-gradient(180deg, var(--color-bg) 20%, #727272 100%);
    border-radius: 0px;
    position: absolute;
    top: auto;
    bottom: 0;
    z-index: -1;
    left: -5px;
    transform: translate(0,0%);
}

.vertStack .shading {
    background: linear-gradient(90deg, var(--color-bg) 20%, #727272 100%);
    top: -5px;
    left: auto;
    right: 0;
    bottom: auto;
    transform: translate(0%,0%);
}

.sixth .shading {
    display: none;
}

.vertStack .fourth .grid-1 .year-label, .vertStack .fifth .grid-1 .year-label {
    transform:translate(-100%,-100%);
    text-align: right;
}

.vertStack .fourth .grid-0 .year-label, .vertStack .fifth .grid-0 .year-label {
    transform:translate(0,-100%);
    text-align: left;
}

.grid .year-label span {
    padding: 0;
    border-radius: 0;
}




</style>
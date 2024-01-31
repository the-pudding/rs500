<script>
import Voters from "$data/voters.csv"
import data from "$data/albums.csv"


import { getGridPosition } from '$actions/getGridPosition.js';
import {fade, scale} from 'svelte/transition';
import { group, sum } from "d3";
import Scrolly from "$components/helpers/Scrolly.svelte";

export let vw;
export let vh;
export let scrollY;

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
    "third":"compilations",
    "fourth":"spotify",
    "fifth":"change in rankings"
}

let scenes = Object.keys(textStep);
$: stepValue = value ? scenes[value] : stepValue == scenes[scenes.length - 1] ? stepValue : "first" ;
$: stepValue, setScene(stepValue);

$: console.log(sceneSetTo)

let firstScene = [
    {
        year:2003,
        layout:"large",
        dataset:"voters"
    }
]
let secondScene = [
    {
        year:2003,
        layout:"grid-1",
        dataset:"voters"
    }
]
let thirdScene = [
    {
        year:2003,
        layout:"grid",
        dataset:"voters"
    },
    {
        year:2020,
        layout:"grid",
        dataset:"voters"
    }
]
let fourthScene = [
    {
        year:2003,
        layout:"grouped-voter",
        dataset:"voters"
    }
    ,
    {
        year:2003,
        layout:"grouped-voter",
        dataset:"albums"
    }
]
let fifthScene = [
    {
        year:2003,
        layout:"grouped-voter",
        dataset:"albums"
    }
    ,
    {
        year:2020,
        layout:"grouped-voter",
        dataset:"albums"
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
    if(sceneCount == "third"){
        cols = thirdScene;
    }
    if(sceneCount == "fourth"){
        cols = fourthScene;
    }
    if(sceneCount == "fifth"){
        cols = fifthScene;
    }
}

function filterData(year,layout,sceneSetTo,sceneSetToSub,dataset){

    let temp;

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

    if(sceneSetTo == "first") {
        temp = temp
            .filter(d => d.Race !== "n/a");

    }

    if(sceneSetTo == "fourth" || sceneSetTo == "fifth"){

        let tempGroup = [];

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

        let grouped = group(temp, d => {

            let rank;
            
            if(dataset == "voters"){
                let teenage = d["Teenage Decade"];
                if(teenage == "1940s" || teenage == "1930s" || teenage == "1950s"){
                    return "1950s and earlier"
                }
                return d["Teenage Decade"];
                if(+d["Birthyear"] < 1920){
                    console.log(d)
                    return "50";
                }
                rank = JSON.stringify(+d["Birthyear"] - 20).slice(2,4);
                rank = Math.round(rank / 10) * 10;
                
            } else {
                rank = JSON.stringify(+d["Release Year"]);//.slice(2,4);
                rank = Math.round(rank / 10) * 10;
            }

            return rank;
        })

        let groupLengths = [];
        let rowMax = 10;

        let groupAmounts = [];

        grouped.forEach((d,e) => {
            groupLengths.push(d.length)
            groupAmounts.push(e)
        })

        grouped.forEach((d,e) => {
            let groupLength = d.length;
            
            d.forEach((j,i) => {
                j["count"] = i
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
            d.pos = getGridPosition(layout,i,d,vw,vh,size,padding,rowSize);
        });

    console.log(temp)

    return temp;
}


</script>


<section style="height:100vh; background:red;">
    <h1>test</h1>
</section>

<section>
    <div 
        class="voter-grid year-wrapper {sceneSetTo}"
        style="
            height:{vh}px;
        "
    >
        <div class="buttons">
            <button on:click={() => setScene("first")}>first</button>
            <button on:click={() => setScene("second")}>second</button>
            <button on:click={() => setScene("third")}>third</button>
            <button on:click={() => setScene("fourth")}>fourth</button>
            <button on:click={() => setScene("fifth")}>fifth</button>
        </div>

        {#each cols as col, i (sceneSetTo == "fourth" ? col.dataset : col.year)}
            <div in:fade={{delay:1000, y:50}} class="year year-{col.year} year-{col.layout} scene-{sceneSetTo}"
            style=""
            >
                <h1>{col.year}</h1>
                {#if col.dataset == "voters"}
                    {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset) as voter (voter.ID)}
                        <!-- <div class="voter" style="background-color:{voter.Gender == "man" ? "black" : "green"};background-image:url(assets/rolling_images_resized/256/{voter.ID}.jpg);" alt=""></div> -->
                        <div
                            class="img-wrapper {col.dataset == "voters" ? voter.Gender : '' } age-{col.dataset == "voters" ? voter["Teenage Decade"] : '' }}"
                            in:fade={{delay:1000}}
                            style="transform:translate3D({voter.pos[0]}px,{voter.pos[1]}px,0); width:{voter.pos[2]}px; height:{voter.pos[2]}px;"
                        >
                            {#if voter["Race"] == "n/a"}
                                <div in:fade class="voter-image missing-image"></div>
                            {:else}
                                <img class="voter-image" style="" width="100%" height="100%" src="assets/rolling_images_resized/256/{voter["ID"]}.jpg" alt="" />
                            {/if}
                            
                        </div>

                    {/each}
                {:else}
                    {#each filterData(col.year,col.layout,sceneSetTo,sceneSetToSub,col.dataset) as album (album["Album ID"])}
                        <div
                            class="img-wrapper release-{album["Release Year"]}"
                            in:fade={{delay:1000}}
                            style="--delay: {album.rank}; transform:translate3D({album.pos[0]}px,{album.pos[1]}px,0); width:{album.pos[2]}px; height:{album.pos[2]}px;"
                        >
                            <img class="{album["Album Genre"]}" width="100%" height="100%" src="assets/album_art_resized/256/{album["Album ID"]}.jpg" alt="" />
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

.second .woman, .third .woman {
    margin-top: -70px;
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

.steps {
    pointer-events: none;
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

.fourth, .fifth {
    display: block;
    position: absolute;
    top: 50%;
}

.fourth .wrapper, .fifth .wrapper {
    width: auto;
    position: absolute;
    left: 0;
    top: 100px;
}

.fifth .wrapper:last-of-type {
    top: 500px
}

.img-wrapper {
    position: absolute;
    overflow: hidden;
    transition: all 1s,
        transform 1s;

}

.first .year {
    transform:translate(0,-1000px);
}

.buttons {
    position: absolute;
}

.img-wrapper img {
    transition: opacity .5s;
}

</style>
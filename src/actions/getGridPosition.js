import { MoveRight } from "lucide-svelte";

let big = 150;
let small = 15;
let gap = 20;
let gapTwo = 3;
let mid = 50-gapTwo+1;

let gapBreak = 20;
let groupedSize = 25;

export const getGridPosition = (gridType,rank,album,vw,vh,size,padding,rowSize) => {

    let leftPadding = 0;
    let topPadding = 0;

    if(vw > 600){
        leftPadding = (vw - 600)/2
        topPadding = 100;
    }

    if(gridType == "large"){
        // size = 100
        // rowSize = vw/size;
        // leftPadding = 0;
        // topPadding = 0;
        size = 100;
        rowSize = 600/size
        
        
        let left = ((rank) % rowSize)*size + leftPadding
        let top = (Math.floor((rank)/rowSize))*size + topPadding
        return [left,top,size]
    }

    if(gridType == "grid-1"){
        rowSize = 20;
        size = vw/rowSize

        let left = ((rank) % 20)*size
        let top = (Math.floor((rank)/20))*size
        return [left,top,size]
    }

    if(gridType == "grouped"){
        let offSet = album.groupCounts.slice(0,album.groupCount);
        let totalOffset = 0
        offSet.forEach(d => {
            let rows = Math.ceil(d/rowSize);
            totalOffset = rows + totalOffset
        })
        
        let top = (Math.floor((album.count)/rowSize))*size + topPadding;
        let left = ((album.count) % 10)*size + rowSize*size*album.groupCount + album.groupCount*20;

        return [left,top,size]
    }

    if(gridType == "waffle-single"){
        let left = ((rank-1) % rowSize)*size + leftPadding
        let top = (Math.floor((rank-1)/rowSize))*size + topPadding
        return [left,top,size]
    }

    if(gridType == "waffle"){
        let rowSize = 5;
        small = 300/5;

        let left = ((rank-1) % rowSize)*small + leftPadding
        let top = (Math.floor((rank-1)/rowSize))*small + topPadding

        return [left,top,small]
    }

    if(gridType == "col"){
        if(rank < 11){
            mid = 75;
            let left = leftPadding
            let top = mid*(rank-1) + gapTwo*(rank-1) + topPadding
            return [left,top,mid]
        }
    }

    if(gridType == "full"){


        if(vw > 600){
            big = 300;
            mid = big/3 - gapTwo + 1;
            small = (big * 2) / 25;
        }

        if(rank == 1){
            let left = 0 + leftPadding;
            let top = 0 + topPadding;
            return [left,top,big]
        }
        if(rank < 11){
            let top = (Math.floor((rank-2)/3)*mid + Math.floor((rank-2)/3)*gapTwo) + topPadding;
            let left = (((rank-2) % 3)*mid + big) + ((rank-2) % 3)*gapTwo + gapTwo + leftPadding;
            return [left,top,mid]
        }

        let secondGap = 0;
        
        if(rank > 250){
            secondGap = gapBreak;
            let top = Math.floor((rank-251)/25)*small + big + gap + secondGap + Math.ceil(240/25)*small + topPadding;
            let left = (((rank- 251) % 25)*small) + leftPadding;
            return [left,top,small];    
        }

        let top = (Math.floor((rank-11)/25)*small + big) + gap + secondGap + topPadding;
        let left = (((rank-11) % 25)*small) + leftPadding;
        return [left,top,small];
    }

    if(gridType == "fill"){
        let left = ((rank-1) % rowSize)*size + (padding * ((rank-1) % rowSize));        
        let top = (Math.floor((rank-1)/rowSize))*size + padding*(Math.floor((rank-1)/rowSize));
        return [left,top,size]
    }





    if(gridType == "grid"){
        let left = ((rank) % 15)*groupedSize
        let top = (Math.floor((rank)/15))*groupedSize
        return [left,top,groupedSize]
    }

    if(gridType == "grouped-voter"){

        let squareSize = 14;

        let keysAvail = Object.keys(album);
        let dataType = "album";
        if(keysAvail.indexOf("Birthyear") > -1){
            dataType = "voter";
        }

        let rowSize = 10;

        let offSet = album.groupCounts.slice(0,album.groupCount);
        let totalOffset = 0

        offSet.forEach(d => {
            totalOffset = Math.min(d,rowSize) + totalOffset
        })
        
        let top = (Math.floor((album.count)/rowSize))*squareSize;
        if(dataType == "album"){
            top = top * -1 - 50;
        }
        let left = ((album.count) % rowSize)*squareSize + (totalOffset*squareSize) + album.groupCount*20;

        return [left,top,squareSize]

    }


    return [0,0]
}
import { MoveRight } from "lucide-svelte";

let big = 150;
let small = 15;
let gap = 20;
let gapTwo = 3;
let mid = 50-gapTwo+1;

let gapBreak = 20;
let groupedSize = 25;

export const getGridPosition = (gridType,rank,album,vw,vh,size,padding,rowSize,direction) => {

    let leftPadding = 0;
    let topPadding = 0;

    if(vw > 600){
        leftPadding = (vw - 600)/2
        topPadding = 100;
    }

    if(gridType == "grouped"){

        let orientation = direction;

        let offSet = album.groupCounts.slice(0,album.groupCount);
        let totalOffset = 0

        leftPadding = 100;
        topPadding = 100;

        let leftOffset = 0
        let topOffset = 0;

        offSet.forEach(d => {
            if(orientation == "stacked") {
                totalOffset = Math.ceil(d/rowSize) + totalOffset
                leftOffset = (totalOffset*size) + album.groupCount*20;
            }
        })

        if(orientation == "stacked"){

            let top = ((album.count) % rowSize)*size + topPadding;
            let left = (Math.floor((album.count)/rowSize))*size + leftPadding + leftOffset
            return [left,top,size]
        }

        else if(orientation == "horz"){
            let top = (Math.floor((album.count)/rowSize))*size + topPadding;
            let left = ((album.count) % rowSize)*size + rowSize*size*album.groupCount + album.groupCount*20 + leftPadding;
            return [left,top,size]
        }
        else {
            let top = ((album.count) % rowSize)*size + rowSize*size*album.groupCount + album.groupCount*20 + topPadding;
            let left = (Math.floor((album.count)/rowSize))*size + leftPadding
            return [left,top,size]
        }
        

    }


    if(gridType == "grouped-voter-gender"){

        let orientation = direction;

        let offSet = album.groupCounts.slice(0,album.groupCount);
        let totalOffset = 0
        let leftOffset = 0
        let topOffset = 0;

        if(orientation == "horz"){
            leftPadding = 0;
            topPadding = 0;

            if(album.sceneSub !== "" && album.scene == "sixth"){
                leftPadding = (rowSize*size*(7 - (+album.sceneSub)) + 20*5)*-1
            }
            // leftPadding = (vw - (rowSize*size*7 + 7*25))/2;
            // if(album["scene"] == "fifth"){
            //     leftPadding = 0;
            // }
        }

        offSet.forEach(d => {
            if(orientation == "horz") {
                totalOffset = rowSize + totalOffset
                leftOffset = (totalOffset*size) + album.groupCount*20;
            }
            else {
                totalOffset = Math.ceil(d/rowSize) + totalOffset
                topOffset = (totalOffset*size) + album.groupCount*25;
            }
        })
        
        let top = (Math.floor((album.count)/rowSize))*size + topPadding + topOffset;
        let left = ((album.count) % rowSize)*size + leftPadding + leftOffset;

        return [left,top,size];
    }


    if(gridType == "large"){
        topPadding = 0;
        // size = 100
        // rowSize = vw/size;
        // leftPadding = 0;
        // topPadding = 0;
        // size = 60;
        rowSize = 600/size
        
        
        let left = ((rank) % rowSize)*size + leftPadding
        let top = (Math.floor((rank)/rowSize))*size + topPadding
        return [left,top,size-padding]
    }

    if(gridType == "grid"){
        let left = ((rank) % rowSize)*size + leftPadding
        let top = (Math.floor((rank)/rowSize))*size + topPadding
        return [left,top,size]
    }

    if(gridType == "grid-1"){
        rowSize = 20;
        size = vw/rowSize;

        let left = ((rank) % 20)*size
        let top = (Math.floor((rank)/20))*size + topPadding
        return [left,top,size]
    }



    if(gridType == "waffle-single"){
        if(vh < 900){
            topPadding = 50;
        }
        let left = ((rank-1) % rowSize)*size + leftPadding
        let top = (Math.floor((rank-1)/rowSize))*size + topPadding
        return [left,top,size-padding]
    }

    if(gridType == "waffle"){
        let left = ((rank-1) % rowSize)*size + leftPadding
        let top = (Math.floor((rank-1)/rowSize))*size + topPadding

        return [left,top,size-padding]
    }

    if(gridType == "col"){
        let topPadding = 50;
        let bottomPadding = 20;
        if(rank < 11){

            if(vh < 900){
                mid = (Math.min(600,vw))/10;
                let left = leftPadding + (((rank-1) % 10)*mid)
                let top = topPadding
                return [left,top,mid]
    
            }
            else {
                mid = (vh-topPadding-gapTwo*(10)-bottomPadding)/10;
            }
            
            let left = leftPadding
            let top = mid*(rank-1) + gapTwo*(rank-1) + topPadding
            return [left,top,mid]
        }
    }

    if(gridType == "full"){
        let bottomPadding = 20;
        let topPadding = 70;
        rowSize = 25;

        if(vw > 600){
            big = 300;
            mid = big/3 - gapTwo + 1;
            small = (big * 2) / 25;
        }

        let bigCardsNeeded = 490;
        let availableWidth = (Math.min(600,vw));
        let availableHeight = vh-topPadding-mid-gap-50;

        let maxSquare = 300;
    
        let squareSize = Math.floor(Math.min(availableWidth, availableHeight) / Math.sqrt(bigCardsNeeded));
        squareSize = Math.min(maxSquare,squareSize);

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
    
        const squareDimension = getMaxSizeOfSquaresInRect(bigCardsNeeded,availableWidth, availableHeight);
    
        squareSize = squareDimension;

        if(vh < 900){
            mid = (Math.min(600,vw)/10);
            big = mid
            small = squareSize;
            rowSize = Math.ceil(Math.min(600,vw)/squareSize);
        }

        small = Math.floor(small);
        mid = Math.floor(mid);


        if(rank == 1){
            let left = 0 + leftPadding;
            let top = 0 + topPadding;
            return [left,top,big]
        }
        if(rank < 11){

            if(vh < 900){
                let left = leftPadding + (((rank-1) % 10)*mid)
                let top = Math.floor((rank-1)/10)*mid + topPadding
                return [left,top,mid]
            }

            let top = (Math.floor((rank-2)/3)*mid + Math.floor((rank-2)/3)*gapTwo) + topPadding;
            let left = (((rank-2) % 3)*mid + big) + ((rank-2) % 3)*gapTwo + gapTwo + leftPadding;
            return [left,top,mid]
        }

        let secondGap = 0;
        
        if(rank > 250){
            secondGap = gapBreak;
            let top = Math.floor((rank-251)/rowSize)*small + big + gap + secondGap + Math.ceil(240/rowSize)*small + topPadding;
            let left = (((rank- 251) % rowSize)*small) + leftPadding;
            return [left,top,small];    
        }

        // if(vh < 900){
        //     // let top = (Math.floor((rank-11)/25)*small) + topPadding;
        //     // let left = (((rank-11) % 25)*small) + leftPadding + (mid + 20);
            
        //     return [left,top,small]
        // }


        let top = (Math.floor((rank-11)/rowSize)*small + big) + gap + secondGap + topPadding;
        let left = (((rank-11) % rowSize)*small) + leftPadding;
        return [left,top,small];

    }

    if(gridType == "fill"){
        let left = ((rank-1) % rowSize)*size + (padding * ((rank-1) % rowSize));        
        let top = (Math.floor((rank-1)/rowSize))*size + padding*(Math.floor((rank-1)/rowSize));
        
        let multiple = .08
        if(((rank-1) % rowSize) % 2 === 0){
            multiple = multiple * 1.2
        }

        top = top - album.scroll*(rowSize*multiple - ((rank-1) % rowSize)*multiple)
        return [left,top,size]
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
let big = 150;
let small = 15;
let gap = 20;
let gapTwo = 3;
let mid = 50-gapTwo+1;

let gapBreak = 20;

export const getGridPosition = (gridType,rank,album) => {
    if(gridType == "waffle"){
        let left = ((rank-1) % 8)*small*4
        let top = (Math.floor((rank-1)/8))*small*4
        return [left,top,small*4]
    }

    if(gridType == "grouped"){

        let offSet = album.groupCounts.slice(0,album.groupCount);
        let totalOffset = 0
        offSet.forEach(d => {
            let rows = Math.ceil(d/10);
            totalOffset = rows + totalOffset
        })
        
        let top = (Math.floor((album.count)/10))*mid + (totalOffset * mid) + (album.groupCount * 50);
        let left = ((album.count) % 10)*mid;
        return [left,top,mid]

    }
    if(gridType == "full"){
        if(rank == 1){
            return [0,0,big]
        }
        if(rank < 11){
            let top = (Math.floor((rank-2)/3)*mid + Math.floor((rank-2)/3)*gapTwo);
            let left = (((rank-2) % 3)*mid + big) + ((rank-2) % 3)*gapTwo + gapTwo;
            return [left,top,mid]
        }

        let secondGap = 0;
        if(rank > 250){
            secondGap = gapBreak;
        }
        let top = (Math.floor((rank-11)/20)*small + big) + gap + secondGap;
        let left = (((rank-11) % 20)*small);
        return [left,top,small];
    }
    if(gridType == "col"){
        if(rank < 11){
            let top = mid*(rank-1) + gapTwo*(rank-1)
            return [0,top,mid]
        }
    }
    return [0,0]
}
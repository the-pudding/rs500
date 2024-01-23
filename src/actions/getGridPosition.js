let big = 150;

let small = 15;
let gap = 20;
let gapTwo = 3;
let mid = 50-gapTwo+1;

export const getGridPosition = (gridType,rank) => {
    if(gridType == "full"){
        if(rank == 1){
            return [0,0,big]
        }
        if(rank < 11){
            let top = (Math.floor((rank-2)/3)*mid + Math.floor((rank-2)/3)*gapTwo);
            let left = (((rank-2) % 3)*mid + big) + ((rank-2) % 3)*gapTwo + gapTwo;
            return [left,top,mid]
        }
        let top = (Math.floor((rank-11)/20)*small + big) + gap;
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
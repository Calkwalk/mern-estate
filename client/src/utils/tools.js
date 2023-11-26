
const uniqueArrayMerge = (arr1, arr2, key) => {
    let arr= [...arr1, ...arr2]
    let map = new Map();
    arr.forEach(item => {
        if(!map.has(item[key])){map.set(item[key], item)}
    })
    return [...map.values()]
}

export {
    uniqueArrayMerge
}
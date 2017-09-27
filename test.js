var en2 = function (key) {
    var arr = []
    for (var index = 0; index < 100; index++) {
        arr.push(`${key}_${index}_${key}`)
    }
    return arr
}

console.log(en2('fdsfdf'))
function eigen(mat) {
    if (mat.length == 4) {
        console.log("2x2")
        var a = mat[0]
        var b = mat[1]
        var c = mat[2]
        var d = mat[3]
        var det = (a + d) * (a + d) + 4 * b * c
        var x1 = ((a + d) + Math.sqrt(det)) / 2
        var x2 = ((a + d) - Math.sqrt(det)) / 2
        console.log(a+""+b+""+c+""+d+"they are "+x1+" and "+x2)
    }
}

var matA = [1, 0, 0, 1]
eigen(matA)
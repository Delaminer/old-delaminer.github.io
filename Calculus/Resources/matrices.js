function gcf(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
}
function eigen(mat) {
    if (mat.length == 4) {
        console.log("2x2")
        var a = mat[0]
        var b = mat[1]
        var c = mat[2]
        var d = mat[3]
        var det = (a + d) * (a + d) - 4 * (a * d - b * c)
        var x1 = ((a + d) + Math.sqrt(det)) / 2
        var x2 = ((a + d) - Math.sqrt(det)) / 2
        console.log(a+""+b+""+c+""+d+"they are "+x1+" and "+x2)
    }
}

var size = 0
function Use2(){
    if (size == 2) return
    size = 2
    document.getElementById("matrix table").innerHTML = `
    <tr>
        <td><span id="A1" contenteditable>1</span></td>
        <td><span id="B1" contenteditable>0</span></td>
    </tr>
    <tr>
        <td><span id="A2" contenteditable>3</span></td>
        <td><span id="B2" contenteditable>4</span></td>
    </tr>`
}
function Use3(){
    if (size == 3) return
    size = 3
    document.getElementById("matrix table").innerHTML = `
    <tr>
        <td><span id="A1" contenteditable></span></td>
        <td><span id="B1" contenteditable></span></td>
        <td><span id="C1" contenteditable></span></td>
    </tr>
    <tr>
        <td><span id="A2" contenteditable></span></td>
        <td><span id="B2" contenteditable></span></td>
        <td><span id="C2" contenteditable></span></td>
    </tr>
    <tr>
        <td><span id="A3" contenteditable></span></td>
        <td><span id="B3" contenteditable></span></td>
        <td><span id="C3" contenteditable></span></td>
    </tr>`
}
function ratio(one, two) {
    if (one == 0 && two == 0) return 1
    if (two == 0) return 0
    return one / two
}
function getEigenvector(a, b, c, d, x) {
    var a1 = a - x
    var b1 = b
    var c1 = c
    var d1 = d - x
    var v1a = 0
    var v1b = 0
    
    if (a1 == 0 && b1 == 0) {
        v1a = -d1
        v1b = c1
    }
    else if ((c1 == 0 && d1 == 0) || (a1 == c1 && b1 == d1) || (a1 == -c1 && b1 == -d1)) {
        v1a = -b1
        v1b = a1
    }
    else if (a1 == 0 && c1 == 0) {
        // v1a = -d1
        // v1b = c1
        //a column of zeros, TODO
        v1a = 1
        v1b = 0
    }
    else if (b1 == 0 && d1 == 0) {
        // v1a = -b1
        // v1b = a1
        v1a = 0
        v1b = 1
    }
    // if (v1a == 0) {

    // }
    // else if (v1b == 0) {

    // }
    // if ()
    var g = gcf(v1a, v1b)
    v1a /= g
    v1b /= g
    return [v1a, v1b]
}
function getComplexEigenvector(a, b, c, d, alpha, beta){
    var a1 = a - alpha
    var b1 = b
    var c1 = c
    var d1 = d - alpha
    var v1a = 0
    var v1b = 0

}
function solveMatrix(){
    if (size == 2) {
        var a = parseInt(document.getElementById("A1").innerText)
        var b = parseInt(document.getElementById("B1").innerText)
        var c = parseInt(document.getElementById("A2").innerText)
        var d = parseInt(document.getElementById("B2").innerText)
        var det = (a + d) * (a + d) - 4 * (a * d - b * c)
        if (det > 0) {
            var x1 = ((a + d) + Math.sqrt(det)) / 2
            var x2 = ((a + d) - Math.sqrt(det)) / 2
            document.getElementById("eigenvalues").innerHTML = "Eigenvalues are "+x1+" and "+x2
            var v1 = getEigenvector(a, b, c, d, x1)
            var v2 = getEigenvector(a, b, c, d, x2)
            document.getElementById("eigenvectors").innerHTML = "Eigenvectors are ["+v1[0]+", "+v1[1]+"] and ["+v2[0]+", "+v2[1]+"]"
            document.getElementById("eigenvalue-solution").innerHTML = " Solution is x(t) = C1 * e^"+x1+"t * ["+v1[0]+", "+v1[1]+"] + C2 * e^"+x2+"t * ["+v2[0]+", "+v2[1]+"]"
        }
        else if (det == 0) {
            //may or may not have 2 eigenvectors
            var x = (a + d) / 2
            document.getElementById("eigenvalues").innerHTML = "Eigenvalues are both "+x
        }
        else {
            //Complex eigenvalues
            var alpha = (a + d) / 2
            var beta = Math.sqrt(-det) / 2
            document.getElementById("eigenvalues").innerHTML = "Complex eigenvalues are "+alpha+" +/- "+beta+"i"
            var v = getEigenvector(a, b, c, d, alpha, beta)
            document.getElementById("eigenvalue-solution").innerHTML = " Solution is x(t) = e^"+alpha+"t * ["+v1[0]+", "+v1[1]+"] + C2 * e^"+x2+"t * ["+v2[0]+", "+v2[1]+"]"
        }
    }
}
Use2()
solveMatrix()
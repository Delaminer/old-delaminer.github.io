var defaultRealRange = [-2.5, 1.5]
var defaultImaginaryRange = [-2, 2]

var realRange = defaultRealRange
var imaginaryRange = defaultImaginaryRange

var Fractal = function() {
var vertexText = 
[
'precision highp float;',
'attribute vec2 vPos;',
'void main() {',
'   gl_Position = vec4(vPos, 0.0, 1.0);',
'}'
].join('\n')
var fragmentText = 
[
'precision highp float;',
//'attribute vec2 vPos;',
'uniform vec2 viewportDimensions;',
'uniform vec2 realRange;',
'uniform vec2 imaginaryRange;',
'void main() {',
'   vec2 z = vec2(      realRange.x + (realRange.y - realRange.x) * (gl_FragCoord.x / viewportDimensions.x),', //Real part (x coordinates)
'                       imaginaryRange.x + (imaginaryRange.y - imaginaryRange.x) * (gl_FragCoord.y / viewportDimensions.y)  );', //Imaginary part (y coordinates)
// '   if ((z.x > 0.5 && z.y > 0.5) || (z.x < 0.5 && z.y < 0.5)) {',
// '   gl_FragColor = vec4(0.5, 0.5, 0.75, 1.0);    }',
// '   else { gl_FragColor = vec4(0.9, 0.3, 0.5, 1.0); }',
//Zn = (Zn-1)^2 + z
'   vec2 newNumber = z;',
'   int it = 0;',
'   const int maxi = 1000;',
'   for (int i = 0; i < maxi; i++) {',
'       float newR = newNumber.x * newNumber.x - newNumber.y * newNumber.y + z.x;',
'       float newI = 2.0 * newNumber.x * newNumber.y + z.y;',
'       newNumber = vec2(newR, newI);',
'       if (newNumber.x * newNumber.x + newNumber.y * newNumber.y > 14.0) {',
//'           it = 2000;',
'           break;',
'       }',
'       it = i;',
'   }',
'   if (it < 998) {',
'       float progress = float(it) / float(maxi) * 6000.0;',
'       progress = mod(progress, 360.0);',
'       float h = progress;',
'       float s = 0.8;',
'       float v = 0.8;',
'       float c = v * s;',
'       float x = c * (1.0 - abs(mod(h / 60.0, 2.0) - 1.0));',
'       float m = v - c;',
'       float r = 0.0;',
'       float g = 0.0;',
'       float b = 0.0;',
'       if (h < 60.0) {',
'           r = c;',
'           g = x;',
'           b = 0.0;',
'       }',
'       else if (h < 120.0) {',
'           r = x;',
'           g = c;',
'           b = 0.0;',
'       }',
'       else if (h < 180.0) {',
'           r = 0.0;',
'           g = c;',
'           b = x;',
'       }',
'       else if (h < 240.0) {',
'           r = 0.0;',
'           g = x;',
'           b = c;',
'       }',
'       else if (h < 300.0) {',
'           r = x;',
'           g = 0.0;',
'           b = c;',
'       }',
'       else {',
'           r = c;',
'           g = 0.0;',
'           b = x;',
'       }',
'       gl_FragColor = vec4(r+m, g+m, b+m, 1.0);',
'   }',
'   else {',
'       gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
'   }',
'}'
].join('\n')
var canvas = document.getElementById("fractal");
var vpDimensions = [canvas.width, canvas.height]
function mouseZoom(event) {
    event.preventDefault();
    let posX = (realRange[1] - realRange[0]) * (event.offsetX) / canvas.width + realRange[0]
    let posY = (imaginaryRange[1] - imaginaryRange[0]) * (canvas.height - event.offsetY) / canvas.height + imaginaryRange[0]
    //scroll up is negative -> zoom in (decrease range)
    let multiplier = Math.pow(5.0 / 4.0, event.deltaY / 100.0);
    //V1 Scroll System - Mouse position becomes new center (Deprecated):
    // let delta = realRange[1] - realRange[0];
    // realRange[0] = posX - 0.5 * multiplier * delta
    // realRange[1] = posX + 0.5 * multiplier * delta
    // delta = imaginaryRange[1] - imaginaryRange[0];
    // imaginaryRange[0] = posY - 0.5 * multiplier * delta
    // imaginaryRange[1] = posY + 0.5 * multiplier * delta

    //V2 Scroll System - Mouse position stays on same point (using percentages)
    let newDelta = (realRange[1] - realRange[0]) * multiplier
    let positionPercent = (posX - realRange[0]) / (realRange[1] - realRange[0])
    realRange[0] = posX - newDelta * positionPercent
    //realRange[1] = posX + newDelta * (1.0 - positionPercent)
    realRange[1] = realRange[0] + newDelta

    newDelta = (imaginaryRange[1] - imaginaryRange[0]) * multiplier
    positionPercent = (posY - imaginaryRange[0]) / (imaginaryRange[1] - imaginaryRange[0])
    imaginaryRange[0] = posY - newDelta * positionPercent
    //imaginaryRange[1] = posY + newDelta * (1.0 - positionPercent)
    imaginaryRange[1] = imaginaryRange[0] + newDelta


    // console.log(posX +", "+posY+", range= "+(realRange[0] - realRange[1]))
    // console.log(realRange[0]+" to "+realRange[1]+"; "+imaginaryRange[0]+" to "+imaginaryRange[1])
}
var oldX;
var oldY;
var mouseDown
function mousePan(event) {
    if (mouseDown) {
        let deltaX = (realRange[1] - realRange[0]) * (event.offsetX - oldX) / canvas.width
        let deltaY = (imaginaryRange[1] - imaginaryRange[0]) * (event.offsetY - oldY) / canvas.height
        realRange[0] -= deltaX
        realRange[1] -= deltaX
        imaginaryRange[0] += deltaY
        imaginaryRange[1] += deltaY

        //console.log(event.offsetX+", "+event.offsetY)
    }
    oldX = event.offsetX
    oldY = event.offsetY
}
canvas.onwheel = mouseZoom
canvas.addEventListener('mousemove', mousePan)
canvas.addEventListener('mousedown', e => mouseDown = true)
canvas.addEventListener('mouseup', e => mouseDown = false)
canvas.addEventListener('mouseleave', e => mouseDown = false)
// canvas.addEventListener('mousedown', e => console.log("down"))
// canvas.addEventListener('mouseup', e => console.log("up"))
var gl = canvas.getContext("webgl");
if (!gl) {
    console.log("WebGL not supported, using experimental version.")
    gl = canvas.getContext('experimental-webgl')
}

if (!gl) {
    alert('Your browser does not support WebGL')
}
gl.viewport(0, 0, canvas.width, canvas.height)
gl.clearColor(0.75, 0.85, 0.2, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
var vertexShader = gl.createShader(gl.VERTEX_SHADER)
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(vertexShader, vertexText)
gl.shaderSource(fragmentShader, fragmentText)
gl.compileShader(vertexShader)
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    return;
}
gl.compileShader(fragmentShader)
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
    return;
}
var program = gl.createProgram();
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!',gl.getProgramInfoLog(program))
    return
}
gl.validateProgram(program)
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!',gl.getProgramInfoLog(program))
    return
}
gl.useProgram(program)
var viewportDimensionsUniform = gl.getUniformLocation(program, 'viewportDimensions')
var realRangeUniform = gl.getUniformLocation(program, 'realRange')
var imaginaryRangeUniform = gl.getUniformLocation(program, 'imaginaryRange')


var vertexBuffer = gl.createBuffer()
var vertices = [-1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, -1]
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

var vPosAttrib = gl.getAttribLocation(program, 'vPos')
gl.vertexAttribPointer(
    vPosAttrib,
    2, gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT, 0
)
gl.enableVertexAttribArray(vPosAttrib)

var loop = function() {
    vpDimensions = [canvas.width, canvas.height]
    gl.uniform2fv(viewportDimensionsUniform, vpDimensions);
    gl.uniform2fv(realRangeUniform, realRange);
    gl.uniform2fv(imaginaryRangeUniform, imaginaryRange);
    gl.clearColor(0.95, 0.85, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
}
function reset() {
    realRange = defaultRealRange
    imaginaryRange = defaultImaginaryRange
}
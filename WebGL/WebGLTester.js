var InitDemo = function () {
    loadTextResource('shader.vs.glsl', function(vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader')
            console.error(vsErr)
        }
        else {
            loadTextResource('shader.fs.glsl', function(fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader')
                    console.error(fsErr)
                }
                else {
                    //loadJSONResource('Susan.json', function(modelErr, modelObj) {
                    loadJSONResource('pencil.json', function(modelErr, modelObj) {
                        if (modelErr) {
                            alert('Fatal error getting JSON model')
                            console.error(fsErr)
                        }
                        else {
                            loadImage('PencilTex.png', function(imgErr, img) {
                            //loadImage('SusanTexture.png', function(imgErr, img) {
                                if (imgErr) {
                                    alert('Fatal error getting model texture')
                                    console.error(imgErr)
                                }
                                else {
                                    RunDemo(vsText, fsText, img, modelObj)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

var RunDemo = function(vertexShaderText, fragmentShaderText, modelImage, modelObject) {
    //Create WebGL
    var canvas = document.getElementById("game")
    var gl = canvas.getContext('webgl')
    var mat4 = glMatrix.mat4
    
    if (!gl) {
        console.log("WebGL not supported, using experimental version.")
        gl = canvas.getContext('experimental-webgl')
    }
    
    if (!gl) {
        alert('Your browser does not support WebGL')
    }
    gl.clearColor(0.75, 0.85, 0.2, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)

    // Create Shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    
    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

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

    // Create buffer
    // var triangleVertices = 
    // [ //x, y, z           r, g, b
    //     0.0, 0.5, 0.0,      1.0, 1.0, 0.0,
    //     -0.5, -0.5, 0.0,    0.7, 0.0, 1.0,
    //     0.5, -0.5, 0.0,     0.1, 1.0, 0.6
    // ]
    var boxVertices = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
    ];
    
    var modelVertices = modelObject.meshes[0].vertices
    var modelIndices = [].concat.apply([], modelObject.meshes[0].faces)
    var modelTexCoords = modelObject.meshes[0].texturecoords[0]
    var modelNormals = modelObject.meshes[0].normals

    var modelPosVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, modelPosVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVertices), gl.STATIC_DRAW)
    
    var modelTexCoordVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelTexCoords), gl.STATIC_DRAW)
    
    var modelIndexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBufferObject)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelIndices), gl.STATIC_DRAW)

    var modelNormalBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelNormals), gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, modelPosVertexBufferObject)
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(
        positionAttribLocation, //location
        3, //number of elements
        gl.FLOAT, //type of elements
        gl.FALSE, //is data normalized
        3 * Float32Array.BYTES_PER_ELEMENT, //size of vertex
        0 //offset from beginning of vertex to this data
    )
    gl.enableVertexAttribArray(positionAttribLocation)

    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject)
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord')
    gl.vertexAttribPointer(
        texCoordAttribLocation, //location
        2, //number of elements
        gl.FLOAT, //type of elements
        gl.FALSE, //is data normalized
        2 * Float32Array.BYTES_PER_ELEMENT, //size of vertex
        0 //offset from beginning of vertex to this data
    )
    gl.enableVertexAttribArray(texCoordAttribLocation)
    
    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalBufferObject)
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal')
    gl.vertexAttribPointer(
        normalAttribLocation, //location
        3, //number of elements
        gl.FLOAT, //type of elements
        gl.TRUE, //is data normalized
        3 * Float32Array.BYTES_PER_ELEMENT, //size of vertex
        0 //offset from beginning of vertex to this data
    )
    gl.enableVertexAttribArray(normalAttribLocation)
    
    //Create texture
    var modelTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, modelTexture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(
        gl.TEXTURE_2D, 
        0, 
        gl.RGBA, 
        gl.RGBA, 
        gl.UNSIGNED_BYTE, 
        // document.getElementById('crate-image')
        modelImage
    )
    gl.bindTexture(gl.TEXTURE_2D, null)

    gl.useProgram(program)

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView')
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj')
    
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix)
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0])
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0)

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)

    //Lighting
    gl.useProgram(program)

    var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity')
    var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction')
    var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color')

    gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2)
    gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0)
    gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9)

    //Main render loop
    var identityMatrix = new Float32Array(16)
    var xRotationMatrix = new Float32Array(16)
    var yRotationMatrix = new Float32Array(16)
    var zRotationMatrix = new Float32Array(16)
    mat4.identity(identityMatrix)
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI
        mat4.rotate(xRotationMatrix, identityMatrix, -90, [1, 0, 0])
        mat4.rotate(yRotationMatrix, identityMatrix, 0, [0, 1, 0])
        mat4.rotate(zRotationMatrix, identityMatrix, angle, [0, 0, 1])
        mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix)
        mat4.mul(worldMatrix, worldMatrix, zRotationMatrix)
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

        gl.clearColor(0.85, 0.95, 0.1, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        gl.bindTexture(gl.TEXTURE_2D, modelTexture)
        gl.activeTexture(gl.TEXTURE0)
        
        gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0)
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}

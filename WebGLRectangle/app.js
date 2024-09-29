// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program
    const fsSource = `
        precision mediump float;
        uniform vec4 uFragmentColor;
        void main() {
            gl_FragColor = uFragmentColor;
        }
    `;

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get the attribute and uniform locations
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const fragmentColor = gl.getUniformLocation(shaderProgram, 'uFragmentColor');

    // Create a buffer for the rectangle's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer operations to from here out
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create an array of positions for the rectangle.
    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    // Pass the list of positions into WebGL to build the shape
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Function to draw the rectangle with a given color
    function drawScene(color) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use the shader program
        gl.useProgram(shaderProgram);

        // Pass the color to the fragment shader
        gl.uniform4fv(fragmentColor, color);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Default color (white)
    let currentColor = [1.0, 1.0, 1.0, 1.0];

    // Initial draw
    drawScene(currentColor);

    // Set up button event listeners
    document.getElementById('btn1').addEventListener('click', () => {
        currentColor = [1.0, 0.75, 0.8, 1.0]; // Pink
        drawScene(currentColor);
    });

    document.getElementById('btn2').addEventListener('click', () => {
        currentColor = [1.0, 1.0, 0.0, 1.0]; // Yellow
        drawScene(currentColor);
    });

    document.getElementById('btn3').addEventListener('click', () => {
        currentColor = [0.0, 0.0, 1.0, 1.0]; // Blue
        drawScene(currentColor);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        currentColor = [1.0, 1.0, 1.0, 1.0]; // Reset to white
        drawScene(currentColor);
    });
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

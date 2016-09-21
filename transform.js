let vertexShader = `
attribute vec4 a_Position;

uniform mat4 u_Transform;

void main(){
  gl_Position = u_Transform * a_Position;
}`;

var fragmentShader = `
precision mediump float;
void main(){
  gl_FragColor = vec4(0.3, 0.0, 0.8, 1.0);
}`;



window.onload = function(){
  var canvas = document.getElementById('canvas');
  var gl;
  // catch the error from creating the context since this has nothing to do with the code
  try{
    gl = middUtils.initializeGL(canvas);
  } catch (e){
    alert('Could not create WebGL context');
    return;
  }

  // don't catch this error since any problem here is a programmer error
  var program = middUtils.initializeProgram(gl, vertexShader, fragmentShader);

  var u_Transform = gl.getUniformLocation(program, "u_Transform");


  var transform = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  gl.uniformMatrix4fv(u_Transform, false, transform);


  // grab a reference to the position attribute
  var a_Position = gl.getAttribLocation(program, "a_Position");


  var data = new Float32Array([
    0.0, 0.2,
    0.1, -0.2,
    -0.1, -0.2
  ]);


  // load the data into a VBO
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0 , 0);
  gl.enableVertexAttribArray(a_Position);


  // set the background or clear color
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // clear the context for new content
  gl.clear(gl.COLOR_BUFFER_BIT);

  // tell the GPU to draw the point
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

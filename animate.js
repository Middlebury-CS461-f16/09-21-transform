let vertexShader = `
attribute vec4 a_Position;
uniform mat4 u_Transform;

void main(){
  gl_Position = u_Transform * a_Position;
}`;

var fragmentShader = `
precision mediump float;
uniform vec4 u_Color;
void main(){
  gl_FragColor = u_Color;
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

  var u_Color= gl.getUniformLocation(program, "u_Color");

  var u_Transform = gl.getUniformLocation(program, "u_Transform");


  var identity = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);



  // grab a reference to the position attribute
  var a_Position = gl.getAttribLocation(program, "a_Position");
  gl.enableVertexAttribArray(a_Position);

  // create triangle
  var data = new Float32Array([
    0.0, 0.2,
    0.1, -0.2,
    -0.1, -0.2
  ]);


  // load the triangle data into a VBO
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


  // create the axis
  var axisData = new Float32Array([
    0, 0,
    0, 1,
    0, 0,
    1, 0
  ]);

  // load the axis data into a VBO
  var axisBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axisData, gl.STATIC_DRAW);


  // setup the animation
  var angle = 0;
  var last;
  var tick = function(now){

    // compute the current rotation matrix
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var rotation = new Float32Array([
      c,s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

    var transform = rotation;

    // find the new angle based on the elapsed time
    if (now && last){
      var elapsed = now -last;
      angle += (Math.PI/2) * elapsed/1000;
      angle = angle > 2 * Math.PI ? angle - Math.PI *2 : angle;
    }
    last = now;

    // set the background or clear color
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // clear the context for new content
    gl.clear(gl.COLOR_BUFFER_BIT);

    // load the identity into the transform
    gl.uniformMatrix4fv(u_Transform, false, identity);

    // draw the axis
    gl.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0 , 0);
    gl.drawArrays(gl.LINES, 0, 4);

    // switch to rotation matrix
    gl.uniformMatrix4fv(u_Transform, false, transform);

    // draw the triangle
    gl.uniform4f(u_Color, 0.3, 0.0, 0.8, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0 , 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // request another frame
    requestAnimationFrame(tick);
  };
  tick();
};

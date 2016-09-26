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

  gl.uniformMatrix4fv(u_Transform, false, identity);

var translate = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0.25, 0.5, 0, 1
  ]);

  var scale = new Float32Array([
    2, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

var shear = new Float32Array([
    1, 1, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);



  // grab a reference to the position attribute
  var a_Position = gl.getAttribLocation(program, "a_Position");
  gl.enableVertexAttribArray(a_Position);

  var data = new Float32Array([
    0.0, 0.2,
    0.1, -0.2,
    -0.1, -0.2
  ]);


  // load the data into a VBO
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


  var axisData = new Float32Array([
    0, 0,
    0, 1,
    0, 0,
    1, 0
  ]);

  var axisBuffer = gl.createBuffer();

  var angle = 0;
  var last;
  var tick = function(now){
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var rotation = new Float32Array([
      c,s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

  var transform = rotation;

  if (now && last){
    var elapsed = now -last;
    angle += (Math.PI/2) * elapsed/1000;
    angle = angle > 2 * Math.PI ? angle - Math.PI *2 : angle;
  }
  last = now;



    gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axisData, gl.STATIC_DRAW);

gl.uniformMatrix4fv(u_Transform, false, identity);

    // set the background or clear color
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // clear the context for new content
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0 , 0);
    // tell the GPU to draw the axis
    gl.drawArrays(gl.LINES, 0, 4);

    gl.uniform4f(u_Color, 0.3, 0.0, 0.8, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0 , 0);
    gl.uniformMatrix4fv(u_Transform, false, transform);
    // tell the GPU to draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(tick);
  };
  tick();
};

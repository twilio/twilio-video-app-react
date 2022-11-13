/* ------------------------------------------------ *
 * The MIT License (MIT)
 * Copyright (c) 2020 terryky1220@gmail.com
 * ------------------------------------------------ */

const load_file_sync = function(url: string) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  return xhr;
};

/* ----------------------------------------------------------- *
 *   create & compile shader
 * ----------------------------------------------------------- */
const compile_shader_text = function(gl: WebGL2RenderingContext, shader_type: any, text: string) {
  const shader = gl.createShader(shader_type) as WebGLShader;
  gl.shaderSource(shader, text);

  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const compile_shader_file = function(gl: WebGL2RenderingContext, shader_type: any, fname: any) {
  const text = load_file_sync(fname).responseText;
  const shader = compile_shader_text(gl, shader_type, text);
  return shader;
};

/* ----------------------------------------------------------- *
 *    link shaders
 * ----------------------------------------------------------- */
const link_shaders = function(gl: WebGL2RenderingContext, vertShader: any, fragShader: any) {
  const program = gl.createProgram() as WebGLProgram;

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Could not initialise shaders');
  }
  return program;
};

export const generate_shader = function(gl: WebGL2RenderingContext, str_vs: any, str_fs: any) {
  const vs = compile_shader_text(gl, gl.VERTEX_SHADER, str_vs);
  const fs = compile_shader_text(gl, gl.FRAGMENT_SHADER, str_fs);
  const prog = link_shaders(gl, vs, fs);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  const sobj = {
    program: prog,
    loc_vtx: gl.getAttribLocation(prog, `a_Vertex`),
    loc_clr: gl.getAttribLocation(prog, `a_Color`),
    loc_nrm: gl.getAttribLocation(prog, `a_Normal`),
    loc_uv: gl.getAttribLocation(prog, `a_TexCoord`),
    loc_smp: gl.getUniformLocation(prog, `u_sampler`),
  };
  return sobj;
};

const compile_shader_text = function(gl: WebGL2RenderingContext, shader_type: number, text: string) {
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

const link_shaders = function(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader) {
  const program = gl.createProgram() as WebGLProgram;

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Could not initialise shaders');
  }
  return program;
};

export type ShaderObject = {
  program: WebGLProgram;
  loc_vtx: number;
  loc_clr: number;
  loc_nrm: number;
  loc_uv: number;
  loc_smp: WebGLUniformLocation | null;
};

export const generate_shader = function(gl: WebGL2RenderingContext, str_vs: string, str_fs: string): ShaderObject {
  const vs = compile_shader_text(gl, gl.VERTEX_SHADER, str_vs);
  const fs = compile_shader_text(gl, gl.FRAGMENT_SHADER, str_fs);

  if (!vs || !fs) throw new Error('Failed to compile shaders for face masks effect.');
  const program = link_shaders(gl, vs, fs);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return {
    program,
    loc_vtx: gl.getAttribLocation(program, `a_Vertex`),
    loc_clr: gl.getAttribLocation(program, `a_Color`),
    loc_nrm: gl.getAttribLocation(program, `a_Normal`),
    loc_uv: gl.getAttribLocation(program, `a_TexCoord`),
    loc_smp: gl.getUniformLocation(program, `u_sampler`),
  };
};

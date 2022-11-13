import { matrix_identity, matrix_mult, matrix_rotate, matrix_scale, matrix_translate, RAD_TO_DEG } from './matrix';
import { generate_shader } from './shaders';

/* ------------------------------------------------ *
 * The MIT License (MIT)
 * Copyright (c) 2019 terryky1220@gmail.com
 * ------------------------------------------------ */
export const r2d: any = {};
r2d.tparam = {};

r2d.FLIP_V = 1;
r2d.FLIP_H = 2;

/* ------------------------------------------------------ *
 *  shader for FillColor
 * ------------------------------------------------------ */
r2d.vs_fill = `
    attribute    vec4    a_Vertex;
    uniform      mat4    u_PMVMatrix;
    void main (void)
    {
        gl_Position = u_PMVMatrix * a_Vertex;
    }
    `;

r2d.fs_fill = `
    precision mediump float;
    uniform      vec4    u_Color;

    void main (void)
    {
        gl_FragColor = u_Color;
    }
`;

/* ------------------------------------------------------ *
 *  shader for Texture
 * ------------------------------------------------------ */
r2d.vs_tex = `
    attribute    vec4    a_Vertex;
    attribute    vec2    a_TexCoord;
    varying      vec2    v_TexCoord;
    uniform      mat4    u_PMVMatrix;

    void main (void)
    {
        gl_Position = u_PMVMatrix * a_Vertex;
        v_TexCoord  = a_TexCoord;
    }
`;

r2d.fs_tex = `
    precision mediump float;
    varying     vec2      v_TexCoord;
    uniform     sampler2D u_sampler;
    uniform     vec4      u_Color;

    void main (void)
    {
        gl_FragColor = texture2D (u_sampler, v_TexCoord);
        gl_FragColor *= u_Color;
    }
`;

const SHADER_NUM = 2;
r2d.shaders = [r2d.vs_fill, r2d.fs_fill, r2d.vs_tex, r2d.fs_tex];

var varray = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0];

var tarray0 = [
  0.0,
  0.0, //  0 +-----+ 2
  0.0,
  1.0, //    |     |
  1.0,
  0.0, //    |     |
  1.0,
  1.0,
]; //  1 +-----+ 3

var tarray1 = [
  0.0,
  1.0, //  1 +-----+ 3     Vertical Flip
  0.0,
  0.0, //    |     |
  1.0,
  1.0, //    |     |
  1.0,
  0.0,
]; //  0 +-----+ 2

var tarray2 = [
  1.0,
  0.0, //  2 +-----+ 0     Horizontal Flip
  1.0,
  1.0, //    |     |
  0.0,
  0.0, //    |     |
  0.0,
  1.0,
]; //  3 +-----+ 1

var tarray3 = [
  1.0,
  1.0, //  3 +-----+ 1     Vertical & Horizontal Flip
  1.0,
  0.0, //    |     |
  0.0,
  1.0, //    |     |
  0.0,
  0.0,
]; //  2 +-----+ 0

var s_matprj = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, 1.0, 0.0, 1.0];

r2d.set_projection_matrix = function(w: any, h: any) {
  s_matprj[0] = 2.0 / w;
  s_matprj[5] = -2.0 / h;
};

r2d.init_2d_render = function(gl: any, w: any, h: any) {
  r2d.sobj = new Array(SHADER_NUM);
  r2d.loc_mtx = new Array(SHADER_NUM);
  r2d.loc_color = new Array(SHADER_NUM);

  for (let i = 0; i < SHADER_NUM; i++) {
    let sobj = generate_shader(gl, r2d.shaders[2 * i], r2d.shaders[2 * i + 1]);
    r2d.loc_mtx[i] = gl.getUniformLocation(sobj.program, 'u_PMVMatrix');
    r2d.loc_color[i] = gl.getUniformLocation(sobj.program, 'u_Color');
    r2d.sobj[i] = sobj;
  }
  r2d.set_projection_matrix(w, h);

  r2d.vbo_vtx = gl.createBuffer();
  r2d.vbo_uv = gl.createBuffer();
};

r2d.resize_viewport = function(gl: any, w: any, h: any) {
  r2d.set_projection_matrix(w, h);
};

r2d.draw_2d_texture_in = function(gl: any) {
  let ttype = r2d.tparam.textype;
  let texid = r2d.tparam.texid;
  let x = r2d.tparam.x;
  let y = r2d.tparam.y;
  let w = r2d.tparam.w;
  let h = r2d.tparam.h;
  let rot = r2d.tparam.rot;
  let sobj = r2d.sobj[ttype];
  let matrix = new Array(16);
  let uv = tarray0;

  gl.useProgram(sobj.program);
  gl.uniform1i(sobj.loc_smp, 0);

  switch (ttype) {
    case 0 /* fill     */:
      break;
    case 1 /* tex      */:
      gl.bindTexture(gl.TEXTURE_2D, texid);
      switch (r2d.tparam.upsidedown) {
        case r2d.FLIP_V:
          uv = tarray1;
          break;
        case r2d.FLIP_H:
          uv = tarray2;
          break;
        case r2d.FLIP_V | r2d.FLIP_H:
          uv = tarray3;
          break;
        default:
          uv = tarray0;
          break;
      }
      break;
    default:
      break;
  }

  if (r2d.tparam.user_texcoord) {
    uv = r2d.tparam.user_texcoord;
  }

  if (sobj.loc_uv >= 0) {
    gl.enableVertexAttribArray(sobj.loc_uv);
    gl.bindBuffer(gl.ARRAY_BUFFER, r2d.vbo_uv);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.vertexAttribPointer(sobj.loc_uv, 2, gl.FLOAT, false, 0, 0);
  }

  gl.enable(gl.BLEND);

  if (r2d.tparam.blendfunc_en) {
    gl.blendFuncSeparate(
      r2d.tparam.blendfunc[0],
      r2d.tparam.blendfunc[1],
      r2d.tparam.blendfunc[2],
      r2d.tparam.blendfunc[3]
    );
  } else {
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  matrix_identity(matrix);
  matrix_translate(matrix, x, y, 0.0);
  if (rot != 0) {
    let px = r2d.tparam.px;
    let py = r2d.tparam.py;
    matrix_translate(matrix, px, py, 0.0);
    matrix_rotate(matrix, rot, 0.0, 0.0, 1.0);
    matrix_translate(matrix, -px, -py, 0.0);
  }
  matrix_scale(matrix, w, h, 1.0);
  matrix_mult(matrix, s_matprj, matrix);

  gl.uniformMatrix4fv(r2d.loc_mtx[ttype], false, matrix);
  gl.uniform4fv(r2d.loc_color[ttype], r2d.tparam.color);

  gl.enableVertexAttribArray(sobj.loc_vtx);
  gl.bindBuffer(gl.ARRAY_BUFFER, r2d.vbo_vtx);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(varray), gl.STATIC_DRAW);
  gl.vertexAttribPointer(sobj.loc_vtx, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.disable(gl.BLEND);
};

r2d.init_tparam = function(tparam: any) {
  tparam.textype = 0;
  tparam.rot = 0;
  tparam.upsidedown = 0;
  tparam.rot = 0;
  tparam.px = 0;
  tparam.py = 0;
  tparam.blendfunc_en = 0;
  tparam.user_texcoord = 0;
};

r2d.draw_2d_texture = function(gl: any, texid: any, x: any, y: any, w: any, h: any, upsidedown: any) {
  r2d.tparam = {};
  r2d.init_tparam(r2d.tparam);

  r2d.tparam.x = x;
  r2d.tparam.y = y;
  r2d.tparam.w = w;
  r2d.tparam.h = h;
  r2d.tparam.texid = texid;
  r2d.tparam.textype = 1;
  r2d.tparam.color = [1.0, 1.0, 1.0, 1.0];
  r2d.tparam.upsidedown = upsidedown;
  r2d.draw_2d_texture_in(gl);
};

r2d.draw_2d_texture_texcoord_rot = function(
  gl: any,
  texid: any,
  x: any,
  y: any,
  w: any,
  h: any,
  user_texcoord: any,
  px: any,
  py: any,
  rot_degree: any
) {
  r2d.tparam = {};
  r2d.init_tparam(r2d.tparam);

  r2d.tparam.x = x;
  r2d.tparam.y = y;
  r2d.tparam.w = w;
  r2d.tparam.h = h;
  r2d.tparam.texid = texid;
  r2d.tparam.textype = 1;
  r2d.tparam.rot = rot_degree;
  r2d.tparam.px = px * w; /* relative pivot position (0 <= px <= 1) */
  r2d.tparam.py = py * h; /* relative pivot position (0 <= py <= 1) */
  r2d.tparam.color = [1.0, 1.0, 1.0, 1.0];
  r2d.tparam.upsidedown = 0;
  r2d.tparam.user_texcoord = user_texcoord;
  r2d.draw_2d_texture_in(gl);
};

r2d.draw_2d_fillrect = function(gl: any, x: any, y: any, w: any, h: any, color: any) {
  r2d.tparam = {};
  r2d.init_tparam(r2d.tparam);

  r2d.tparam.x = x;
  r2d.tparam.y = y;
  r2d.tparam.w = w;
  r2d.tparam.h = h;
  r2d.tparam.textype = 0;
  r2d.tparam.color = color;
  r2d.draw_2d_texture_in(gl);
};

r2d.draw_2d_rect = function(gl: any, x: any, y: any, w: any, h: any, color: any, line_width: any) {
  r2d.draw_2d_rect_rot(gl, x, y, w, h, color, line_width, 0, 0, 0);
};

r2d.draw_2d_rect_rot = function(
  gl: any,
  x: any,
  y: any,
  w: any,
  h: any,
  color: any,
  line_width: any,
  px: any,
  py: any,
  rot_degree: any
) {
  const ttype = 0;
  let sobj = r2d.sobj[ttype];
  let matrix = new Array(16);

  gl.useProgram(sobj.program);
  gl.uniform4fv(r2d.loc_color[ttype], color);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  matrix_identity(matrix);
  if (rot_degree != 0) {
    let tx = x + px * w;
    let ty = y + py * h;
    matrix_translate(matrix, tx, ty, 0);
    matrix_rotate(matrix, rot_degree, 0.0, 0.0, 1.0);
    matrix_translate(matrix, -tx, -ty, 0);
  }

  matrix_mult(matrix, s_matprj, matrix);
  gl.uniformMatrix4fv(r2d.loc_mtx[ttype], false, matrix);

  gl.lineWidth(line_width);
  let x1 = x;
  let x2 = x + w;
  let y1 = y;
  let y2 = y + h;

  let vtx = [x1, y1, x2, y1, x2, y2, x1, y2, x1, y1];

  gl.enableVertexAttribArray(sobj.loc_vtx);
  gl.bindBuffer(gl.ARRAY_BUFFER, r2d.vbo_vtx);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
  gl.vertexAttribPointer(sobj.loc_vtx, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.LINE_STRIP, 0, 5);

  gl.disable(gl.BLEND);
  gl.lineWidth(1.0);
};

r2d.draw_2d_line = function(gl: any, x0: any, y0: any, x1: any, y1: any, color: any, line_width: any) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let len = Math.sqrt(dx * dx + dy * dy);
  let theta = Math.acos(dx / len);

  if (dy < 0) theta = -theta;

  r2d.tparam = {};
  r2d.init_tparam(r2d.tparam);

  r2d.tparam.x = x0;
  r2d.tparam.y = y0 - 0.5 * line_width;
  r2d.tparam.w = len;
  r2d.tparam.h = line_width;
  r2d.tparam.rot = RAD_TO_DEG(theta);
  r2d.tparam.px = 0;
  r2d.tparam.py = 0.5 * line_width;
  r2d.tparam.textype = 0;
  r2d.tparam.color = color;
  r2d.draw_2d_texture_in(gl);
};

const CIRCLE_DIVNUM = 20;

r2d.draw_2d_fillcircle = function(gl: any, x: any, y: any, radius: any, color: any) {
  const ttype = 0;
  let sobj = r2d.sobj[ttype];
  let matrix = new Array(16);
  let vtx = new Array((CIRCLE_DIVNUM + 2) * 2);

  gl.useProgram(sobj.program);
  gl.uniform4fv(r2d.loc_color[ttype], color);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  matrix_identity(matrix);
  matrix_mult(matrix, s_matprj, matrix);
  gl.uniformMatrix4fv(r2d.loc_mtx[ttype], false, matrix);

  vtx[0] = x;
  vtx[1] = y;
  for (let i = 0; i <= CIRCLE_DIVNUM; i++) {
    let delta = (2 * Math.PI) / CIRCLE_DIVNUM;
    let theta = delta * i;

    vtx[(i + 1) * 2 + 0] = radius * Math.cos(theta) + x;
    vtx[(i + 1) * 2 + 1] = radius * Math.sin(theta) + y;
  }

  gl.enableVertexAttribArray(sobj.loc_vtx);
  gl.bindBuffer(gl.ARRAY_BUFFER, r2d.vbo_vtx);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
  gl.vertexAttribPointer(sobj.loc_vtx, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, CIRCLE_DIVNUM + 2);

  gl.disable(gl.BLEND);
};

r2d.draw_2d_circle = function(gl: any, x: any, y: any, radius: any, color: any, line_width: any) {
  const ttype = 0;
  let sobj = r2d.sobj[ttype];
  let matrix = new Array(16);
  let vtx = new Array((CIRCLE_DIVNUM + 2) * 2);

  gl.useProgram(sobj.program);
  gl.uniform4fv(r2d.loc_color[ttype], color);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  matrix_identity(matrix);
  matrix_mult(matrix, s_matprj, matrix);
  gl.uniformMatrix4fv(r2d.loc_mtx[ttype], false, matrix);

  gl.lineWidth(line_width);

  for (let i = 0; i <= CIRCLE_DIVNUM; i++) {
    let delta = (2 * Math.PI) / CIRCLE_DIVNUM;
    let theta = delta * i;

    vtx[i * 2 + 0] = radius * Math.cos(theta) + x;
    vtx[i * 2 + 1] = radius * Math.sin(theta) + y;
  }

  gl.enableVertexAttribArray(sobj.loc_vtx);
  gl.bindBuffer(gl.ARRAY_BUFFER, r2d.vbo_vtx);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
  gl.vertexAttribPointer(sobj.loc_vtx, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.LINE_STRIP, 0, CIRCLE_DIVNUM + 1);

  gl.lineWidth(1);
  gl.disable(gl.BLEND);
};

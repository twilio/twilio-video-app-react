/* ------------------------------------------------ *
 * Inspired by: https://github.com/terryky/tfjs_webgl_app/tree/master/face_landmark
 * ------------------------------------------------ */

import { matrix_identity, matrix_mult } from './matrix';
import { generate_shader } from './shaders';
import s_face_tris from '../data/s-face-tris.json';
import s_face_wo_eyes_tris from '../data/s-face-wo-eyes-tris.json';
import face_countour_idx from '../data/face-contour-idx.json';
import { strVS, strFS } from '../shaders';

export class Facemesh {
  private gl: WebGL2RenderingContext;

  // Shaders
  private strVS: string;
  private strFS: string;

  // Vertices
  private s_face_tris: number[];
  private s_face_wo_eyes_tris: number[];

  private program: WebGLProgram;
  private loc_vtx: number;
  private loc_clr: number;
  private loc_nrm: number;
  private loc_uv: number;
  private loc_smp: WebGLUniformLocation | null;
  private loc_vtxalpha: number;
  private loc_mtx_pmv: WebGLUniformLocation | null;
  private loc_color: WebGLUniformLocation | null;
  private loc_alpha: WebGLUniformLocation | null;
  private matPrj: number[];
  private vbo_vtx: WebGLBuffer | null;
  private vbo_uv: WebGLBuffer | null;
  private vbo_idx: WebGLBuffer | null;
  private vbo_idx2: WebGLBuffer | null;
  private vbo_alpha: WebGLBuffer | null;
  private vbo_alpha2: WebGLBuffer | null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this.strVS = strVS;
    this.strFS = strFS;

    /*
     *  Vertex indices are from:
     *      https://github.com/tensorflow/tfjs-models/blob/master/facemesh/src/keypoints.ts
     */

    this.s_face_tris = s_face_tris;
    this.s_face_wo_eyes_tris = s_face_wo_eyes_tris;

    const { program, loc_vtx, loc_clr, loc_nrm, loc_uv, loc_smp } = generate_shader(this.gl, this.strVS, this.strFS);
    this.program = program;
    this.loc_vtx = loc_vtx;
    this.loc_clr = loc_clr;
    this.loc_nrm = loc_nrm;
    this.loc_uv = loc_uv;
    this.loc_smp = loc_smp;

    this.loc_vtxalpha = this.gl.getAttribLocation(this.program, 'a_vtxalpha');
    this.loc_mtx_pmv = this.gl.getUniformLocation(this.program, 'u_PMVMatrix');
    this.loc_color = this.gl.getUniformLocation(this.program, 'u_color');
    this.loc_alpha = this.gl.getUniformLocation(this.program, 'u_alpha');

    this.matPrj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1];

    this.vbo_vtx = this.gl.createBuffer();
    this.vbo_uv = this.gl.createBuffer();

    this.vbo_idx = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_idx);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.s_face_tris), this.gl.STATIC_DRAW);

    this.vbo_idx2 = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_idx2);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.s_face_wo_eyes_tris), this.gl.STATIC_DRAW);

    this.vbo_alpha = this.create_vbo_alpha_array(this.s_face_tris);
    this.vbo_alpha2 = this.create_vbo_alpha_array(this.s_face_wo_eyes_tris);
  }

  create_vbo_alpha_array(tris: number[]): WebGLBuffer | null {
    let vtx_counts = tris.length;
    let alpha_array = new Array(vtx_counts);

    for (let i = 0; i < vtx_counts; i++) {
      let alpha = 1.0;
      for (let j = 0; j < face_countour_idx.length; j++) {
        if (i === face_countour_idx[j]) {
          alpha = 0.0;
          break;
        }
      }
      alpha_array[i] = alpha;
    }

    let vbo_alpha = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo_alpha);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(alpha_array), this.gl.STATIC_DRAW);

    return vbo_alpha;
  }

  resize_facemesh_render(w: number, h: number) {
    this.matPrj[0] = 2.0 / w;
    this.matPrj[5] = -2.0 / h;
  }

  draw_facemesh_tri_tex(texture: WebGLTexture, vtx: number[], uv: number[], color: number[], drill_eye_hole: boolean) {
    let matMV = new Array(16);
    let matPMV = new Array(16);

    this.gl.enable(this.gl.CULL_FACE);

    this.gl.useProgram(this.program);

    this.gl.enableVertexAttribArray(this.loc_vtx);
    this.gl.enableVertexAttribArray(this.loc_uv);
    this.gl.enableVertexAttribArray(this.loc_vtxalpha);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_vtx);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vtx), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.loc_vtx, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_uv);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.loc_uv, 2, this.gl.FLOAT, false, 0, 0);

    let vtx_counts;
    if (drill_eye_hole) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_idx2);
      vtx_counts = this.s_face_wo_eyes_tris.length;

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_alpha2);
      this.gl.vertexAttribPointer(this.loc_vtxalpha, 1, this.gl.FLOAT, false, 0, 0);
    } else {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_idx);
      vtx_counts = this.s_face_tris.length;

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_alpha);
      this.gl.vertexAttribPointer(this.loc_vtxalpha, 1, this.gl.FLOAT, false, 0, 0);
    }

    matrix_identity(matMV);
    matrix_mult(matPMV, this.matPrj, matMV);

    this.gl.uniformMatrix4fv(this.loc_mtx_pmv, false, matPMV);
    this.gl.uniform3f(this.loc_color, color[0], color[1], color[2]);
    this.gl.uniform1f(this.loc_alpha, color[3]);

    this.gl.enable(this.gl.BLEND);

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.drawElements(this.gl.TRIANGLES, vtx_counts, this.gl.UNSIGNED_SHORT, 0);

    this.gl.disable(this.gl.BLEND);
    this.gl.frontFace(this.gl.CCW);
  }
}

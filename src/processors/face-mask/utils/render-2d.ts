import { SHADER_NUM, varray, tarray0, tarray1, tarray2, tarray3 } from '../constants';
import { fs_fill, fs_tex, vs_fill, vs_tex } from '../shaders';
import { matrix_identity, matrix_mult, matrix_rotate, matrix_scale, matrix_translate } from './matrix';
import { generate_shader, ShaderObject } from './shaders';

type TextureParams = {
  type: number;
  texture: WebGLTexture | null;
  rot: number;
  upsidedown: number;
  px: number;
  py: number;
  blendfunc: number[];
  blendfunc_en: number;
  user_texcoord?: number[];
  x: number;
  y: number;
  w: number;
  h: number;
  color: number[];
};

export class Render2D {
  private gl: WebGL2RenderingContext;

  private _textureParams: TextureParams;

  private _FLIP_V: number;
  private _FLIP_H: number;
  private _shaders: string[];

  private _s_matprj: number[];

  private _sobj: ShaderObject[];
  private _loc_mtx: (WebGLUniformLocation | null)[];
  private _loc_color: (WebGLUniformLocation | null)[];

  private _vbo_vtx: WebGLBuffer | null;
  private _vbo_uv: WebGLBuffer | null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this._textureParams = {
      type: 0,
      rot: 0,
      upsidedown: 0,
      texture: null,
      px: 0,
      py: 0,
      blendfunc: [],
      blendfunc_en: 0,
      color: [0, 0, 0, 0],
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    this._FLIP_V = 1;
    this._FLIP_H = 2;

    this._s_matprj = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0, 1.0, 0.0, 1.0];
    this._shaders = [vs_fill, fs_fill, vs_tex, fs_tex];

    this._sobj = new Array(SHADER_NUM);
    this._loc_mtx = new Array(SHADER_NUM);
    this._loc_color = new Array(SHADER_NUM);

    for (let i = 0; i < SHADER_NUM; i++) {
      const _sobj = generate_shader(this.gl, this._shaders[2 * i], this._shaders[2 * i + 1]);
      this._loc_mtx[i] = this.gl.getUniformLocation(_sobj.program, 'u_PMVMatrix');
      this._loc_color[i] = this.gl.getUniformLocation(_sobj.program, 'u_Color');
      this._sobj[i] = _sobj;
    }

    this._vbo_vtx = this.gl.createBuffer();
    this._vbo_uv = this.gl.createBuffer();
  }

  set_projection_matrix(w: number, h: number) {
    this._s_matprj[0] = 2.0 / w;
    this._s_matprj[5] = -2.0 / h;
  }

  resize_viewport(w: number, h: number) {
    this.set_projection_matrix(w, h);
  }

  draw_2d_texture_in() {
    const ttype = this._textureParams.type;
    const texture = this._textureParams.texture;
    const x = this._textureParams.x;
    const y = this._textureParams.y;
    const w = this._textureParams.w;
    const h = this._textureParams.h;
    const rot = this._textureParams.rot;
    const _sobj = this._sobj[ttype];
    const matrix = new Array(16);
    let uv: number[] = tarray0;

    this.gl.useProgram(_sobj.program);
    this.gl.uniform1i(_sobj.loc_smp, 0);

    switch (ttype) {
      case 0 /* fill     */:
        break;
      case 1 /* tex      */:
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        switch (this._textureParams.upsidedown) {
          case this._FLIP_V:
            uv = tarray1;
            break;
          case this._FLIP_H:
            uv = tarray2;
            break;
          case this._FLIP_V | this._FLIP_H:
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

    if (this._textureParams.user_texcoord) {
      uv = this._textureParams.user_texcoord;
    }

    if (_sobj.loc_uv >= 0) {
      this.gl.enableVertexAttribArray(_sobj.loc_uv);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo_uv);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(_sobj.loc_uv, 2, this.gl.FLOAT, false, 0, 0);
    }

    this.gl.enable(this.gl.BLEND);

    if (this._textureParams.blendfunc_en) {
      this.gl.blendFuncSeparate(
        this._textureParams.blendfunc[0],
        this._textureParams.blendfunc[1],
        this._textureParams.blendfunc[2],
        this._textureParams.blendfunc[3]
      );
    } else {
      this.gl.blendFuncSeparate(
        this.gl.SRC_ALPHA,
        this.gl.ONE_MINUS_SRC_ALPHA,
        this.gl.ONE,
        this.gl.ONE_MINUS_SRC_ALPHA
      );
    }

    matrix_identity(matrix);
    matrix_translate(matrix, x, y, 0.0);
    if (rot !== 0) {
      let px = this._textureParams.px;
      let py = this._textureParams.py;
      matrix_translate(matrix, px, py, 0.0);
      matrix_rotate(matrix, rot, 0.0, 0.0, 1.0);
      matrix_translate(matrix, -px, -py, 0.0);
    }
    matrix_scale(matrix, w, h, 1.0);
    matrix_mult(matrix, this._s_matprj, matrix);

    this.gl.uniformMatrix4fv(this._loc_mtx[ttype], false, matrix);
    this.gl.uniform4fv(this._loc_color[ttype], this._textureParams.color);

    this.gl.enableVertexAttribArray(_sobj.loc_vtx);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo_vtx);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(varray), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(_sobj.loc_vtx, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    this.gl.disable(this.gl.BLEND);
  }

  draw_2d_texture(texture: WebGLTexture, x: number, y: number, w: number, h: number, upsidedown: any) {
    this._textureParams.x = x;
    this._textureParams.y = y;
    this._textureParams.w = w;
    this._textureParams.h = h;
    this._textureParams.texture = texture;
    this._textureParams.type = 1;
    this._textureParams.color = [1.0, 1.0, 1.0, 1.0];
    this._textureParams.upsidedown = upsidedown;

    this.draw_2d_texture_in();
  }
}

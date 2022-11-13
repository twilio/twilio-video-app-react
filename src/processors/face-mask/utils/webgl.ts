/* ------------------------------------------------ *
 * The MIT License (MIT)
 * Copyright (c) 2020 terryky1220@gmail.com
 * ------------------------------------------------ */
//tf.setBackend('wasm').then(() => startWebGL());

import { draw_facemesh_tri_tex, resize_facemesh_render } from './facemesh';
import { r2d } from './render-2d';

let s_debug_log;
let s_is_dragover = false;

class GuiProperty {
  public srcimg_scale: number;
  public mask_alpha: number;
  public flip_horizontal: boolean;
  public mask_eye_hole: boolean;
  public draw_pmeter: boolean;

  constructor() {
    this.srcimg_scale = 1.0;
    this.mask_alpha = 0.7;
    this.flip_horizontal = true;
    this.mask_eye_hole = false;
    this.draw_pmeter = false;
  }
}
const s_gui_prop = new GuiProperty();

let s_srctex_region: any;
let s_masktex_region: any;

/* Adjust the texture size to fit the window size
 *
 *                      Portrait
 *     Landscape        +------+
 *     +-+------+-+     +------+
 *     | |      | |     |      |
 *     | |      | |     |      |
 *     +-+------+-+     +------+
 *                      +------+
 */
export function calc_size_to_fit(gl: any, src_w: any, src_h: any, win_w: any, win_h: any) {
  let win_aspect = win_w / win_h;
  let tex_aspect = src_w / src_h;
  let scale;
  let scaled_w, scaled_h;
  let offset_x, offset_y;

  if (win_aspect > tex_aspect) {
    scale = win_h / src_h;
    scaled_w = scale * src_w;
    scaled_h = scale * src_h;
    offset_x = (win_w - scaled_w) * 0.5;
    offset_y = 0;
  } else {
    scale = win_w / src_w;
    scaled_w = scale * src_w;
    scaled_h = scale * src_h;
    offset_x = 0;
    offset_y = (win_h - scaled_h) * 0.5;
  }

  let region = {
    width: win_w /* full rect width  with margin */,
    height: win_h /* full rect height with margin */,
    tex_x: offset_x /* start position of valid texture */,
    tex_y: offset_y /* start position of valid texture */,
    tex_w: scaled_w /* width  of valid texture */,
    tex_h: scaled_h /* height of valid texture */,
    scale: scale,
  };
  return region;
}

export function render_2d_scene(
  gl: any,
  texid: any,
  face_predictions: any,
  tex_w: any,
  tex_h: any,
  masktex: any,
  mask_predictions: any
) {
  let color = [0.0, 1.0, 1.0, 0.5];
  let radius = 5;
  let tx = s_srctex_region.tex_x;
  let ty = s_srctex_region.tex_y;
  let tw = s_srctex_region.tex_w;
  let th = s_srctex_region.tex_h;
  let scale = s_srctex_region.scale;
  let flip_h = s_gui_prop.flip_horizontal;

  gl.disable(gl.DEPTH_TEST);

  let flip = flip_h ? r2d.FLIP_H : 0;
  r2d.draw_2d_texture(gl, texid, tx, ty, tw, th, flip);

  let mask_color = [1.0, 1.0, 1.0, s_gui_prop.mask_alpha];
  if (s_is_dragover) mask_color = [0.8, 0.8, 0.8, 1.0];

  for (let i = 0; i < face_predictions.length; i++) {
    const keypoints = face_predictions[i].scaledMesh;

    /* render the deformed mask image onto the camera image */
    if (mask_predictions.length > 0) {
      const mask_keypoints = mask_predictions[0].scaledMesh;

      let face_vtx = new Array(keypoints.length * 3);
      let face_uv = new Array(keypoints.length * 2);
      for (let i = 0; i < keypoints.length; i++) {
        let p = keypoints[i];
        face_vtx[3 * i + 0] = p[0] * scale + tx;
        face_vtx[3 * i + 1] = p[1] * scale + ty;
        face_vtx[3 * i + 2] = p[2];

        let q = mask_keypoints[i];
        face_uv[2 * i + 0] = q[0] / masktex.image.width;
        face_uv[2 * i + 1] = q[1] / masktex.image.height;

        if (flip_h) {
          face_vtx[3 * i + 0] = (tex_w - p[0]) * scale + tx;
        }
      }

      let eye_hole = s_gui_prop.mask_eye_hole;
      draw_facemesh_tri_tex(gl, masktex.texid, face_vtx, face_uv, mask_color, eye_hole, flip_h);
    }
  }

  /* render 2D mask image */
  if (mask_predictions.length > 0) {
    let texid = masktex.texid;
    let tx = 5;
    let ty = 5;
    let tw = s_masktex_region.tex_w * s_gui_prop.srcimg_scale;
    let th = s_masktex_region.tex_h * s_gui_prop.srcimg_scale;
    let radius = 2;
    r2d.draw_2d_texture(gl, texid, tx, ty, tw, th, 0);
    r2d.draw_2d_rect(gl, tx, ty, tw, th, [1.0, 1.0, 1.0, 1.0], 3.0);

    const mask_keypoints = mask_predictions[0].scaledMesh;
    for (let i = 0; i < mask_keypoints.length; i++) {
      let p = mask_keypoints[i];
      const x = (p[0] / masktex.image.width) * tw + tx;
      const y = (p[1] / masktex.image.height) * th + ty;
      r2d.draw_2d_fillrect(gl, x - radius / 2, y - radius / 2, radius, radius, color);
    }
  }
}

function on_resize(gl: any) {
  let w = gl.canvas.width;
  let h = gl.canvas.height;

  gl.viewport(0, 0, w, h);
  r2d.resize_viewport(gl, w, h);
  resize_facemesh_render(gl, w, h);
}

function check_resize_canvas(gl: any, canvas: any) {
  let display_w = canvas.clientWidth;
  let display_h = canvas.clientHeight;

  if (canvas.width != display_w || canvas.height != display_h) {
    canvas.width = display_w;
    canvas.height = display_h;
    on_resize(gl);
  }
}

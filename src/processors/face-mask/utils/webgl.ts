/* ------------------------------------------------ *
 * Inspired by: https://github.com/terryky/tfjs_webgl_app/tree/master/face_landmark
 * ------------------------------------------------ */

import { Face, Keypoint } from '@tensorflow-models/face-landmarks-detection';
import { Facemesh } from './Facemesh';
import { Render2D } from './Render2D';

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

export type Region = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  scaledW: number;
  scaledH: number;
  scale: number;
};

export function calcSizeToFit(srcW: number, srcH: number, winW: number, winH: number): Region {
  const winAspect = winW / winH;
  const texAspect = srcW / srcH;
  let scale;
  let scaledW, scaledH;
  let offsetX, offsetY;

  if (winAspect > texAspect) {
    scale = winH / srcH;
    scaledW = scale * srcW;
    scaledH = scale * srcH;
    offsetX = (winW - scaledW) * 0.5;
    offsetY = 0;
  } else {
    scale = winW / srcW;
    scaledW = scale * srcW;
    scaledH = scale * srcH;
    offsetX = 0;
    offsetY = (winH - scaledH) * 0.5;
  }

  return {
    width: winW /* full rect width  with margin */,
    height: winH /* full rect height with margin */,
    offsetX /* start position of valid texture */,
    offsetY /* start position of valid texture */,
    scaledW /* width  of valid texture */,
    scaledH /* height of valid texture */,
    scale,
  };
}

export function render2dScene(
  gl: WebGL2RenderingContext,
  camTex: WebGLTexture,
  facePredictions: Face[],
  camWidth: number,
  camHeight: number,
  maskImage: HTMLImageElement,
  maskTex: WebGLTexture,
  maskPredictions: Face[],
  camRegion: Region,
  facemesh: Facemesh,
  r2d: Render2D
) {
  const tx = camRegion.offsetX;
  const ty = camRegion.offsetY;
  const tw = camRegion.scaledW;
  const th = camRegion.scaledH;
  const scale = camRegion.scale;

  gl.disable(gl.DEPTH_TEST);

  // Render the camera texture
  r2d.draw_2d_texture(camTex, tx, ty, tw, th, 0);

  for (let i = 0; i < facePredictions.length; i++) {
    const faceKeypoints: number[][] = facePredictions[i].keypoints.map(
      ({ x, y, z }: Keypoint) => [x, y, z] as number[]
    );

    /* render the deformed mask image onto the camera image */
    if (maskPredictions.length > 0) {
      const maskKeypoints: number[][] = maskPredictions[0].keypoints.map(
        ({ x, y, z }: Keypoint) => [x, y, z] as number[]
      );

      let faceVtx = new Array(faceKeypoints.length * 3);
      let faceUv = new Array(faceKeypoints.length * 2);
      for (let j = 0; j < faceKeypoints.length; j++) {
        let p = faceKeypoints[j];
        faceVtx[3 * j + 0] = p[0] * scale + tx;
        faceVtx[3 * j + 1] = p[1] * scale + ty;
        faceVtx[3 * j + 2] = p[2];

        let q = maskKeypoints[j];
        faceUv[2 * j + 0] = q[0] / maskImage.width;
        faceUv[2 * j + 1] = q[1] / maskImage.height;
      }

      const eyeHole = true;
      const maskColor = [1.0, 1.0, 1.0, 0.7];
      facemesh.draw_facemesh_tri_tex(maskTex, faceVtx, faceUv, maskColor, eyeHole);
    }
  }
}

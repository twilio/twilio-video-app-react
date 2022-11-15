/* ------------------------------------------------ *
 * Inspired by: https://github.com/terryky/tfjs_webgl_app/tree/master/face_landmark
 * ------------------------------------------------ */

const createTexture = function(gl: WebGL2RenderingContext) {
  let texid = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texid);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texid;
};

export const createTextureFromImage = function(gl: WebGL2RenderingContext, image: HTMLImageElement) {
  const texture = createTexture(gl);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
};

export const createTextureFromImageBitmap = function(gl: WebGL2RenderingContext, image: ImageBitmap) {
  const texture = createTexture(gl);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
};

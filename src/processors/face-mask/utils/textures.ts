export const create_texture = function(gl: WebGL2RenderingContext) {
  let texid = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texid);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texid;
};

export const create_image_texture2 = function(gl: WebGL2RenderingContext, teximage: HTMLImageElement) {
  let image_tex: any = {};
  image_tex.ready = false;
  let texid = create_texture(gl);

  teximage.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texid);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximage);
    gl.generateMipmap(gl.TEXTURE_2D);
    image_tex.ready = true;
  };

  image_tex.texid = texid;
  image_tex.image = teximage;
  return image_tex;
};

export const create_image_texture_from_file = function(gl: WebGL2RenderingContext, blob: Blob) {
  let image_tex: any = {};
  image_tex.ready = false;
  let texid = create_texture(gl);
  let teximage = new Image();
  let reader = new FileReader();

  teximage.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texid);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximage);
    gl.generateMipmap(gl.TEXTURE_2D);
    image_tex.ready = true;
  };

  reader.onload = function(event) {
    let src = event.target?.result;
    teximage.src = src as string;
  };
  reader.readAsDataURL(blob);

  image_tex.texid = texid;
  image_tex.image = teximage;
  return image_tex;
};

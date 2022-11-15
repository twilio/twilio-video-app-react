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

export const createTextureFromBlob = async function(gl: WebGL2RenderingContext, blob: Blob) {
  const texture = createTexture(gl);
  const image = new Image();
  const reader = new FileReader();

  reader.readAsDataURL(blob);

  await new Promise((resolve: any) => {
    reader.onload = function(event) {
      let src = event.target?.result;
      image.src = src as string;

      resolve();
    };
  });

  await new Promise((resolve: any) => {
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      resolve();
    };
  });

  return texture;
};

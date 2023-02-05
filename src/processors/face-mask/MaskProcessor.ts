import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-webgl';

import {
  createDetector,
  SupportedModels,
  Face,
  FaceLandmarksDetector,
} from '@tensorflow-models/face-landmarks-detection';

import { createTextureFromImage, createTextureFromImageBitmap } from './utils/textures';
import { Facemesh } from './utils/Facemesh';
import { calcSizeToFit, Region, render2dScene } from './utils/webgl';
import { Render2D } from './utils/Render2D';

// Initialize Tf.js
tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);

/**
 * Options passed to [[MaskProcessor]] constructor.
 */
export interface MaskProcessorOptions {
  /**
   * The HTMLImageElement to use for the face mask.
   * An error will be raised if the image hasn't been fully loaded yet. Additionally, the image must follow
   * [security guidelines](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
   * when loading the image from a different origin. Failing to do so will result to an empty output frame.
   */
  maskImage: HTMLImageElement;
}

/**
 * The MaskProcessor, when added to a VideoTrack,
 * place a mask in each video frame on top of the person's face,
 * Each instance of MaskProcessor should be added to only one VideoTrack
 * at a time to prevent overlapping of image data from multiple VideoTracks.
 *
 * @example
 *
 * ```ts
 * import { createLocalVideoTrack } from 'twilio-video';
 *
 * let faceMask;
 * const img = new Image();
 *
 * img.onload = () => {
 *   faceMask = new MaskProcessor({
 *     maskImage: img,
 *   });
 *
 *   faceMask.createDetector().then(() => {
 *     createLocalVideoTrack({
 *       camWidth: 640,
 *       camHeight: 480,
 *       frameRate: 24
 *     }).then(track => {
 *       track.addProcessor(faceMask);
 *     });
 *   });
 * };
 * img.src = '/face-mask.jpg';
 * ```
 */
export class MaskProcessor {
  private _maskImage!: HTMLImageElement;
  // tslint:disable-next-line no-unused-variable
  private readonly _name: string = 'MaskProcessor';

  private static _model: FaceLandmarksDetector | null = null;

  private _maskTex: WebGLTexture | null;
  private _isMaskUpdated: boolean;
  private _maskPredictions: Face[];
  private _facePredictions: Face[];

  private _camRegion: Region | null;

  private _outputCanvas: HTMLCanvasElement;
  private _outputContext: WebGL2RenderingContext;

  private _facemesh: Facemesh;
  private _r2d: Render2D;

  /**
   * Construct a MaskProcessor. Default values will be used for
   * any missing optional properties in [[MaskProcessorOptions]],
   * and invalid properties will be ignored.
   */
  constructor(options: MaskProcessorOptions) {
    this.maskImage = options.maskImage;

    this._maskTex = null;
    this._isMaskUpdated = false;
    this._maskPredictions = [];
    this._facePredictions = [];

    this._camRegion = null;

    this._outputCanvas = document.createElement('canvas');
    this._outputContext = this._outputCanvas.getContext('webgl') as WebGL2RenderingContext;

    this._facemesh = new Facemesh(this._outputContext);
    this._r2d = new Render2D(this._outputContext);
  }

  /**
   * The HTMLImageElement representing the current face mask image.
   */
  get maskImage(): HTMLImageElement {
    return this._maskImage;
  }

  /**
   * Set an HTMLImageElement as the new face mask image.
   * An error will be raised if the image hasn't been fully loaded yet. Additionally, the image must follow
   * [security guidelines](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
   * when loading the image from a different origin. Failing to do so will result to an empty output frame.
   */
  set maskImage(image: HTMLImageElement) {
    if (!image || !image.complete || !image.naturalHeight) {
      throw new Error(
        'Invalid image. Make sure that the image is an HTMLImageElement and has been successfully loaded'
      );
    }
    this._maskImage = image;
    this._isMaskUpdated = false;
  }

  /**
   * Load the segmentation model.
   * Call this method before attaching the processor to ensure
   * video frames are processed correctly.
   */
  async loadModel() {
    try {
      MaskProcessor._model = await createDetector(SupportedModels.MediaPipeFaceMesh, {
        runtime: 'tfjs',
        refineLandmarks: true,
      });

      console.log('Loaded face landmarks model successfully.');
    } catch (error) {
      console.error('Unable to load face landmarks model.', error);
    }
  }

  async processFrame(inputFrameBuffer: OffscreenCanvas, outputFrameBuffer: HTMLCanvasElement): Promise<void> {
    // The WebGL Canvas Context
    const gl = this._outputContext;

    // Configure viewport dimensions
    const camWidth = inputFrameBuffer.width;
    const camHeight = inputFrameBuffer.height;

    this._outputCanvas.width = camWidth;
    this._outputCanvas.height = camHeight;

    // Handle viewport resizing
    this._facemesh.resize_facemesh_render(camWidth, camHeight);
    this._r2d.resize_viewport(camWidth, camHeight);
    gl.viewport(0, 0, camWidth, camHeight);

    // Get image bitmap from input frame
    const inputImageBitmap = inputFrameBuffer.transferToImageBitmap();

    // Update mask if needed
    if (!this._isMaskUpdated && MaskProcessor._model) {
      this._maskTex = createTextureFromImage(gl, this._maskImage);
      for (let i = 0; i < 2; i++) this._maskPredictions = await MaskProcessor._model?.estimateFaces(this._maskImage);

      this._isMaskUpdated = true;
    }

    const camTex = createTextureFromImageBitmap(gl, inputImageBitmap);

    /* --------------------------------------- *
     *  invoke TF.js (Facemesh)
     * --------------------------------------- */
    this._camRegion = calcSizeToFit(camWidth, camHeight, camWidth, camHeight);

    if (MaskProcessor._model) {
      this._facePredictions = await MaskProcessor._model.estimateFaces(inputImageBitmap);
    }

    /* --------------------------------------- *
     *  render scene
     * --------------------------------------- */
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!camTex || !this._maskTex) return;

    render2dScene(
      gl,
      camTex,
      this._facePredictions,
      camWidth,
      camHeight,
      this._maskImage,
      this._maskTex,
      this._maskPredictions,
      this._camRegion,
      this._facemesh,
      this._r2d
    );

    // Copy content to output frame
    const ctx2D = outputFrameBuffer.getContext('2d');
    ctx2D?.drawImage(this._outputCanvas, 0, 0);
  }
}

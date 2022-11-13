import { Processor } from '@twilio/video-processors/es5/processors/Processor';
import '@tensorflow/tfjs-backend-webgl';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import {
  FaceLandmarksDetector,
  createDetector as loadModel,
  SupportedModels,
} from '@tensorflow-models/face-landmarks-detection';
import { create_image_texture2, create_image_texture_from_file } from './utils/textures';
import { r2d } from './utils/render-2d';
import { init_facemesh_render } from './utils/facemesh';
import { calc_size_to_fit, render_2d_scene } from './utils/webgl';
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
 *     assetsPath: 'https://my-server-path/assets',
 *     maskImage: img,
 *   });
 *
 *   faceMask.loadModel().then(() => {
 *     createLocalVideoTrack({
 *       width: 640,
 *       height: 480,
 *       frameRate: 24
 *     }).then(track => {
 *       track.addProcessor(faceMask);
 *     });
 *   });
 * };
 * img.src = '/face-mask.jpg';
 * ```
 */
export class MaskProcessor extends Processor {
  private _maskImage!: HTMLImageElement;
  // tslint:disable-next-line no-unused-variable
  private readonly _name: string = 'MaskProcessor';

  private static _model: FaceLandmarksDetector | null = null;
  private static async _loadModel(): Promise<void> {
    MaskProcessor._model =
      (await loadModel(SupportedModels.MediaPipeFaceMesh).catch((error: any) =>
        console.error('Unable to load model.', error)
      )) || null;
  }
  protected _outputCanvas: HTMLCanvasElement;
  protected _outputContext: WebGL2RenderingContext;

  private _inputCanvas: HTMLCanvasElement;
  private _inputContext: CanvasRenderingContext2D;

  private _prev_time_ms: number;
  private _cur_time_ms: number;
  private _interval_ms: number;
  private _time_invoked: number;

  private _masktex: any; // TODO: make an explicit type for this
  private _mask_updated: boolean;
  private _mask_init_done: boolean;
  private _mask_predictions: any; // TODO: make an explicit type for this
  private _face_predictions: any; // TODO: make an explicit type for this

  private _s_masktex_region: any;
  private _s_srctex_region: any;

  /**
   * Construct a MaskProcessor. Default values will be used for
   * any missing optional properties in [[MaskProcessorOptions]],
   * and invalid properties will be ignored.
   */
  constructor(options: MaskProcessorOptions) {
    super();

    this._inputCanvas = document.createElement('canvas');
    this._inputContext = this._inputCanvas.getContext('2d') as CanvasRenderingContext2D;
    this._outputCanvas = document.createElement('canvas');
    this._outputContext = this._outputCanvas.getContext('webgl') as WebGL2RenderingContext;

    this.maskImage = options.maskImage;

    this._prev_time_ms = performance.now();

    this._masktex = null;
    this._mask_updated = false;
    this._mask_init_done = false;
    this._mask_predictions = { length: 0 };

    this._face_predictions = { length: 0 };
    this._time_invoked = 0;
    this._cur_time_ms = performance.now();
    this._interval_ms = this._cur_time_ms - this._prev_time_ms;

    this._s_masktex_region = null;
    this._s_srctex_region = null;
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

    this._masktex = create_image_texture2(this._outputContext, this._maskImage);
  }

  /**
   * Load the segmentation model.
   * Call this method before attaching the processor to ensure
   * video frames are processed correctly.
   */
  async loadModel() {
    await MaskProcessor._loadModel();
  }

  async processFrame(inputFrameBuffer: OffscreenCanvas, outputFrameBuffer: HTMLCanvasElement): Promise<void> {
    const win_w = inputFrameBuffer.width;
    const win_h = inputFrameBuffer.height;

    if (!this._mask_init_done) {
      r2d.init_2d_render(this._outputContext, win_w, win_h);
      init_facemesh_render(this._outputContext, win_w, win_h);

      this._outputContext.clearColor(0.7, 0.7, 0.7, 1.0);
      this._outputContext.clear(this._outputContext.COLOR_BUFFER_BIT);

      this._outputContext.bindFramebuffer(this._outputContext.FRAMEBUFFER, null);
      this._outputContext.viewport(0, 0, win_w, win_h);
      this._outputContext.scissor(0, 0, win_w, win_h);
    }

    const camtex = create_image_texture_from_file(this._outputContext, await inputFrameBuffer.convertToBlob());

    this._prev_time_ms = this._cur_time_ms;

    /* --------------------------------------- *
     *  Update Mask (if need)
     * --------------------------------------- */
    if (!this._mask_init_done) {
      for (let i = 0; i < 5; i++)
        this._mask_predictions = await MaskProcessor._model?.estimateFaces(this._masktex.image as HTMLImageElement);

      this._mask_init_done = true;
      this._s_masktex_region = calc_size_to_fit(
        this._outputContext,
        this._masktex.image.width,
        this._masktex.image.height,
        150,
        150
      );
      this._mask_updated = true;
    }

    const src_w = inputFrameBuffer.width;
    const src_h = inputFrameBuffer.height;
    const texid = camtex.texid;

    /* --------------------------------------- *
     *  invoke TF.js (Facemesh)
     * --------------------------------------- */
    this._s_srctex_region = calc_size_to_fit(this._outputContext, src_w, src_h, win_w, win_h);

    if (MaskProcessor._model) {
      let time_invoke1_start = performance.now();

      const num_repeat = this._mask_updated ? 2 : 1;
      for (let i = 0; i < num_repeat; i++ /* repeat 5 times to flush pipeline ? */) {
        this._face_predictions = await MaskProcessor._model.estimateFaces(inputFrameBuffer.transferToImageBitmap());
      }
      this._time_invoked = performance.now() - time_invoke1_start;
    }

    /* --------------------------------------- *
     *  render scene
     * --------------------------------------- */
    this._outputContext.clear(this._outputContext.COLOR_BUFFER_BIT | this._outputContext.DEPTH_BUFFER_BIT);

    render_2d_scene(
      this._outputContext,
      texid,
      this._face_predictions,
      src_w,
      src_h,
      this._masktex,
      this._mask_predictions
    );
  }
}

/* eslint-disable no-console */

const CANVAS_HEIGHT = 150;
const CANVAS_WIDTH = 300;
const FFT_SIZE = 512;
const AudioContext = window.AudioContext || window.webkitAudioContext; // Default // Safari and old versions of Chrome

if (!AudioContext) {
  console.error('AudioContext is not supported on this platform ');
}
const audioContext = new AudioContext();

/**
 * @typedef {Object} WaveformOptions
 * @property {string} [height='100%'] - The CSS height to apply to the canvas, limiting the size
 *   of the waveform. Defaults to 100% to fill its parent.
 * @property {string} [width='100%'] - The CSS width to apply to the canvas, limiting the size
 *   of the waveform. Defaults to 100% to fill its parent.
 */

/**
 * Create a waveform element to attach to the DOM.
 * @param {WaveformOptions} [options]
 * @property {HTMLDivElement} element - The HTML element to add to the page.
 */
export function Waveform(options) {
  if (!(this instanceof Waveform)) {
    return new Waveform(options);
  }

  options = Object.assign(
    {
      // Allow a custom document for testing headlessly.
      _document: typeof document !== 'undefined' && document,
      height: '100%',
      width: '100%',
    },
    options
  );

  const canvas = options._document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.position = 'relative';

  // The height & width properties set the amount of pixels the canvas has to draw on.
  canvas.height = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;

  // The height & width styles scale the canvas.
  canvas.style.height = options.height;
  canvas.style.width = options.width;

  // To manipulate the canvas, we use its context. The canvas refers to the DOM element itself,
  // while the canvas refers to the underlying implementation which can be drawn to.
  const canvasContext = canvas.getContext('2d');
  canvasContext.lineWidth = 4;
  canvasContext.strokeStyle = 'rgb(0, 0, 0)';

  // We will get the frequency data by using an AnalyserNode, a feature of the AudioContext APIs.
  const analyser = audioContext.createAnalyser();

  // The FFT (fast fourier transform) takes a size parameter, which determines how many frequency
  // bins the audio is dissected into. Each frame, we will analyze the audio, and AnalyserNode
  // will update our buffer array. We can then inspect the array to see and render the specific
  // data values.
  analyser.fftSize = FFT_SIZE;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  Object.defineProperties(this, {
    _analyser: { value: analyser },
    _audioContext: { value: audioContext },
    _audioSource: { value: null, writable: true },
    _canvasContext: { value: canvasContext },
    _dataArray: { value: dataArray },
    element: {
      enumerable: true,
      value: canvas,
    },
  });
}

/**
 * Start rendering a visualization for the passed stream.
 * @param {MediaStream} stream - The stream to visualize.
 * @returns {void}
 */
Waveform.prototype.setStream = function setStream(stream) {
  // audioContext created w/o user action gets started as suspended.
  // need to resume. ( see: https://goo.gl/7K7WLu )
  this._audioContext.resume().then(
    function() {
      // Disconnect any existing audio source.
      this.unsetStream();

      // Create a new audio source for the passed stream, and connect it to the analyser.
      this._audioSource = this._audioContext.createMediaStreamSource(stream);
      this._audioSource.connect(this._analyser);

      // Start the render loop
      renderFrame(this);
    }.bind(this)
  );
};

/**
 * Stop visualizing the current stream.
 * @returns {void}
 */
Waveform.prototype.unsetStream = function unsetStream() {
  if (this._audioSource) {
    this._audioSource.disconnect(this._analyser);
    this._audioSource = null;
  }
};

/**
 * Render the current audio frequency snapshot to the canvas.
 * This implementation taken from the MDN example at:
 * https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
 * See the above link for more information.
 * @param {Waveform}
 * @returns {void}
 */
function renderFrame(waveform) {
  const analyser = waveform._analyser;
  const bufferLength = analyser.frequencyBinCount;
  const canvas = waveform.element;
  const canvasCtx = waveform._canvasContext;
  const dataArray = waveform._dataArray;

  // Stop if we've lost our audio source.
  if (!waveform._audioSource) {
    return;
  }

  // Ask the browser to run this function again on the next animation frame. The frames
  // drawn per second here depend on browser, but generally this is 30 or 60 fps.
  requestAnimationFrame(renderFrame.bind(null, waveform));

  // Get the current frequency data from the audio stream.
  analyser.getByteTimeDomainData(dataArray);

  // Reset the cavas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.beginPath();

  // Each byte of frequency will be drawn to the canvas, so each byte of frequency represents
  // a certain slice of the full width of the canvas.
  var sliceWidth = CANVAS_WIDTH / bufferLength;

  // For each byte of frequency, draw a slice to the canvas. Together, the canvas will be
  // covered by the resulting slices from left to right.
  var x = 0;
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    v *= v;
    var y = (v * CANVAS_HEIGHT) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  // End the line at the middle right, and draw the line.
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

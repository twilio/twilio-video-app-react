import { VideoProcessor } from 'twilio-video';

class Processor {
  outputFrame: any = null;

  constructor() {
    if (window.OffscreenCanvas) {
      this.outputFrame = new OffscreenCanvas(1, 1);
    }
  }
}

class GrayScaleProcessor extends Processor {
  constructor() {
    super();
  }

  processFrame(inputFrame: OffscreenCanvas): OffscreenCanvas {
    if (!this.outputFrame) {
      return inputFrame;
    }
    this.outputFrame.width = inputFrame.width;
    this.outputFrame.height = inputFrame.height;
    const context = this.outputFrame.getContext('2d');
    context.filter = 'grayscale(100%)';
    context.drawImage(inputFrame, 0, 0, inputFrame.width, inputFrame.height);
    return this.outputFrame;
  }
}

class BlurProcessor extends Processor {
  constructor() {
    super();
  }

  processFrame(inputFrame: OffscreenCanvas): OffscreenCanvas {
    if (!this.outputFrame) {
      return inputFrame;
    }
    this.outputFrame.width = inputFrame.width;
    this.outputFrame.height = inputFrame.height;
    const context = this.outputFrame.getContext('2d');
    context.filter = 'blur(8px)';
    context.drawImage(inputFrame, 0, 0, inputFrame.width, inputFrame.height);
    return this.outputFrame;
  }
}

export { GrayScaleProcessor, BlurProcessor }

const pixelmatch = require('pixelmatch');

function compareVideoElements(videoEl1, videoEl2) {
  const { videoHeight, videoWidth } = videoEl1.videoWidth > videoEl2.videoWidth ? videoEl2 : videoEl1;

  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');

  const context1 = canvas1.getContext('2d');
  const context2 = canvas2.getContext('2d');

  canvas1.height = videoHeight;
  canvas1.width = videoWidth;

  canvas2.height = videoHeight;
  canvas2.width = videoWidth;

  context1.drawImage(videoEl1, 0, 0, videoWidth, videoHeight);
  context2.drawImage(videoEl2, 0, 0, videoWidth, videoHeight);

  const imageData1 = context1.getImageData(0, 0, videoWidth, videoHeight).data;
  const imageData2 = context2.getImageData(0, 0, videoWidth, videoHeight).data;

  // If either frame is 100% black, return a result that will fail the test
  if (imageData1.every(i => i === 0) || imageData2.every(i => i === 0)) {
    return videoHeight * videoWidth; // 100% of pixels are incorrect
  }

  const result = pixelmatch(imageData1, imageData2, null, videoWidth, videoHeight);
  return result;
}

function compareVideoElementToFile(videoEl1, file) {
  const img = new Image();
  img.src = `data:image/png;base64,${file}`;
  return compareVideoElements(videoEl1, img);
}

const isSameVideoTrack = (_chai, utils) => {
  function assertIsSameVideoTrack($el1) {
    const $el2 = utils.flag(this, 'object');
    const result = compareVideoElements($el1[0], $el2[0]);

    const { videoHeight, videoWidth } = $el1[0].videoWidth > $el2[0].videoWidth ? $el2[0] : $el1[0];
    const totalPixels = videoHeight * videoWidth;
    const percentageTheshold = 0.1;

    this.assert(
      result < totalPixels * percentageTheshold,
      `expected #{act} to have same track as #{exp} - ${result} pixels were different`,
      `expected #{act} to not have same track as #{exp} - ${result} pixels were different`,
      $el1.selector || $el1[0].outerHTML,
      $el2.selector || $el2[0].outerHTML
    );
  }

  _chai.Assertion.addMethod('sameVideoTrack', assertIsSameVideoTrack);
};

const isSameVideoFile = (_chai, utils) => {
  function assertIsSameVideoFile($el) {
    const file = utils.flag(this, 'object');
    const result = compareVideoElementToFile($el[0], file);

    const totalPixels = $el[0].videoHeight * $el[0].videoWidth;
    const percentageTheshold = 0.1;

    this.assert(
      result < totalPixels * percentageTheshold,
      `expected #{act} to have same track as #{exp} - ${result} pixels were different`,
      `expected #{act} to not have same track as #{exp} - ${result} pixels were different`,
      $el.selector || $el[0].outerHTML,
      'file'
    );
  }

  _chai.Assertion.addMethod('sameVideoFile', assertIsSameVideoFile);
};

chai.use(isSameVideoTrack);
chai.use(isSameVideoFile);

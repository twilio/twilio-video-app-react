export default function volumeLevel(audioEl) {
  const stream = audioEl.captureStream();
  const context = new AudioContext();
  const mediaStreamSource = context.createMediaStreamSource(stream);
  const script = context.createScriptProcessor(2048, 1, 1);
  const analyser = context.createAnalyser();
  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = 1024;
  analyser.connect(script);
  mediaStreamSource.connect(analyser);

  const samples = []

  return new Promise(resolve => {
    script.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      for (let i = 0; i < array.length; i++) {
        values += array[i];
      }
      const average = values / array.length;
      samples.push(average)
      if (samples.length > 16) {
        console.log(samples)
        resolve(samples.reduce((p, c) => p + c, 0) / samples.length);
        // script.onaudioprocess = () => {};
        mediaStreamSource.disconnect(script);
        script.disconnect(context.destination);
      }
    };

    mediaStreamSource.connect(script);
    script.connect(context.destination);
  });
}

// https://stackoverflow.com/questions/33322681/checking-microphone-volume-in-javascript
class MicVolume {
  constructor(stream, callback) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);

    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.fftSize = 1024;

    this.microphone.connect(this.analyser);
    this.analyser.connect(this.javascriptNode);
    this.javascriptNode.connect(this.audioContext.destination);

    this.callback = callback;
    this.onAudioProcess = this.onAudioProcess.bind(this);
  }

  onAudioProcess() {
    const array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    let values = 0;

    const length = array.length;
    for (let i = 0; i < length; i++) {
      values += (array[i]);
    }

    const average = values / length;
    this.callback(average);
  }

  listen() {
    this.javascriptNode.addEventListener('audioprocess', this.onAudioProcess);
  }

  clear() {
    this.javascriptNode.removeEventListener('audioprocess', this.onAudioProcess);
  }
}

export default MicVolume;
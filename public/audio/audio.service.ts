import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()

export class AudioService {
  private audio$: Observable<number>;
  private _dataArray: Float32Array;
  private gainNode: GainNode;
  private analyzerNode: AnalyserNode;

  constructor() { };

  startAcq() {
    let audioCtx = new AudioContext();
    return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then((stream) => {
      let source = audioCtx.createMediaStreamSource(stream);

      this.analyzerNode = audioCtx.createAnalyser();
      this.gainNode = audioCtx.createGain();
      this.gainNode.gain.value = 1;
      this.analyzerNode.fftSize = 128;
      this._dataArray = new Float32Array(this.analyzerNode.frequencyBinCount);

      source.connect(this.gainNode);
      this.gainNode.connect(this.analyzerNode);

      return this.audio$ = Observable.interval(1000)
        .do(val => this.analyzerNode.getFloatFrequencyData(this._dataArray))
        .map(val => this._dataArray.slice(1, 11).reduce( ( p, c ) => p + c, 0 ) / 10)
        .share()
        //.do(val => console.log(this._dataArray));
    });

  }

}


import {Injectable} from "angular2/core";
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';

@Injectable()

export class AudioService {
  audio$: Observable<number>;
  private _dataArray: Uint8Array;

  constructor() {
    let audioCtx = new AudioContext();
    navigator.getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;
    let promise = new Promise<string>((resolve, reject) => {
      navigator.getUserMedia(
        { audio: true },
        (stream) => resolve(stream),
        (err) => reject(err));
    })
    .then((stream) => {
      let source = audioCtx.createMediaStreamSource(stream);
      let analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 2048;
      this._dataArray = new Uint8Array(analyzer.frequencyBinCount);
      source.connect(analyzer);

      this.audio$ = Observable.interval(1000)
        .do(val => analyzer.getByteFrequencyData(this._dataArray))
        .map(val => this._dataArray.slice(18, 158).reduce( ( p, c ) => p + c, 0 ) / 140.0)
        .share();
         //.do(val => console.log(val))
    })
    .catch((err) => console.log('The following gUM error occured: ' + err));

  };

}


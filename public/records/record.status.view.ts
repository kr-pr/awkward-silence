import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Status} from "../types/types";
import { BarGraph } from "./bar.graph";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'status-view',
  directives: [ BarGraph ],
  template: `
  <div class="record-status">
        Volume: {{status?.volume}}dB<br>
        {{status?.comments}} comments<br>
        {{status?.points}} seconds
  </div>
  <div class="record-status-bar-graph">
    <bar-graph [data]="bars" [dims]="dims"></bar-graph>
  </div>
  `
})

export class RecordStatusView{
  @Input() status: Status;
  dims: {x: number, y: number};
  bars: {i: number, vol: number}[];
  intObs;

  constructor(private ref: ChangeDetectorRef) {
    this.dims = {
      x: Math.round(window.innerWidth * 0.8),
      y: Math.round(window.innerHeight * 0.3)
    };
    this.bars = Array.from({ length: 20 }, (v, k) => ({i: k, vol: -100}));

    this.intObs = Observable.interval(1000)
    .subscribe(() => {
      this.ref.markForCheck();
      if (this.status.hasOwnProperty('volume') && this.status.volume) {
      let ta = this.bars.slice();
      ta.shift();
      ta.push({
        i: ta.length,
        vol: this.status.volume
      });
      this.bars = ta.map((v, i) => ({vol: v.vol, i: i}));
    };
    });
  }
  disable() { this.intObs.unsubscribe();}
}
import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Status} from "../types/types";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'status-view',
  template: `
  <div class="hero">
        Volume: {{status?.volume}}dB<br>
        {{status?.comments}} comments<br>
        {{status?.points}} seconds
  </div>
  `
})

export class RecordStatusView {
  @Input() status: Status;
  constructor(private ref: ChangeDetectorRef) {
    Observable.interval(1000)
    .subscribe(() => this.ref.markForCheck());
  }
}
import {Component, View, ElementRef,  OnInit } from "angular2/core";
import { Router, CanActivate , RouteParams} from "angular2/router";
import * as d3 from 'd3';
import { Convo, TrackData } from "../types/types";
import { LineGraph } from "./line.graph";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'convo-view'
})

@View({
  directives: [ LineGraph ],
  template: `
  <h3 class="title">Conversation timeline</h3>
  <line-graph [data]="leftTrack" [dims]="dims"></line-graph>
  <line-graph [data]="rightTrack" [dims]="dims"></line-graph>
  `
})

@CanActivate(() => tokenNotExpired())

export class ViewComponent implements OnInit {
  id: string;
  errorMessage;
  dims: {x: number, y: number};
  leftTrack: TrackData[];
  rightTrack: TrackData[];

  constructor(
      private _router: Router,
      private _routeParams: RouteParams,
      private _recordService: ApiService
  ) {
    this.dims = {
      x: Math.round(window.innerWidth / 3),
      y: Math.round(window.innerHeight * 3/4)
    };
  }

  ngOnInit() {
    this.id = this._routeParams.get('id');
    this._recordService.getView(this.id).subscribe(
      (convo: Convo) => {
        this.leftTrack = convo.timeline.map(v => <TrackData>{time: v.time, data: v.records});
        this.rightTrack = convo.timeline.map(v => <TrackData>{time: v.time, data: v.props});
      },
      error =>  this.errorMessage = <any>error
    );
  }
}


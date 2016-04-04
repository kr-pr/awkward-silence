import {Component, View, ElementRef,  OnInit } from "angular2/core";
import { Router, CanActivate , RouteParams} from "angular2/router";
import * as d3 from 'd3';
import { Convo, TrackData, CommentData } from "../types/types";
import { LineGraphTrack } from "./line.graph";
import { CommentTrack } from "./comment.track";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';

@Component({
  selector: 'convo-view'
})

@View({
  directives: [ LineGraphTrack, CommentTrack ],
  template: `
  <div>
    <i class="title">Click on colored area to annotate timeline</i>
  </div>
  <line-graph-track [data]="leftTrack" [names]="lNames" [dims]="dims" [sub0]="true"></line-graph-track>
  <comment-track [data]="centerComments" [dims]="{x: dims.x*0.75, y: dims.y}" [t]="t"></comment-track>
  <line-graph-track [data]="rightTrack" [names]="rNames" [dims]="dims" [sub0]="false"></line-graph-track>
  `
})

@CanActivate(() => tokenNotExpired())

export class ViewComponent implements OnInit {
  id: string;
  errorMessage;
  dims: {x: number, y: number};
  leftTrack: TrackData[];
  rightTrack: TrackData[];
  lNames: string[];
  rNames: string[];
  centerComments: CommentData[];
  t: {min: Date, max: Date};

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

  tt(time: number) {
    return new Date(time * 1000);
  }

  ngOnInit() {
    this.id = this._routeParams.get('id');
    this._recordService.getView(this.id).subscribe(
      (convo: Convo) => {
        this.t = {
          min: this.tt(convo.timeline[0].time),
          max: this.tt(convo.timeline[convo.timeline.length - 1].time)
        };
        this.leftTrack = convo.timeline
          .map(v => <TrackData>{time: this.tt(v.time), values: v.records.slice(0, 2)});
        this.lNames = convo.records.map(item => item.note);
        this.centerComments = convo.comments
          .map(v => <CommentData>{time: this.tt(v.time), value: v.value});
        this.rightTrack = convo.timeline
          .map(v => <TrackData>{time: this.tt(v.time), values: v.props});
        this.rNames = convo.timeline[0].props.map((item, ind) => ind.toString());
      },
      error =>  this.errorMessage = <any>error
    );
  }
}


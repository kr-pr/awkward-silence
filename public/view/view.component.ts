import {Component, Directive, View, Attribute, ElementRef, Inject, OnInit, OnChanges } from "angular2/core";
import { Router, CanActivate , RouteParams} from "angular2/router";
import * as d3 from 'd3';
import { Convo } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';

@Directive({
  selector:   'line-graph',
  properties: [ 'data' ]
})

class LineGraph implements OnChanges {
  data: Convo;
  svg: any; x: any; y: any; line: any;
  constructor(
    @Inject(ElementRef) elementRef: ElementRef,
    @Attribute('width') width: string,
    @Attribute('height') height: string) {

    let el: any    = elementRef.nativeElement;
    let graph: any = d3.select(el);
    let axisStyle = {
      'fill': 'none',
      'stroke': 'blue',
      'stroke-width': '2px'
    };

    this.x = d3.time.scale().range([0, +width]);
    this.y = d3.scale.linear().range([+height, 0]);
    let xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    let yAxis = d3.svg.axis().scale(this.y).orient("left");

    this.line = d3.svg.line()
      .x(d => this.x(d.time))
      .y(d => this.y(d.value));

    this.svg = graph
      .append("svg")
      .attr("width", width )
      .attr("height", height );

    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis).style(axisStyle);

    this.svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis).style(axisStyle);
};

  render(newData) {
    if (!newData) return;
    this.x.domain(d3.extent(newData, d => d.time ));
    this.y.domain(d3.extent(newData, d => d.value ));

    this.svg.append("path")
      .datum(newData)
      .attr("class", "line")
      .attr("d", this.line).style({
        'fill': 'none',
        'stroke': 'black',
        'stroke-width': '3px'
      });

  }

  ngOnChanges() {
    if (this.data) this.render(this.data.timeline);
  }
}


@Component({
  selector: 'convo-view'
})

@View({
  directives: [ LineGraph ],
  template: `
  <h3 class="title">Conversation timeline</h3>
  <line-graph bind-data="convo" width="400" height="250"> </line-graph>
  `
})

@CanActivate(() => tokenNotExpired())

export class ViewComponent implements OnInit {
  id: string;
  convo: Convo;
  errorMessage;

  constructor(
      private _router: Router,
      private _routeParams: RouteParams,
      private _recordService: ApiService
  ) {}

  ngOnInit() {
    this.id = this._routeParams.get('id');
    this._recordService.getView(this.id).subscribe(
      convo => this.convo = convo,
      error =>  this.errorMessage = <any>error
    );
  }
}


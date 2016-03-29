import { Directive, Input, ElementRef, Inject, OnChanges, OnInit } from "angular2/core";
import { TrackData } from "../types/types";

@Directive({
  selector:   'line-graph'
})

export class LineGraph implements OnInit, OnChanges {
  @Input() data: TrackData[];
  @Input() dims: {x: number, y: number};
  graph: any; svg: any; x: any; y: any; lines: any;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    let el: any    = elementRef.nativeElement;
    this.graph = d3.select(el);
  }

  ngOnInit() {
    let axisStyle = {
      'fill': 'none',
      'stroke': 'black',
      'stroke-width': '2px'
    };

    this.x = d3.time.scale().range([0, +this.dims.x]);
    this.y = d3.scale.linear().range([0, +this.dims.y]);
    let xAxis = d3.svg.axis().scale(this.x).orient("top");
    let yAxis = d3.svg.axis().scale(this.y).orient("left");

    this.svg = this.graph
      .append("svg")
      .attr("width", this.dims.x )
      .attr("height", this.dims.y );

    this.svg
      .append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .call(xAxis).style(axisStyle);

    this.svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis).style(axisStyle);
  }
  render(newData) {

    this.x.domain([0, 1]);
    this.y.domain(d3.extent(newData, d => d.time ));
    this.lines = [];
    for(var i = 0; i < newData[0].data.length; i++) {
      this.lines.push(d3.svg.line()
        .x(d => this.x(d.data[i]))
        .y(d => this.y(d.time))
      );

      this.svg.append("path")
        .datum(newData)
        .attr("class", "line")
        .attr("d", this.lines[i]).style({
          'fill': 'none',
          'stroke': 'black',
          'stroke-width': '2px'
        });
    }
  }

  ngOnChanges() {
    if (this.data) this.render(this.data);
  }
}
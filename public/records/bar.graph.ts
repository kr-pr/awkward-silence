import { Directive, Input, ElementRef, Inject, OnChanges } from "angular2/core";
import * as d3 from 'd3';

@Directive({
  selector:   'bar-graph'
})

export class BarGraph implements OnChanges {
  @Input() data: {i: number, vol: number}[];
  @Input() dims: {x: number, y: number};
  graph: d3.Selection<any>;
  svg: d3.Selection<any>;
  x: d3.scale.Ordinal<string, number>;
  y: d3.scale.Linear<number, number>;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    let el: any = elementRef.nativeElement;
    this.graph = d3.select(el);
  }

  init() {
    this.x = d3.scale.ordinal().rangeRoundBands([0, +this.dims.x], .1);
    this.y = d3.scale.linear().range([+this.dims.y, 0]);
    console.log(this.dims);
    this.svg = this.graph
      .append("svg")
      .attr("width", this.dims.x )
      .attr("height", this.dims.y );
  }

  render(data) {
    this.svg.selectAll("rect")
      .remove();

    this.x.domain(data.map(d => d.i));
    this.y.domain([d3.min(data, d => d.vol), d3.max(data, d => d.vol)]);

    this.svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "gray")
      .attr("x", d => this.x(d.i))
      .attr("width", this.x.rangeBand())
      .attr("y", d => this.y(d.vol))
      .attr("height", d => this.dims.y - this.y(d.vol));
  }

  ngOnChanges() {
    if (!this.x) this.init();
    if (this.data) this.render(this.data);
  }
}
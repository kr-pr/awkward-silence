import { Directive, Input, ElementRef, Inject, OnChanges, OnInit } from "angular2/core";
import { CommentData } from "../types/types";

@Directive({
  selector:   'comment-track'
})

export class CommentTrack implements OnInit, OnChanges {
  @Input() data: CommentData[];
  @Input() dims: {x: number, y: number};
  @Input() t: {min: Date, max: Date};
  graph: any; svg: any; y: any;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    let el: any = elementRef.nativeElement;
    this.graph = d3.select(el);
  }

  ngOnInit() {

    this.y = d3.time.scale().range([0, +this.dims.y]);

    this.svg = this.graph
      .append("svg")
      .attr("width", this.dims.x )
      .attr("height", this.dims.y );

  }

  render(newData) {
    let text = this.svg
      .selectAll("text")
      .data(newData)
      .enter()
      .append("text");

    this.y.domain(d3.extent([this.t.min, this.t.max]));

    let textLabels = text
      .attr("x", (d => 5 ))
      .attr("y", (d => this.y(d.time)))
      .text( d => d.value )
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("text-align", "left")
      .attr("fill", "black");
  }

  ngOnChanges() {
    if (this.data) this.render(this.data);
  }
}
import { Directive, Input, ElementRef, Inject, OnChanges, OnInit } from "angular2/core";
import { TrackData } from "../types/types";

@Directive({
  selector: 'line-graph-track'
})

export class LineGraphTrack implements OnInit, OnChanges {
  @Input() data: TrackData[];
  @Input() names: string[];
  @Input() dims: {x: number, y: number};
  @Input() sub0: boolean;

  graph: d3.Selection<any>;
  svg: d3.Selection<any>;
  color: d3.scale.Ordinal<string, string>;
  stack: any;
  xAxis: d3.svg.Axis;
  yAxis: d3.svg.Axis;
  x: d3.time.Scale<number, number>;
  y: d3.scale.Linear<number, number>;
  area: d3.svg.Area<[number, number]>;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    let el: any = elementRef.nativeElement;
    this.graph = d3.select(el);
  }

  ngOnInit() {

    this.x = d3.time.scale()
        .range([0, this.dims.y]);
    this.y = d3.scale.linear()
        .range([this.dims.x, 0]);
    this.color = d3.scale.category10();

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .tickFormat(d3.time.format("%X"))
        .ticks(3);

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("right")
        .ticks(3);

    this.area = d3.svg.area()
        .x(d  => this.x(d.time))
        .y0(d  => this.y(d.y0))
        .y1(d  => this.y(d.y0 + d.y));

    this.stack = d3.layout.stack()
        .values(d => d.values);

    this.svg = this.graph
      .append("svg")
        .attr("width", this.dims.x)
        .attr("height", this.dims.y);

  }

  paintLegend(names){
    this.svg.selectAll(".caption-symbol").remove();
    this.svg.selectAll(".caption-text").remove();
    names.forEach((val, ind) => {
      let rad = 15;
      this.svg.append("circle")
        .attr("class", "caption-symbol")
        .attr("cx", this.dims.x - rad * 2)
        .attr("cy", this.dims.y - rad * 3 - ind * rad * 2.5 )
        .attr("r", rad)
        .attr("fill", this.color(this.names[ind]))
        .attr("stroke", "black")
        .attr("stroke-width", "2");
      this.svg.append("text")
        .attr("class", "caption-text")
        .attr("transform", `translate(${this.dims.x - rad * 3} ${this.dims.y - rad * 3 - ind * rad * 2.5})`)
        .attr("dy", "0.35em")
        .attr("x", -5)
        .attr("text-anchor", "end")
        .text(val);
    });
  };

  render(data, names) {
    let curNames = names.slice();
    this.color.domain(names);

    this.stack.offset((this.sub0) ? (data => (data[0].map((v,i) => -v[1]))) : 'zero');

    let curves = this.stack(
      this.color.domain()
        .map((name, ind) => ({
          name: name,
          values: data.map(d => ({
            time: d.time,
            y: d.values[ind]
          }))
        }))
    );

    this.x.domain(d3.extent(data, d  => d.time ));
    this.y.domain((this.sub0) ? [-1.0, 1.2] : [-0.2, 1.0]);


    let curve = this.svg.selectAll(".curve")
      .data(curves)
    .enter().append("g")
      .attr("class", "curve");

    let mouseDownArea = (ev => {
      name = prompt('Enter new name: ');
      let ind = names.indexOf(ev.name);
      curNames[ind] = name;
      this.paintLegend(curNames);
    });

    curve.append("path")
      .attr("class", "area")
      .attr("d", d  => this.area(d.values))
      .style("fill", d  => this.color(d.name))
      .on("mousedown", mouseDownArea);


    if (this.sub0) curve.append("text")
      .datum(d  => ({name: d.name, value: d.values[15]}))
      .attr("class", "captions")
      .attr("transform", d  => `translate(${this.x(d.value.time)}, ${this.y(d.value.y0 + d.value.y / 2)}) rotate(-90)`)
      .attr("dx", -5)
      .attr("dy", "0.35em")
      .text(d  => d.name);

    let axisStyle = {
      "fill": "none",
      "stroke": "#000",
      "shape-rendering": "crispEdges"
    };

    this.yAxis.tickFormat(d3.format(this.sub0 ? ".1r" : ".0%"));
    this.xAxis.orient(this.sub0 ? "bottom" : "top");

    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${this.sub0 ? 0.0 : -0.99 * this.dims.x} 0) rotate(90 ${this.dims.x / 2} ${this.dims.x / 2})`)
      .call(this.xAxis);
    this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(0 1) rotate(90 ${this.dims.x / 2} ${this.dims.x / 2})`)
      .call(this.yAxis);
    this.svg.selectAll(".curve")
      .attr("transform", `rotate(90 ${this.dims.x / 2} ${this.dims.x / 2})`);

    this.svg.selectAll(".axis path")
      .style(axisStyle);
    this.svg.selectAll(".axis line")
      .style(axisStyle);


  }

  ngOnChanges() {
    if (this.data) this.render(this.data, this.names);
  }
}
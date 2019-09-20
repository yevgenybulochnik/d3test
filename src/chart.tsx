import React from 'react';
import * as d3 from 'd3';
import './chart.css';
import { ScaleLinear } from 'd3';

interface State {
  chartId: string;
  chartWidth: number;
  chartHeight: number;
  xScale: ScaleLinear<any, any>;
  yScale: ScaleLinear<any, any>;
}

interface Props {
  width: number;
  height: number;
  margin: number;
  data: any;
}

class Chart extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();

  state = {
    chartId: btoa(Math.random().toString()).substring(0,12),
    chartWidth: this.props.width - this.props.margin*2,
    chartHeight: this.props.height - this.props.margin*2,
    xScale: d3.scaleLinear().domain([0, 1000]).range([0, this.props.width - this.props.margin*2]),
    yScale: d3.scaleLinear().domain([0, 1000]).range([this.props.height - this.props.margin*2, 0])
  }

  drawChart = () => {
    const { chartId, chartWidth, chartHeight, xScale, yScale } = this.state
    const zoom = d3.zoom().on('zoom', this.onZoom)

    const svg = d3.select(this.ref.current)
      .call(zoom as any)
      .append('g')
        .attr('transform', `translate(${this.props.margin}, ${this.props.margin})`)

    // X-Axis
    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))

    // Y-Axis
    svg.append('g')
      .attr('class', 'yAxis')
      .call(d3.axisLeft(yScale))

    // X Grid
    svg.append('g')
      .attr('class', 'xGrid')
      .call(
        d3.axisBottom(xScale)
          .tickSize(chartHeight)
          .tickFormat(() => '')
      )

    // Y Grid
    svg.append('g')
      .attr('class', 'yGrid')
      .call(
        d3.axisLeft(yScale)
          .tickSize(-chartWidth)
          .tickFormat(() => '')
      )

    // Group for data
    svg.append('g')
      .attr('clip-path', `url(#clip-${chartId})`)
        .append('g')
        .attr('class', 'dataGroup')

    // Clip Path setup
    d3.select(this.ref.current).append('defs').append('clipPath')
      .attr('id', `clip-${chartId}`)
      .append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)

  }

  setData = () => {
    const { xScale, yScale } = this.state

    // Insert data points
    d3.select(this.ref.current).select('.dataGroup').selectAll('circle')
      .data(this.props.data)
      .enter().append('circle').transition()
        .attr('cx', (d: any) => xScale(d.x))
        .attr('cy', (d: any) => yScale(d.y))
        .attr('r', 10)
        .attr('opacity', 0.3)

    // Remove removed datapoints
    d3.select(this.ref.current).select('.dataGroup').selectAll('circle')
      .data(this.props.data).exit()
      .transition()
        .attr('opacity', 0)
      .remove()

  }

  onZoom = () => {
    const {chartWidth, chartHeight, xScale, yScale } = this.state

    const svg = d3.select(this.ref.current)
    const dataGroup = svg.select('.dataGroup')
    const xAxis = svg.select<SVGSVGElement>('.xAxis')
    const yAxis = svg.select<SVGSVGElement>('.yAxis')
    const xGrid = svg.select<SVGSVGElement>('.xGrid')
    const yGrid = svg.select<SVGSVGElement>('.yGrid')

    dataGroup.attr('transform', d3.event.transform)

    xAxis.call(
      d3.axisBottom(xScale)
        .scale(d3.event.transform.rescaleX(xScale))
    )

    yAxis.call(
      d3.axisLeft(yScale)
        .scale(d3.event.transform.rescaleY(yScale))
    )

    xGrid.call(
      d3.axisBottom(xScale)
        .scale(d3.event.transform.rescaleX(xScale))
          .tickSize(chartHeight)
          .tickFormat(() => '')
    )

    yGrid.call(
      d3.axisLeft(yScale)
        .scale(d3.event.transform.rescaleY(yScale))
          .tickSize(-chartWidth)
          .tickFormat(() => '')
    )
  }


  componentDidMount() {
    this.drawChart()
    this.setData()
  }

  componentDidUpdate() {
    this.setData()
  }

  render() {
    return (
      <svg
        ref={this.ref}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}

export default Chart

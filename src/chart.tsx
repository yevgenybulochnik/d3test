import React from 'react';
import * as d3 from 'd3';
import './chart.css';

interface State {

}

interface Props {
  width: number;
  height: number;
  margin: number;
}

class Chart extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();

  drawChart = () => {
    const data = [
      [100, 100],
      [110, 110],
      [112, 112],
      [115, 115],
      [200, 200],
      [300, 300]
    ]

    const width = this.props.width - this.props.margin*2
    const height = this.props.height - this.props.margin*2

    const zoom = d3.zoom()
      .on('zoom', zoomed)

    const svg = d3.select(this.ref.current)
      .attr('width', width + this.props.margin*2)
      .attr('height', height + this.props.margin*2)
      .append('g')
        .attr('transform', `translate(${this.props.margin}, ${this.props.margin})`)

    const x = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, 1000])
      .range([height, 0])

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    const xGrid = svg.append('g')
      .attr('opacity', 0.2)
      .call(
        d3.axisBottom(x)
          .tickSize(height)
          .tickFormat(() => '')
      )

    const yGrid = svg.append('g')
      .attr('opacity', 0.2)
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => '')
      )

    const gX = svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    const gY = svg.append('g')
      .call(yAxis)

    const circleGroup = svg.append('g')
      .attr('clip-path', `url(#clip)`)

    const circles = circleGroup.selectAll('circle')
      .data(data)
      .enter().append('circle')
        .attr('cx', (d) => x(d[0]))
        .attr('cy', (d) => y(d[1]))
        .attr('r', 10)
        .attr('opacity', 0.3)

    d3.select(this.ref.current).append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height)

    //@ts-ignore
    d3.select(this.ref.current).call(zoom)

    function zoomed() {
      circles.attr('transform', d3.event.transform)
      xGrid.call(
        d3.axisBottom(x)
            .scale(d3.event.transform.rescaleX(x))
            .tickSize(height)
            .tickFormat(() => '')
      )
      yGrid.call(
        d3.axisLeft(y)
            .scale(d3.event.transform.rescaleY(y))
            .tickSize(-width)
            .tickFormat(() => '')
      )
      gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
      gY.call(yAxis.scale(d3.event.transform.rescaleY(y)))
    }

  }

  componentDidMount() {
    this.drawChart()
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

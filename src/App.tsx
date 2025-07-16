import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css';

interface DataPoint {
  category: string;
  value: number;
}

export default function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };

  useEffect(() => {
    if (!svgRef.current) return;

    // Sample data
    const data: DataPoint[] = [
      { category: 'A', value: 30 },
      { category: 'B', value: 80 },
      { category: 'C', value: 45 },
      { category: 'D', value: 60 },
      { category: 'E', value: 20 },
    ];

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.category) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(0) - yScale(d.value))
      .attr('fill', 'steelblue')
      .attr('rx', 4)
      .attr('ry', 4);

    // Add labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.value);

  }, []);

  return (
    <div className="app">
      <h1>D3.js Data Visualization</h1>
      <div className="chart-container">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

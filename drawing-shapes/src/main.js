import * as d3 from "d3";

// Sample data
const data = [10, 25, 40, 15, 60, 30, 80, 55, 20, 70, 45, 90];

// SVG size
const svgWidth = 700;
const svgHeight = 500;

// Select SVG and set size
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Chart size (inner area for bars)
const chartWidth = 600;
const chartHeight = 400;

// Margins inside the chart for bars
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// Compute group translation to center chart in SVG
const chartX = (svgWidth - chartWidth) / 2;
const chartY = (svgHeight - chartHeight) / 2;

// Create chart group
const chart = svg.append("g")
    .attr("transform", `translate(${chartX}, ${chartY})`);

// Create scales
const xScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, chartWidth])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([chartHeight, 0]);

// Color scale
const colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data)]);

// Draw bars
chart.selectAll("rect.bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d))
    .attr("fill", d => colorScale(d))
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .on("mouseover", function () {
        d3.select(this).attr("opacity", 0.7);
    })
    .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
    });

// Draw a frame rectangle bigger than chart and centered
const framePadding = 20; // extra space around chart

svg.append("rect")
    .attr("x", chartX - framePadding)
    .attr("y", chartY - framePadding)
    .attr("width", chartWidth + framePadding * 2)
    .attr("height", chartHeight + framePadding * 2)
    .attr("fill", "none")
    .attr("stroke", "#333")
    .attr("stroke-width", 5)
    .attr("rx", 10) // optional rounded corners
    .attr("ry", 10);
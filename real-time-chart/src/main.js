import * as d3 from "d3";

// SVG setup
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Chart group
const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
const yScale = d3.scaleLinear().range([chartHeight, 0]);

// Color scale
const colorScale = d3.scaleSequential(d3.interpolateBlues);

// Gaussian function
function gaussian(x, mu, sigma) {
    return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) * 100;
}

// Generate Gaussian data with peak at mu
function generateGaussianData(length, mu, sigma) {
    return Array.from({ length }, (_, i) => gaussian(i, mu, sigma));
}

// Draw/update chart
function update(data) {
    xScale.domain(d3.range(data.length));
    yScale.domain([0, d3.max(data)]);
    colorScale.domain([0, d3.max(data)]);

    const bars = chart.selectAll("rect").data(data);

    bars.exit().remove();

    bars.enter()
        .append("rect")
        .attr("x", (_, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d))
        .attr("fill", d => colorScale(d))
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", (_, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d))
        .attr("fill", d => colorScale(d));
}

// Parameters
const numBars = 30;
let peak = 0;
const sigma = 3; // controls width of Gaussian

// Initial render
let data = generateGaussianData(numBars, peak, sigma);
update(data);

// Update every 200ms, shifting peak
setInterval(() => {
    peak += 0.5;
    if (peak > numBars) peak = 0;
    data = generateGaussianData(numBars, peak, sigma);
    update(data);
}, 200);
import * as d3 from 'd3';
import { formatSales } from './barChart.js';

export async function buildUSMap() {
    const data = await d3.csv('/data/2013-state-sales.csv', d => ({ ...d, sales: +d.sales }));
    const json = await d3.json('/data/us.json');

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const w = 400 - margin.left - margin.right;
    const h = 400 - margin.top - margin.bottom;

    const projection = d3.geoAlbersUsa().translate([w / 2 + 10, h / 2 - 80]).scale(h + 50);
    const path = d3.geoPath().projection(projection);

    // Dynamic color scale (interpolated)
    const maxSales = d3.max(data, d => d.sales);
    const color = d3.scaleSequential(d3.interpolateGreens).domain([0, maxSales]);

    const svg = d3.select("#bottomRight")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Merge sales into GeoJSON
    json.features.forEach(feature => {
        const stateData = data.find(d => d.state === feature.properties.NAME);
        feature.properties.value = stateData ? stateData.sales : 0;
    });

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("padding", "8px")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("font-size", "12px");

    // Draw states
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => d.properties.value ? color(d.properties.value) : "#eee")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget)
                .attr("stroke-width", 2)
                .attr("stroke", "#333");

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`<strong>${d.properties.NAME}</strong><br/>
                          <strong>Sales:</strong> $${formatSales(d.properties.value)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget)
                .attr("stroke-width", 1)
                .attr("stroke", "#fff");

            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Optional: add a color legend
    const legendWidth = 200;
    const legendHeight = 10;

    const legendSvg = svg.append("g")
        .attr("transform", `translate(${w - legendWidth - 20}, ${h - 30})`);

    const legendScale = d3.scaleLinear()
        .domain([0, maxSales])
        .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d3.format(".2s"));

    // Gradient for legend
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient");

    linearGradient.selectAll("stop")
        .data(d3.range(0, 1.01, 0.01))
        .enter()
        .append("stop")
        .attr("offset", d => d)
        .attr("stop-color", d => color(d * maxSales));

    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

    legendSvg.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .select(".domain").remove();
}
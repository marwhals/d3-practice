import * as d3 from 'd3';

export async function buildLines() {
    const data = await d3.json('/data/2013-category-sales.json');

    data.contents.forEach(ds => {
        // Add header
        d3.select("#bottomLeft")
            .append("h2")
            .text(`${ds.category} Sales Trend (2013)`);

        // Set up margins and dimensions
        const margin = {top: 20, right: 30, bottom: 40, left: 50};
        const width = 400 - margin.left - margin.right;
        const height = 150 - margin.top - margin.bottom; // taller for axes labels

        // Create scales
        const x = d3.scaleLinear()
            .domain([d3.min(ds.monthlySales, d => d.month), d3.max(ds.monthlySales, d => d.month)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(ds.monthlySales, d => d.sales)]).nice()
            .range([height, 0]);

        // Line generator
        const line = d3.line()
            .x(d => x(d.month))
            .y(d => y(d.sales))
            .curve(d3.curveLinear);

        // Append SVG
        const svg = d3.select("#bottomLeft")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-bottom", "20px") // spacing between charts
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Draw line
        svg.append("path")
            .datum(ds.monthlySales)
            .attr("fill", "none")
            .attr("stroke", "#666")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Draw X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(ds.monthlySales.length))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        // Draw Y axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")));
    });
}
import * as d3 from "d3";

const h = 200; // height of chart
const w = 500; // width of chart
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// Function to show chart header
function showHeader(ds) {
    d3.select("body").append("h1")
        .text(`${ds.category} Sales (2013)`);
}

// Function to build the line chart
function buildLine(ds) {
    // Create SVG container
    const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    const xScale = d3.scaleLinear()
        .domain([
            d3.min(ds.monthlySales, d => d.month),
            d3.max(ds.monthlySales, d => d.month)
        ])
        .range([margin.left, w - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(ds.monthlySales, d => d.sales)])
        .range([h - margin.bottom, margin.top]);

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.month))
        .y(d => yScale(d.sales))
        .curve(d3.curveMonotoneX); // smoother curve

    // Draw line
    svg.append("path")
        .datum(ds.monthlySales)
        .attr("d", line)
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Draw circles at each data point
    svg.selectAll("circle")
        .data(ds.monthlySales)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.month))
        .attr("cy", d => yScale(d.sales))
        .attr("r", 4)
        .attr("fill", "purple");

    // Optional: axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d.toString().slice(4, 6)); // show month

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);
}

// Load data and render charts
d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json")
    .then(data => {
        // Decode base64 content from GitHub API
        const decodedData = JSON.parse(window.atob(data.content));

        decodedData.contents.forEach(ds => {
            showHeader(ds);
            buildLine(ds);
        });
    })
    .catch(error => console.error("Error loading data:", error));
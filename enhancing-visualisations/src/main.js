import * as d3 from "d3";

const h = 150;
const w = 400;
const padding = 40;

// Convert YYYYMMDD number to JS Date
function getDate(d) {
    const strDate = d.toString();
    const year = +strDate.substr(0, 4);
    const month = +strDate.substr(4, 2) - 1; // zero-based
    const day = +strDate.substr(6, 2);
    return new Date(year, month, day);
}

// Show chart header
function showHeader(ds) {
    d3.select("body")
        .append("h2")
        .text(`${ds.category} Sales (2013)`);
}

// Build line chart
function buildLine(ds) {

    const monthlySales = ds.monthlySales;

    // X & Y scales
    const xScale = d3.scaleTime()
        .domain([getDate(monthlySales[0].month), getDate(monthlySales[monthlySales.length - 1].month)])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(monthlySales, d => d.sales)])
        .range([h - padding, padding]);

    // Axes generators
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Line generator
    const lineFun = d3.line()
        .x(d => xScale(getDate(d.month)))
        .y(d => yScale(d.sales))
        .curve(d3.curveMonotoneX); // smooth curve

    // Create SVG
    const svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Draw axes
    svg.append("g")
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis);

    // Draw line
    svg.append("path")
        .datum(monthlySales)
        .attr("d", lineFun)
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Draw circles at data points
    svg.selectAll("circle")
        .data(monthlySales)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(getDate(d.month)))
        .attr("cy", d => yScale(d.sales))
        .attr("r", 4)
        .attr("fill", "cyan");
}

// Load data and build charts
d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json")
    .then(data => {
        const decodedData = JSON.parse(window.atob(data.content));

        decodedData.contents.forEach(ds => {
            showHeader(ds);
            buildLine(ds);
        });
    })
    .catch(error => console.error("Failed to load JSON:", error));
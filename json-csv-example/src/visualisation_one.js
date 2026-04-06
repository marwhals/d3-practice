import * as d3 from "d3";

const h = 100;
const w = 400;

// Select the existing SVG for the first visualization
const svg = d3.select("#viz1");

// Dataset placeholder
let ds;

// Function to build the line chart
function buildLine() {

    // Modern line generator
    const lineFun = d3.line()
        .x(d => ((+d.month - 20130001) / 3.25)) // convert month to number
        .y(d => h - (+d.sales))                 // convert sales to number
        .curve(d3.curveLinear);

    // Draw line path
    svg.append("path")
        .datum(ds) // bind dataset
        .attr("d", lineFun)
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Optional: draw circles at data points
    svg.selectAll("circle")
        .data(ds)
        .enter()
        .append("circle")
        .attr("cx", d => ((+d.month - 20130001) / 3.25))
        .attr("cy", d => h - (+d.sales))
        .attr("r", 3)
        .attr("fill", "purple");
}

// Load CSV using modern promises
d3.csv("data/MonthlySales.csv", d => {
    // Convert CSV strings to numbers
    return {
        month: +d.month,
        sales: +d.sales
    };
}).then(data => {
    ds = data;
    buildLine();
}).catch(error => {
    console.error("Error loading CSV:", error);
});
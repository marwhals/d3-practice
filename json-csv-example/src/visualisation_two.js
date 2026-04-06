import * as d3 from "d3";

const h = 100;
const w = 400;
const padding = 5;

// Select the existing SVG for the second visualization
const svg = d3.select("#viz2");

let ds; // dataset

function buildBarChart() {

    // Calculate bar width
    const barWidth = w / ds.length - padding;

    // Draw bars
    svg.selectAll("rect")
        .data(ds)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (barWidth + padding))
        .attr("y", d => h - d.sales)
        .attr("width", barWidth)
        .attr("height", d => d.sales)
        .attr("fill", "steelblue");

    // Add labels on top of bars
    svg.selectAll("text")
        .data(ds)
        .enter()
        .append("text")
        .text(d => d.sales)
        .attr("x", (d, i) => i * (barWidth + padding) + barWidth / 2)
        .attr("y", d => h - d.sales - 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#333");

    // Calculate total sales
    const salesTotal = ds.reduce((sum, d) => sum + d.sales, 0);

    // Append a table below the chart
    const t = d3.select("body")
        .append("table")
        .style("margin", "10px auto")
        .style("border-collapse", "collapse");

    t.append("tr")
        .append("td")
        .text("Total Sales: " + salesTotal)
        .style("padding", "6px 12px")
        .style("border", "1px solid #ccc")
        .style("background-color", "#fff")
        .style("border-radius", "4px")
        .style("font-weight", "bold");
}

// Load CSV using promises and convert values to numbers
d3.csv("data/MonthlySales.csv", d => ({
    month: +d.month,
    sales: +d.sales
})).then(data => {
    ds = data;
    buildBarChart();
}).catch(error => {
    console.error("Error loading CSV:", error);
});
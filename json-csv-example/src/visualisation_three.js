import * as d3 from "d3";

const h = 100;       // height of SVG
const w = 500;       // width of SVG
const padding = 5;

// Select the existing SVG for the third visualization
const svg = d3.select("#viz3")
    .attr("width", w)
    .attr("height", h);

let ds;           // dataset
let metrics = [];

// Function to build heatmap
function buildHeatMap() {
    const cellWidth = w / ds.length - padding;
    const maxSales = d3.max(ds, d => d.sales);

    // Color scale: low sales = light, high sales = dark
    const colorScale = d3.scaleSequential()
        .domain([0, maxSales])
        .interpolator(d3.interpolateOranges);

    // Draw heatmap rectangles
    svg.selectAll("rect")
        .data(ds)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (cellWidth + padding))
        .attr("y", 0)
        .attr("width", cellWidth)
        .attr("height", h)
        .attr("fill", d => colorScale(d.sales));

    // Add sales labels inside rectangles
    svg.selectAll("text")
        .data(ds)
        .enter()
        .append("text")
        .text(d => d.sales)
        .attr("x", (d, i) => i * (cellWidth + padding) + cellWidth / 2)
        .attr("y", h / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10px")
        .attr("fill", d => d.sales > maxSales / 2 ? "#fff" : "#333");
}

// Function to calculate and show metrics
function showTotals() {
    const salesTotal = d3.sum(ds, d => d.sales);
    const salesAvg = salesTotal / ds.length;

    metrics = [`Sales Total: ${salesTotal}`, `Sales Avg: ${salesAvg.toFixed(2)}`];

    const t = d3.select("body")
        .append("table")
        .style("margin", "20px auto")
        .style("border-collapse", "collapse");

    t.selectAll("tr")
        .data(metrics)
        .enter()
        .append("tr")
        .append("td")
        .text(d => d)
        .style("padding", "6px 12px")
        .style("border", "1px solid #ccc")
        .style("background-color", "#fff")
        .style("border-radius", "4px")
        .style("font-weight", "bold");
}

// Load CSV
d3.csv("data/MonthlySales.csv", d => ({
    month: +d.month,
    sales: +d.sales
})).then(data => {
    ds = data;
    buildHeatMap();
    showTotals();
}).catch(error => console.error("Error loading CSV:", error));
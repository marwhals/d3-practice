import * as d3 from "d3";

const h = 350;
const w = 400;

const monthlySales = [
    { month: 10, sales: 100 },
    { month: 20, sales: 130 },
    { month: 30, sales: 250 },
    { month: 40, sales: 300 },
    { month: 50, sales: 265 },
    { month: 60, sales: 225 },
    { month: 70, sales: 180 },
    { month: 80, sales: 120 },
    { month: 90, sales: 145 },
    { month: 100, sales: 130 }
];

const lineFun = d3.line()
    .x(d => d.month * 3)
    .y(d => h - d.sales)
    .curve(d3.curveLinear);

const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

svg.append("path")
    .attr("d", lineFun(monthlySales))
    .attr("stroke", "purple")
    .attr("stroke-width", 2)
    .attr("fill", "none");

svg.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text(d => d.sales)
    .attr("x", d => (d.month * 3) - 25)
    .attr("y", d => h - d.sales)
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .attr("fill", "#666666")
    .attr("text-anchor", "start")
    .attr("dy", ".35em")
    .attr("font-weight", (d, i) =>
        (i === 0 || i === monthlySales.length - 1) ? "bold" : "normal"
    );
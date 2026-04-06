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

// "KPI" color
function salesKPI(d) {
    return d >= 250 ? "#33CC66" : "#666666";
}

// create SVG
const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// function for showing labels
function showMinMax(ds, col, val, type) {
    const max = d3.max(ds, d => d[col]);
    const min = d3.min(ds, d => d[col]);

    if (type === "minmax" && (val === max || val === min)) {
        return val;
    } else if (type === "all") {
        return val;
    }
    return "";
}

// add dots
svg.selectAll("circle")
    .data(monthlySales)
    .enter()
    .append("circle")
    .attr("cx", d => d.month * 3)
    .attr("cy", d => h - d.sales)
    .attr("r", 5)
    .attr("fill", d => salesKPI(d.sales));

// add labels
svg.selectAll("text")
    .data(monthlySales)
    .enter()
    .append("text")
    .text(d => showMinMax(monthlySales, "sales", d.sales, "minmax"))
    .attr("x", d => (d.month * 3) - 25)
    .attr("y", d => h - d.sales)
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .attr("fill", "#666666")
    .attr("text-anchor", "start");
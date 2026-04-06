import * as d3 from "d3";

var w = 300;
var h = 300;
var padding = 2;
var dataset = [5, 6, 12, 23, 32, 41, 33, 36, 28]
var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)

function colorPicker(v) {
    if (v <= 20) {return "#666666"; }
    else if (v > 20) {return "#FF0033"; }
}

// TODO find out how to avoid method chaining
// Chart
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return i * (w / dataset.length);
    })
    .attr("y", function (d) {
        return h - (d * 4);
    })
    .attr("width", w / dataset.length - padding)
    .attr("height", function (d) {
        return d * 4;
    })
    .attr("fill", function (d) {
        return colorPicker(d);
    });
// Labels on bars
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(d => d)
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => i * (w / dataset.length) + (w / dataset.length - padding) / 2)
    .attr("y", d => h - (d * 4) + 14)
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("fill", "#ffffff");
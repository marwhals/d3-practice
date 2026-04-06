import * as d3 from "d3";

// Width and height
const w = 500;
const h = 300;

// Projection + path
const projection = d3.geoAlbersUsa()
    .translate([w / 2, h / 2])
    .scale(700);

const path = d3.geoPath().projection(projection);

// SVG
const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Load GeoJSON (from public folder)
d3.json("/data/us.json").then(json => {

    // Draw states
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#666666")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

    // Load cities / sales data
    d3.csv("/data/sales-by-city.csv").then(data => {

        // Convert strings to numbers
        data.forEach(d => {
            d.lat = +d.lat;
            d.lon = +d.lon;
            d.sales = +d.sales;
        });

        // Draw circles, filtering out any invalid coordinates
        svg.selectAll("circle")
            .data(data.filter(d => projection([d.lon, d.lat]))) // <--- filter null coords
            .enter()
            .append("circle")
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("r", d => Math.sqrt(d.sales * 0.00005))
            .attr("fill", "red")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.7);

    }).catch(err => console.error("Error loading CSV:", err));

}).catch(err => console.error("Error loading GeoJSON:", err));
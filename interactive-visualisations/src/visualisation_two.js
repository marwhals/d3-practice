import * as d3 from "d3";

const h = 100;
const w = 350;
const padding = 20;

// Convert YYYYMMDD → Date
function getDate(d) {
    const str = d.toString();
    return new Date(
        +str.substr(0, 4),
        +str.substr(4, 2) - 1,
        +str.substr(6, 2)
    );
}

// Tick format helper
function getTickFormat(d) {
    return d === "3" ? d3.timeFormat("%x") : d3.timeFormat("%b");
}

// Build chart
function buildLine(ds) {
    const minDate = getDate(ds.monthlySales[0].month);
    const maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1].month);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Scales
    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(ds.monthlySales, d => d.sales)])
        .range([h - padding, 10]);

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis = d3.axisLeft(yScale).ticks(4);

    // Line generator
    const line = d3.line()
        .x(d => xScale(getDate(d.month)))
        .y(d => yScale(d.sales))
        .curve(d3.curveLinear);

    // use chart-two container
    const container = d3.select("#chart-two");

    const svg = container
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "svg-" + ds.category);

    // Axes
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis);

    // Line
    svg.append("path")
        .datum(ds.monthlySales)
        .attr("class", "path-" + ds.category)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Dots
    svg.selectAll(".circle-" + ds.category)
        .data(ds.monthlySales)
        .enter()
        .append("circle")
        .attr("class", "circle-" + ds.category)
        .attr("cx", d => xScale(getDate(d.month)))
        .attr("cy", d => yScale(d.sales))
        .attr("r", 4)
        .attr("fill", "#666666")
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

            tooltip.html(`<strong>Sales $${d.sales}K</strong>`)
                .style("left", event.pageX + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });
}

// Update chart
function updateLine(ds) {
    const minDate = getDate(ds.monthlySales[0].month);
    const maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1].month);

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(ds.monthlySales, d => d.sales)])
        .range([h - padding, 10]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b"))
        .ticks(ds.monthlySales.length - 1);

    const yAxis = d3.axisLeft(yScale).ticks(4);

    const line = d3.line()
        .x(d => xScale(getDate(d.month)))
        .y(d => yScale(d.sales))
        .curve(d3.curveLinear);

    const svg = d3.select("#svg-" + ds.category);

    svg.select(".x-axis")
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .call(yAxis);

    svg.select(".path-" + ds.category)
        .datum(ds.monthlySales)
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .attr("d", line);

    svg.selectAll(".circle-" + ds.category)
        .data(ds.monthlySales)
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .attr("cx", d => xScale(getDate(d.month)))
        .attr("cy", d => yScale(d.sales));
}

// Header (scoped to chart-two)
function showHeader(ds) {
    d3.select("#chart-two")
        .append("h1")
        .text(ds.category + " Sales (2013)");
}

// Load data
d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json")
    .then(data => {
        const decoded = JSON.parse(window.atob(data.content));

        decoded.contents.forEach(ds => {
            showHeader(ds);
            buildLine(ds);
        });

        d3.select("#date-option").on("change", function () {
            const sel = +d3.select(this).property("value");

            decoded.contents.forEach(ds => {
                const full = JSON.parse(window.atob(data.content))
                    .contents.find(d => d.category === ds.category);

                ds.monthlySales = full.monthlySales.slice(-sel);
                updateLine(ds);
            });
        });
    })
    .catch(console.error);
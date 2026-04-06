import * as d3 from "d3";

const h = 100;
const w = 350;
const padding = 20;

// Helper to convert YYYYMMDD to Date
function getDate(d) {
    const strDate = d.toString();
    const year = +strDate.substr(0, 4);
    const month = +strDate.substr(4, 2) - 1;
    const day = +strDate.substr(6, 2);
    return new Date(year, month, day);
}

// Build line chart for a dataset
function buildLine(ds) {
    const minDate = getDate(ds.monthlySales[0].month);
    const maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1].month);

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(ds.monthlySales, d => d.sales)])
        .range([h - padding, 10]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
    const yAxis = d3.axisLeft(yScale).ticks(4);

    const lineFun = d3.line()
        .x(d => xScale(getDate(d.month)))
        .y(d => yScale(d.sales))
        .curve(d3.curveLinear);

    // append to chart container instead of body
    const container = d3.select("#chart-one");

    const svg = container
        .append("svg")
        .attr("id", "svg-" + ds.category)
        .attr("width", w)
        .attr("height", h);

    // Axes
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .ease(d3.easeCubic)
        .attr("opacity", 1);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .ease(d3.easeCubic)
        .attr("opacity", 1);

    // Line
    svg.append("path")
        .datum(ds.monthlySales)
        .attr("class", "path-" + ds.category)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", lineFun)
        .attr("stroke-dasharray", function () { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function () { return this.getTotalLength(); })
        .transition()
        .duration(1500)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
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

    const lineFun = d3.line()
        .x(d => xScale(getDate(d.month)))
        .y(d => yScale(d.sales))
        .curve(d3.curveLinear);

    const svg = d3.select("#svg-" + ds.category);

    svg.select(".x-axis")
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .call(yAxis);

    svg.select(".path-" + ds.category)
        .datum(ds.monthlySales)
        .transition()
        .duration(1200)
        .ease(d3.easeCubic)
        .attr("d", lineFun);
}

// Header (also scoped to container)
function showHeader(ds) {
    d3.select("#chart-one")
        .append("h1")
        .text(ds.category + " Sales (2013)");
}

// Load data
d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json")
    .then(data => {
        const decodedData = JSON.parse(window.atob(data.content));

        decodedData.contents.forEach(ds => {
            showHeader(ds);
            buildLine(ds);
        });

        d3.select("#date-option").on("change", function () {
            const sel = +d3.select(this).property("value");

            decodedData.contents.forEach(ds => {
                const fullData = JSON.parse(window.atob(data.content))
                    .contents.find(d => d.category === ds.category);

                ds.monthlySales = fullData.monthlySales.slice(-sel);
                updateLine(ds);
            });
        });
    })
    .catch(err => console.error(err));
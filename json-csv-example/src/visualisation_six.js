import * as d3 from "d3";

const w = 700;
const h = 400;
const margin = { top: 40, right: 20, bottom: 50, left: 60 };

// Select SVG
const svg = d3.select("#viz6")
    .attr("width", w)
    .attr("height", h);

// Load JSON data
d3.json("data/MonthlySalesbyCategoryMultiple.json").then(data => {
    buildStackedBarChart(data.contents);
}).catch(err => console.error("Error loading data:", err));

function buildStackedBarChart(categories) {
    // Extract months
    const months = categories[0].monthlySales.map(d => {
        const year = +d.month.toString().slice(0, 4);
        const month = +d.month.toString().slice(4, 6) - 1;
        return new Date(year, month);
    });

    // Prepare data in stacked format
    const stackData = months.map((month, i) => {
        const obj = { month };
        categories.forEach(cat => {
            obj[cat.category] = cat.monthlySales[i].sales;
        });
        return obj;
    });

    const keys = categories.map(d => d.category);

    // Scales
    const xScale = d3.scaleBand()
        .domain(months)
        .range([margin.left, w - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackData, d => keys.reduce((sum, k) => sum + d[k], 0))])
        .range([h - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#6a5acd", "#20b2aa"]); // purple & teal

    // Stack generator
    const stack = d3.stack()
        .keys(keys);

    const series = stack(stackData);

    // Draw bars
    svg.selectAll("g.layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.month))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth());

    // Axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b")); // Month short name

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

    // Title
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Monthly Sales by Category");

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${w - margin.right - 120},${margin.top})`);

    keys.forEach((key, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        g.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(key));
        g.append("text").attr("x", 20).attr("y", 12).text(key);
    });
}
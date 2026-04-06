import * as d3 from "d3";

// SVG dimensions and margins
const width = 600;
const height = 200;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// Select the existing SVG
const svg = d3.select("#viz5")
    .attr("width", width)
    .attr("height", height);

// Load the JSON data
d3.json("data/MonthlySalesByCategory.json")
    .then(data => {
        const monthlySales = data.monthlySales;

        // Display the chart header
        d3.select("body")
            .append("h1")
            .text(`${data.category} Sales (2014)`);

        // X scale: convert month integers to dates
        const xScale = d3.scaleTime()
            .domain(d3.extent(monthlySales, d => new Date(
                d.month.toString().slice(0, 4),      // Year
                +d.month.toString().slice(4, 6) - 1 // Month (0-indexed)
            )))
            .range([margin.left, width - margin.right]);

        // Y scale: sales values
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(monthlySales, d => d.sales)]).nice()
            .range([height - margin.bottom, margin.top]);

        // Line generator with smooth curve
        const lineGenerator = d3.line()
            .x(d => xScale(new Date(
                d.month.toString().slice(0, 4),
                +d.month.toString().slice(4, 6) - 1
            )))
            .y(d => yScale(d.sales))
            .curve(d3.curveCatmullRom.alpha(0.5)); // smooth curve

        // Draw the line path
        svg.append("path")
            .datum(monthlySales)
            .attr("d", lineGenerator)
            .attr("stroke", "purple")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        // Draw circles at each data point
        svg.selectAll("circle")
            .data(monthlySales)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(new Date(
                d.month.toString().slice(0, 4),
                +d.month.toString().slice(4, 6) - 1
            )))
            .attr("cy", d => yScale(d.sales))
            .attr("r", 4)
            .attr("fill", "red");

        // Add X-axis (months)
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        // Add Y-axis (sales)
        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

    })
    .catch(error => console.error("Error loading JSON:", error));
import * as d3 from 'd3';

export function formatSales(d){
    const prefix = d3.formatPrefix(d);
    return prefix.scale(d).toFixed() + prefix.symbol;
}

export async function buildBarChart() {
    const data = await d3.csv('/data/2013-monthly-sales.csv', d => ({
        ...d,
        sales: +d.sales,
        profit: +d.profit
    }));

    const margin = {top:70, right:30, bottom:50, left:50};
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)]).nice()
        .range([height, 0]);

    const color = d3.scaleQuantize()
        .domain([d3.min(data, d => d.profit), d3.max(data, d => d.profit)])
        .range(['rgb(202,0,32)','rgb(244,165,130)','rgb(186,186,186)','rgb(64,64,64)']);

    // Clear bar chart container
    const container = d3.select("#barChart");
    container.selectAll("*").remove();

    const svg = container
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Local tooltip inside barChart container
    const tooltip = container
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0)
        .style("position","absolute")
        .style("pointer-events","none")
        .style("background","#fff")
        .style("padding","5px 10px")
        .style("border","1px solid #ccc")
        .style("border-radius","4px");

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform","rotate(-40)")
        .style("text-anchor","end");

    // Y Axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")));

    // Bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .attr("fill", d => color(d.profit))
        .on("mouseover", function(event,d){
            d3.select(this)
                .attr("stroke","#000")
                .attr("stroke-width",2)
                .attr("fill", d3.rgb(color(d.profit)).darker(0.5));

            tooltip
                .style("opacity",0.9)
                .html(`<strong>Sales:</strong> $${formatSales(d.sales)}<br/>
                       <strong>Profit:</strong> $${formatSales(d.profit)}<br/>
                       <strong>Ratio:</strong> ${(d.profit/d.sales).toFixed(2)}`)
                .style("left",(event.offsetX+15)+"px")
                .style("top",(event.offsetY-28)+"px");
        })
        .on("mousemove", function(event){
            tooltip
                .style("left",(event.offsetX+15)+"px")
                .style("top",(event.offsetY-28)+"px");
        })
        .on("mouseout", function(event,d){
            d3.select(this)
                .attr("stroke","transparent")
                .attr("fill", color(d.profit));

            tooltip.style("opacity",0);
        });

    // --- Add Profit Color Legend ---
    const legendWidth = 200;
    const legendHeight = 15;

    const legendSvg = svg.append("g")
        .attr("transform", `translate(0, -50)`); // position above chart

    const legendData = color.range().map(c => {
        const d = color.invertExtent(c);
        return {color: c, domain: d};
    });

    const legendScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.profit), d3.max(data, d => d.profit)])
        .range([0, legendWidth]);

    // Legend rects
    legendSvg.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", d => legendScale(d.domain[0]))
        .attr("y", 0)
        .attr("width", d => legendScale(d.domain[1]) - legendScale(d.domain[0]))
        .attr("height", legendHeight)
        .attr("fill", d => d.color)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.3);

    // Legend axis
    legendSvg.append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(d3.axisBottom(legendScale).ticks(4).tickFormat(d3.format("~s")));
}
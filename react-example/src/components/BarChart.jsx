import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart() {
    const ref = useRef();

    useEffect(() => {9
        const width = 500;
        const height = 250;

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        const x = d3.scaleBand()
            .domain(d3.range(10))
            .range([40, width - 20])
            .padding(0.2);

        const y = d3.scaleLinear()
            .range([height - 30, 20]);

        // Initial data
        let data = d3.range(10).map(() => Math.random() * 100);

        y.domain([0, 100]);

        const bars = svg.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (_, i) => x(i))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d))
            .attr("height", d => height - 30 - y(d))
            .attr("fill", "steelblue");

        // Update function
        const update = () => {
            data = d3.range(10).map(() => Math.random() * 100);
            bars.data(data)
                .transition()
                .duration(800)
                .ease(d3.easeCubicInOut)
                .attr("y", d => y(d))
                .attr("height", d => height - 30 - y(d));
        };

        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return <svg ref={ref}></svg>;
}
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Chart() {
    const ref = useRef();

    useEffect(() => {
        const width = 500;
        const height = 250;

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        // Scales
        const x = d3.scaleLinear()
            .domain([0, 10])
            .range([40, width - 20]);

        const y = d3.scaleLinear()
            .domain([-1.5, 1.5])
            .range([height - 30, 20]);

        // Line generator
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveBasis);

        // Generate sine data
        const generateData = (phase) => {
            return d3.range(0, 10, 0.1).map(xVal => ({
                x: xVal,
                y: Math.sin(xVal + phase)
            }));
        };

        let phase = 0;

        const path = svg.append("path")
            .datum(generateData(phase))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Animate wave movement
        const animate = () => {
            phase += 0.2;

            path.datum(generateData(phase))
                .transition()
                .duration(200)
                .ease(d3.easeLinear)
                .attr("d", line);
        };

        const interval = setInterval(animate, 200);

        return () => clearInterval(interval);

    }, []);

    return <svg ref={ref}></svg>;
}
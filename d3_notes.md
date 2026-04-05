# Notes on D3

---

## D3 Principles

Selections
```javascript
    d3.select("body") // selects the <body> html element
```

Append Operator
```javascript
d3.select("body")
.append("svg") // adds new <svg> object
.append("rect") // add a new <rect> html element
```

Style Operator
```javascript

d3.select("body")
    .append("svg") // add new <svg> objectd
    .append("rect") // add a new <rect> html element
    .attr("width", 50)
    .attr("height", 200)
    .style("fill", "blue")

```
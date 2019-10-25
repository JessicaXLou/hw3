'use-strict';

(function() {
    
    let data = ""; // keep data in global scope
    let svgContainer = ""; // keep SVG reference in global scope

    // load data and make histogram after window loads
  window.onload = function() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 70, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("dataEveryYear.csv", function(data) {

        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([91, 122])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // text label for the x axis
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                                (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("TOEFL Score (bin)");

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { return d["TOEFL Score"]; })
            .domain(x.domain())
            .thresholds(x.ticks(11)); // numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data.filter(function(d){return d["TOEFL Score"]}));

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, 70]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Count of TOEFL Score");    

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#69b3a2")

    });
  }
})();
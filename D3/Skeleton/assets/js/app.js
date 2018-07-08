// D3 Scatterplot Assignment
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//var circles = svg.selectAll("g circles").data(censusData).enter();

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.0
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty %:";
    var label1 = "Obesity %:";
  }
  else {
    var label = "Smoking %:";
    var label1 = "Obesity %:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${label1} ${d.obesity}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Load CSV data
d3.csv("../data/data.csv", function(error, censusData) {
    if (error) return console.warn(error);
// open terminal CTRL ` 
// python -m http.server  


// parse data
censusData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.smokes = +data.smokes;
  data.obesity = +data.obesity;
});
    //+ to convert to a numerical value, simmilarly to parseInt, that parses a string argument and returns an integer

 // xLinearScale function above csv import
 //var c20 = d3.scale.category20();
 var xLinearScale = xScale(censusData, chosenXAxis);

 // Create y scale function
 var yLinearScale = d3.scaleLinear()
   .domain([0, d3.max(censusData, d => d.obesity)])
   .range([height, 0]);

 // Create initial axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 // append x axis
 var xAxis = chartGroup.append("g")
   .classed("x-axis", true)
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);

 // append y axis
 chartGroup.append("g")
   .call(leftAxis);

 // append initial circles
 
 var circlesGroup = chartGroup.selectAll("circle")
   .data(censusData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[chosenXAxis]))
   .attr("cy", d => yLinearScale(d.obesity))
   .attr("r", 10)
   .attr("fill", "lightblue")
   //.attr('fill',function (d,i) { return c20(i); })
   //  .attr("fill", function(d,i) { return colores_google(i); } );
   .attr("stroke", "black")
   .attr('stroke-width',1)
   .attr("opacity", ".5")
   //.append("tspan")          
   //.text(function(d){return d.abbr});

 // Create group for  2 x- axis labels
 var labelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${width / 2}, ${height + 20})`);

 var povertyLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 20)
   .attr("value", "poverty") // value to grab for event listener
   .classed("active", true)
   .text("In Poverty %");

 var smokeLabel = labelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 40)
   .attr("value", "smokes") // value to grab for event listener
   .classed("inactive", true)
   .text("Smokers %");

 // append y axis
 chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .classed("axis-text", true)
   .text("Obesity %");

 // updateToolTip function above csv import
 var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

 // x axis labels event listener
 labelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(censusData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenXAxis === "poverty") {
         povertyLabel
           .classed("active", true)
           .classed("inactive", false);
         smokeLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else {
         povertyLabel
           .classed("active", false)
           .classed("inactive", true);
         smokeLabel
           .classed("active", true)
           .classed("inactive", false);
       }
     }
   });
});

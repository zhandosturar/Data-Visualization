var margin = 200;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;

svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",50)
.attr("y",50)
.attr("class","title")
.text("Прирост населения Республики Казахстан");

svg.append("text")
    .attr("x", 100)
    .attr("y", 450)
    .attr("class", "info")
    .text("Статистика");

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,100)");

var data = [
    { year: 2010, val: 13.6, births: 367752 ,deceased: 145875},
    { year: 2011, val: 13.8, births: 372544 ,deceased: 144213},
    { year: 2012, val: 14.1, births: 379121 ,deceased: 141220},
    { year: 2013, val: 14.7, births: 393421 ,deceased: 137630},
    { year: 2014, val: 15.5, births: 401066 ,deceased: 132236},
    { year: 2016, val: 15.6, births: 400640 ,deceased: 131373},
    { year: 2017, val: 14.4, births: 390520 ,deceased: 130033},
    { year: 2019, val: 14.6, births: 403064 ,deceased: 133489},
];

xScale.domain(data.map(function(d) { return d.year;}));
yScale.domain([0,d3.max(data, function(d) {return d.val;})]);

g.append("g")
.attr("transform","translate(0,"+height+")")
.call(d3.axisBottom(xScale));


g.append("g")
.call(d3.axisLeft(yScale));

function onMouseOver(d,i) {
  d3.select(this)
    .attr('class','highlight');

  d3.select('.info')
  .text(i.year + " году кол-во родившихся: " + i.births + "  кол-во умерших: " + i.deceased);

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth()+5)
  .attr("y", (d)=>yScale(d.val)-10)
  .attr("height", (d)=>height-yScale(d.val)+10);

}

function onMouseOut(d,i) {
  d3.select(this)
  .attr('class','bar');

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth())
  .attr("y", (d)=>yScale(d.val))
  .attr("height", (d)=>height-yScale(d.val));
}


g.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class","bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", (d)=>xScale(d.year))
.attr("y", (d)=>yScale(d.val))
.attr("width", xScale.bandwidth())
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay((d,i)=>i*50)
.attr("height", (d)=>height-yScale(d.val));

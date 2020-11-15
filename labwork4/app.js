const width = 1440;
const height = 1536;
var xScale = d3.scaleLinear().range([0,width]);
var yScale = d3.scaleLinear().range([0,height]);

var tip = d3.tip().attr("class","d3-tip").html((d)=>d);

var svg = d3.select("svg");
svg.attr("width",width);
svg.attr("height",height);
svg.attr("transform",'translate(100,50)');

svg.call(tip);

d3.json("data.json").then((data)=>{
  console.log(data);
  var maxYScale = d3.max(
    data.map((d)=>d.length)
  );
  console.log("maxYScale",maxYScale);
  xScale.domain([0,data.length])
  yScale.domain([0,maxYScale]);

  links = []
  dict = {}
  for(let i = 0; i<data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
          let key = data[i][j]
          if (key in dict) {
            dict[key] += 1
          } else {
            dict[key] = 1
          }
        }
  }

  arr = []
  for(let i = 0; i<data.length; i++) {
    var d = {}
    for(let j = 0; j<data[i].length; j++) {
      var k = data[i][j]
      d[k] = dict[k]
    }
    var items = Object.keys(d).map(function(key) {
      return [key, d[key]];});
    items.sort(function(first, second) {
      return second[1] - first[1];});
    var a = []
    for(let m = 0; m<items.length; m++) {
      a.push(items[m][0])
    }
    arr.push(a)
  }

  for(let i = 0; i<arr.length-1; i++) {
    for(let j = 0; j < arr[i].length; j++) {
      for(let k = 0; k < arr[i+1].length; k++) {
        if(arr[i][j]==arr[i+1][k]) {
          links.push([
            [xScale(i),yScale(j)],
            [xScale(i+1),yScale(k)]
          ]);
        }
      }
    }
  }




  var sozyvs = svg
  .selectAll("g")
  .data(arr)
  .enter()
  .append("g")
  .attr("class","sozyv")
  .attr("transform",(d,i)=>`translate(${xScale(i)},0)`)


  function onmouseout(d,i,e) {
    d3.select(this)
    .attr('class',"member");
    tip.hide();
  }

  function onmouseover(d,i,e) {
    d3.select(this)
    .attr('class',"hl");
    tip.show(d + '<br>Количество созывов : ' + dict[d], e[i]);
  }

  sozyvs
  .selectAll("rect")
  .data((d,i)=>d)
  .enter()
  .append("rect")
  .attr("class","member")
  .attr("y", (d,j)=>yScale(j))
  .attr("x",0)
  .attr("width",5)
  .attr("height",5)
  .attr("name",(d,j)=>d)
  .on("mouseover",onmouseover)
  .on("mouseout",onmouseout)

  var lineGenerator = d3.line().curve(d3.curveCardinal);

  svg.selectAll("path")
  .data(links)
  .enter()
  .append('path')
  .attr("d",(d,i)=>lineGenerator(d));
});

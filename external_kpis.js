function makeDeltimeDataset(json) {
    var data = [];
    var rows = json["rows"];
    //console.log(rows);
    for (var i = 0; i < rows.length; i++) {
        //console.log("i: " + i);
        var ka = rows[i]["key"];
        var k = ka[0];
        if(k == null) { continue; }
        var v = rows[i]["value"];
        var dp = new Object;
        dp["key"] = k;
        dp["value"] = v;
        data.push(dp);
    }
    return data.sort(sortCats);
}

function makeReadsDataset(json, startDate, filter) {
    var rows = json.rows;
    var values = [];
    var dformat = d3.time.format("%y%m%d");
    var startDateStr;
    if (startDate) {
        startDateStr = dformat(startDate);
        //console.log("start date: " + startDateStr);
    }
    for(var i = 0; i < rows.length; i++) {
        var mode = rows[i]["key"][0];
        var fc_id= rows[i]["key"][1];
        var date = fc_id.split("_")[0];
        
        if(startDateStr != undefined && date < startDateStr) {
            continue;
        }
        if(filter != undefined) {
            if (mode != filter) { continue; }
        }
        //console.log("mode: " + mode);
        var val = rows[i]["value"];
        //if(val != null) { values.push(val); }
        if(val != null) { values.push(val/1e6); }
    }
    return values;
}
var sortCats = function (a, b) {
    var order = [];
    order["0-6 w"] = 1;
    order["6-12 w"] = 2;
    order["12-24 w"] = 3;
    order["24-52 w"] = 4;
    //if(order[a.value] < order[b.value]) {
    //	return a;
    //} else {
    //	return b;
    //}
    return order[a.key] - order[b.key];
}

function drawDelTimes(dataset) {
    var w = 300;
    var h = 180;

    var outerRadius = w / 2;
    //var innerRadius = 0;
    var innerRadius = w / 10;
    var startA = - Math.PI/2;
    var endA = Math.PI/2
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
    
    var pie = d3.layout.pie()
                .value(function(d) {
                    return d.value;
                })
                .sort(null)
                //.sort(sortCats) // don't sort here but in the dataset generation function
                .startAngle(startA)
                .endAngle(endA)
                ;
    
    
    //Easy colors accessible via a 10-step ordinal scale
    //var color = d3.scale.category10();
    var color = d3.scale.category20();
    //var color = d3.scale.category20b();
    //var color = d3.scale.category20c();
    
    //Create SVG element
    //var svg = d3.select("body")
    var svg = d3.select("#delivery_times")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    //Set up groups
    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset))
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);
    
    //Labels
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            //return d.value;
            //return d.data.key + ": " + d.value;
            return d.data.key;
        });

    // Add a magnitude value to the larger arcs, translated to the arc centroid.
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      //.attr("dy", ".35em")
      .attr("dy", "1.1em")
      .attr("text-anchor", "middle")
      //.attr("text-anchor", "start")
      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius; // Set Outer Coordinate
        d.innerRadius = outerRadius/2; // Set Inner Coordinate
        //return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        return "translate(" + (arc.centroid(d)) + ")";
      })
      .style("fill", "White")
      .style("font", "bold 12px Arial")
      .text(function(d) { return "(" + d.data.value + ")"; });
    //// Computes the angle of an arc, converting from radians to degrees.
    //function angle(d) {
    //  var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    //  return a > 90 ? a - 180 : a;
    //}

}

function drawApplProj(dataset) {
    var w = 400;
    var h = 300;
    padding = 150;
    
        
    //var outerRadius = w / 2;
    var outerRadius = (w - padding) / 2;
    var innerRadius = 0;
    var labelr = outerRadius + 10;
    //var innerRadius = 50;
    var startA = 0;
    var endA = Math.PI * 2;
    //var startA = - Math.PI/2;
    //var endA = Math.PI/2;
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
    
    var pie = d3.layout.pie()
                .value(function(d) {
                    return d.value;
                })
                .sort(null)
                .startAngle(startA)
                .endAngle(endA)
                ;
    
    
    //Easy colors accessible via a 10-step ordinal scale
    //var color = d3.scale.category10();
    var color = d3.scale.category20();
    //var color = d3.scale.category20b();
    //var color = d3.scale.category20c();
    
    //Create SVG element
    //var svg = d3.select("body")
    var svg = d3.select("#application_projects")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    //Set up groups
    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset))
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  //.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
                  .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.2*outerRadius + ")")
                  ;
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);
    
    //Labels
    //arcs.append("text")
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
        //.attr("transform", function(d) {
        //	return "translate(" + (arc.centroid(d) + outerRadius) + ")";
        //})					
        .attr("transform", function(d) {
            var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
            (y/h * labelr) +  ")"; 
        })
        //.attr("text-anchor", "middle")
        //.attr("text-anchor", "start")
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .attr("style", "fill: black")
        .text(function(d) {
            //return d.value;
            //return d.data.key + ": " + d.value;
            return d.data.key;
        });
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      //.attr("dy", "1.1em")
      .attr("text-anchor", "middle")
      //.attr("text-anchor", "start")
      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius; // Set Outer Coordinate
        d.innerRadius = outerRadius/2; // Set Inner Coordinate
        //return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        return "translate(" + (arc.centroid(d)) + ")";
      })
      .style("fill", "White")
      .style("font", "bold 12px Arial")
      //.style("font", "12px Arial")
      .text(function(d) { return d.data.value; });

}

function drawApplSample(dataset) {
    var w = 500;
    var h = 300;
    padding = 250;
    
         
    //var outerRadius = w / 2;
    var outerRadius = (w - padding) / 2;
    var innerRadius = 0;
    var labelr = outerRadius + 10;
    //var innerRadius = 50;
    var startA = 0;
    var endA = Math.PI * 2;
    //var startA = - Math.PI/2;
    //var endA = Math.PI/2;
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
    
    var pie = d3.layout.pie()
                .value(function(d) {
                    return d.value;
                })
                .sort(null)
                .startAngle(startA)
                .endAngle(endA)
                ;
    
    
    //Easy colors accessible via a 10-step ordinal scale
    //var color = d3.scale.category10();
    var color = d3.scale.category20();
    //var color = d3.scale.category20b();
    //var color = d3.scale.category20c();

    //Create SVG element
    //var svg = d3.select("body")
    var svg = d3.select("#application_samples")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    
    //Set up groups
    var arcs = svg.selectAll("g.arc")
                  .data(pie(dataset))
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  //.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
                  .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.2*outerRadius + ")")
                  ;
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);
    
    //Labels
    //arcs.append("text")
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .15; }).append("svg:text")
        //.attr("transform", function(d) {
        //	return "translate(" + (arc.centroid(d) + outerRadius) + ")";
        //})					
        .attr("transform", function(d) {
            var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * labelr) +  ',' +
            (y/h * labelr) +  ")"; 
        })
        //.attr("text-anchor", "middle")
        //.attr("text-anchor", "start")
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .attr("style", "fill: black")
        .text(function(d) {
            //return d.value;
            //return d.data.key + ": " + d.value;
            return d.data.key;
        });

    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
      .attr("dy", ".35em")
      //.attr("dy", "1.1em")
      .attr("text-anchor", "middle")
      //.attr("text-anchor", "start")
      //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = outerRadius; // Set Outer Coordinate
        //d.innerRadius = outerRadius/2; // Set Inner Coordinate
        d.innerRadius = outerRadius/3; // Set Inner Coordinate
        //return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        return "translate(" + (arc.centroid(d)) + ")";
      })
      .style("fill", "White")
      .style("font", "bold 12px Arial")
      //.style("font", "12px Arial")
      .text(function(d) { return d.data.value; });
}
function drawReads(values, divID) {
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        //width = 960 - margin.left - margin.right,
        //height = 500 - margin.top - margin.bottom
        width = 400 - margin.left - margin.right,
        height = 180 - margin.top - margin.bottom
        ;
    var formatCount = d3.format(",.0f");
    
    var max = d3.max(values);
    var min = d3.min(values);
    var domainRange = max - min;
    var domainPadding = domainRange / 10;
    //console.log("min - 10e6: " + (min - 10000000));
    
    var x = d3.scale.linear()
        //.domain([0, 1])
        //.domain([0, 3e8])
        //.domain([0, (max + 30e6)])
        //.domain([0, (max + 10)])
        //.domain([(min - 20), (max + 20)])
        .domain([(min - domainPadding), (max + domainPadding)])
        .range([0, width]);
    
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        //.bins(x.ticks(20))
        .bins(x.ticks(14))
        (values);
    console.log(data);
    
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    //var svg = d3.select("body").append("svg")
    //var svg = d3.select("#reads_per_lane").append("svg")
    var svg = d3.select("#" + divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    
    var barWidth = (width - data.length) / (data.length + 2); // a bit ugly. divide the plot width (minus some space per bar)/with the number of bars + 1
    bar.append("rect")
        .attr("x", 1)
        //.attr("width", x(data[0].dx) - 1)
        //.attr("width", x(data[0].x  + data[0].dx) - 4)
        .attr("width", barWidth)
        .attr("height", function(d) { return height - y(d.y); });
    
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (barWidth / 2) + 1)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        //.attr("transform", "rotate(-90)")
        .attr("y", height +  margin.bottom)
        .attr("x", width)
        .attr("class", "axis_label")
        .text("reads (millions)");
    // x axis label
    svg.append("text")
        //.attr("transform", "rotate(-90)")
        .attr("y", margin.top)
        .attr("x", margin.left)
        .attr("class", "axis_label")
        .text("# lanes");
            
}
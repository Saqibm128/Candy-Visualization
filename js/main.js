var svg = d3.select('svg');
var height = svg.attr('height');
var width = svg.attr('width');

function cleanData(string) {
  if (string == "") {
    return "UNKNOWN";
  } else {
    return string;
  }
}

function candyBins(dataset, candy) {
  var bin = [];
  var keys = [];
  for (var i = 0; i < dataset.length; i++) {
    var datum = dataset[i][candy];
    if (keys.indexOf(datum) >= 0) {
      for (var j = 0; j < bin.length; j++) {
        if (bin[j].key == datum) {
          bin[j].values.push(dataset[i]);
        }
      }
    } else {
      bin.push({
        key: datum,
        values: [dataset[i]]
      });
      keys.push(datum);
    }
  }
  return bin;
}

d3.csv('./data/candy.csv',
  function(row) {
    cleaned = {}
    Object.keys(row).forEach(function(keyName){
      if (keyName == "Q4_AGE") {
        cleaned[keyName] = +row[keyName]; //cleanData will return string for numeric age, TODO: is it ok if we treat age as numeric or can we do ordinal if needed?
      } else {
      cleaned[keyName] = cleanData(row[keyName]);
    }
  });
    return cleaned;
  },
  function(error, dataset) {
    if (error) {
      console.error('Error while loading dataset.');
      console.error(error);
      return;
    }

    //DEMOGRAPHICS
    var goingOut = candyBins(dataset, 'Q1_GOING_OUT');
    var gender = candyBins(dataset, 'Q2_GENDER');
    var xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 3 * width / 4])
    var xAxis = d3.axisBottom(xScale).ticks(8);
    var ageHisto = d3.histogram()
      .domain([0, 100])
      .thresholds(xScale.ticks(80))
      .value(function(d) {
        return d.Q3_AGE;
      })
    const age = ageHisto(dataset).filter(d => d.length > 0)
    //var age = candyBins(dataset, 'Q3_AGE');
    var country = candyBins(dataset, 'Q4_COUNTRY');
    var provinceState = candyBins(dataset, 'Q5_STATE_PROVINCE_COUNTY_ETC');
    var candyList = Object.keys(dataset).map(function(keyName) {
      return candyBins(dataset, keyName)
    });
    // //chart 1
    //     var yScale = d3.scaleLinear()
    //         .domain([100,0])
    //         .range([0,3*height/4])
    //     var yAxis = d3.axisLeft(yScale).ticks(8);
    //     var chart = svg.append('g').attr('class', 'chart').attr('transform','translate('+width/4+','+height/8+')');
    //     chart.append('g')
    //         .attr('class', 'x-axis')
    //         .call(yAxis);
    //     var candy = chart.selectAll("dots")
    //         .data(candyList)
    //         .enter()
    //     candy.append("circle")
    //         .attr('stroke', "#0000ff")
    //         .attr("cx", function (d, i) {return width/3-8*i;})
    //         .attr("cy", function (d, i) {
    //             var joy = 0;
    //             var total = 0;
    //             for (var j=0; j<d.length; j++) {
    //                 if(d[j].key=="JOY") {
    //                     joy = d[j].values.length;
    //                 }
    //                 total = total+d[j].values.length;
    //             }
    //             return yScale(joy/total*100);
    //         })
    //         .attr("r", function (d, i) {
    //             var joy = 0;
    //             for (var j=0; j<d.length; j++) {
    //                 if(d[j].key=="JOY") {
    //                     joy = d[j].values.length;
    //                 }
    //             }
    //             return joy/50;
    //         })
    //         .on("mouseover", function() {
    //             d3.select(this).attr('r',40);
    //         })
    //         .on("mouseout", function() {
    //             d3.select(this).attr('r',function (d, i) {
    //                 var joy = 0;
    //                 for (var j=0; j<d.length; j++) {
    //                     if(d[j].key=="JOY") {
    //                         joy = d[j].values.length;
    //                     }
    //                 }
    //                 return joy/50;
    //             });
    //         });
    //chart 1
    chartScales = {
      x: 'age'
    };
    var yScale = d3.scaleLinear()
      .domain([100, 0])
      .range([0, 3 * height / 4])
    var yAxis = d3.axisLeft(yScale).ticks(8);
    var chart = svg.append('g').attr('class', 'chart').attr('transform', 'translate(' + width / 8 + ',' + height / 8 + ')');
    chart.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + 3 * height / 4 + ')')
      .call(xAxis);
    chart.selectAll('ylines')
      .data([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', function(d) {
        return yScale(d)
      })
      .attr('x2', 3 * width / 4)
      .attr('y2', function(d) {
        return yScale(d)
      })
      .style("stroke", "#555")
      .style("opacity", '.5')
    for (var j = 0; j < age.length; j++) {
      var data = age[j].sort(function(a, b) {
        if (a.Q2_GENDER == b.Q2_GENDER) {
          return 0;
        } else if (a.Q2_GENDER == 'Male') {
          return 1;
        } else if (b.Q2_GENDER == 'Male') {
          return -1;
        } else if (a.Q2_GENDER == 'Female') {
          return 1;
        } else {
          return -1;
        }
      });
      var people = chart.selectAll("people")
        .data(age[j])
        .enter()
      people.append("circle")
        .attr("cx", function(d, i) {
          return xScale(age[j].x0);
        })
        .attr("cy", function(d, i) {
          return yScale(age[j].length - i);
        })
        .attr("r", 2)
        .attr('fill', function(d, i) {
          if (d.Q2_GENDER == "Female") {
            return '#ff0081';
          } else if (d.Q2_GENDER == "Male") {
            return '#0d9fab';
          } else {
            return '#731982';
          }
        });
    }
  });
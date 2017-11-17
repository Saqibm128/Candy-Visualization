///////VARIABLES
var svg = d3.select('svg');
var height = svg.attr('height');
var width = svg.attr('width');
var people = svg.append('g').attr('class', 'people');
///CHART1
var chartG = svg.append('g')
  .attr('transform', 'translate(' + [width / 20, height / 10] + ')');
var gender = [];
var goingOut = [];
var age = [];
var country = [];
var state = [];
var xScaleLabels = [];

//////FUNCTIONS
function cleanData(string) {
  if (string == "") {
    return -1;
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

function ageBins(dataset) {
  var bin = [];
  var keys = [];
  for (var i = 0; i < dataset.length; i++) {
    var datum = dataset[i].Q3_AGE;
    var binNum = Math.floor(datum / 10);
    if (keys.indexOf(binNum) >= 0) {
      for (var j = 0; j < bin.length; j++) {
        if (bin[j].key == binNum) {
          bin[j].values.push(dataset[i]);
        }
      }
    } else {
      bin.push({
        key: binNum,
        values: [dataset[i]]
      });
      keys.push(binNum);
    }
  }
  return bin;
}

function onXScaleChanged() {
  var select = d3.select('#xScaleSelect').node();
  var value = select.options[select.selectedIndex].value;
  var currArray = [];
  if (value == "age") {
    currArray = age;
  } else if (value == "gender") {
    currArray = gender;
  } else if (value == "country") {
    currArray = country;
  } else {
    currArray = goingOut;
  }
  updateXLabel(currArray);
  updateChart(currArray);
}

function updateXLabel(currArray) {
  xScaleLabels = [];
  if (currArray == age) {
    for (var i = 0; i < currArray.length; i++) {
      if (currArray[i].key != -1) {
        xScaleLabels.push((currArray[i].key * 10) + ' - ' + ((currArray[i].key * 10) + 10));
      } else {
        xScaleLabels.push("Unknown");
      }
    }
  } else {
    for (var i = 0; i < currArray.length; i++) {
      xScaleLabels.push(currArray[i].key);
    }
  }
}

function defineXAxis(bins) {
  xScale = d3.scaleLinear()
    .domain([-1, bins.length])
    .range([0, 9 * width / 10])
  var numberTicks = 10;
  if (bins.length < 10) {
    numberTicks = bins.length;
  }
  return d3.axisBottom(xScale).ticks(numberTicks);
}

function defineSorter() {

}

function defineColor() {

}

//////DATASET
d3.csv('./data/candy.csv',
  function(row, i) {
    var cleaned = {}
    Object.keys(row).forEach(function(keyName) {
      cleaned[keyName] = cleanData(row[keyName])
      cleaned.identifier = i
    })
    return cleaned
  },
  function(error, dataset) {
    if (error) {
      console.error('Error while loading dataset.');
      console.error(error);
      return;
    }
    //CandyFrequencies
    var allbins = Object.keys(dataset).map(function(keyName) {
      return candyBins(dataset, keyName);
    })
    //DEMOGRAPHICS;
    gender = candyBins(dataset, 'Q2_GENDER');
    goingOut = candyBins(dataset, 'Q1_GOING_OUT');
    age = ageBins(dataset).sort(function(a, b) {
      return parseInt(a.key) > parseInt(b.key);
    });
    country = candyBins(dataset, 'Q4_COUNTRY').sort(function(a, b) {
      return a.key > b.key;
    }).sort(function(a, b) {
      return parseInt(a.values.length) < parseInt(b.values.length);
    });
    state = candyBins(dataset, 'Q5_STATE_PROVINCE_COUNTY_ETC');
    chartG.append('g')
      .attr('class', 'x')
      .append('g')
      .attr('class', 'x axis');

    updateChart(age);
  });

function updateChart(currArray) {
  updateXLabel(currArray);
  var yScale = d3.scaleLinear()
    .domain([60, 0])
    .range([0, 3 * height / 4])
  var yAxis = d3.axisLeft(yScale).ticks(8);
  var xAxis = defineXAxis(currArray);
  chartG.selectAll('g.x.axis')
    .attr('transform', 'translate(0,' + ((3 * height / 4) + 10) + ')')
    .call(xAxis);

  var rectWidth = 3;
  var binWidth = xScale(.8) - xScale(0);
  var num = Math.ceil(binWidth / (rectWidth + 2));

  var xlabel = chartG.select(".x").selectAll('.xLabels')
    .data(xScaleLabels);
    
  var enteredXlabel = xlabel.enter().append('text');
  xlabel.merge(enteredXlabel).attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('class', 'xLabels')
    .attr('y', ((3 * height / 4) + 24))
    .attr('font-size', '9')
    .attr('text-anchor', 'middle')
    .text(function(d) {
      return d;
    });
  xlabel.exit().remove();
  for (var j = 0; j < currArray.length; j++) {
    var ppl = chartG.selectAll(".people")
      .data(currArray[j].values, function(d) {
        return d.identifier;
      });
    var enteredPpl = ppl.enter()
    .append("rect")
    .attr("class", "people")
    .on("mouseover", function(d) {
      console.log(d);
      d3.select(this)
      .transition()
      .attr("width", rectWidth*3)
      .attr("height", rectWidth*3)
    })
    .on("mouseout", function(d) {
      d3.select(this)
      .transition()
      .attr("width", rectWidth)
      .attr("height", rectWidth)
    });
    ppl.merge(enteredPpl).transition().attr("x", function(d, i) {
        return xScale(j) - binWidth / 2 + ((rectWidth + 2) * (i % num));
      })
      .attr("y", function(d, i) {
        return yScale(Math.floor(i / num)) + 1;
      })
      .attr("width", (rectWidth))
      .attr("height", (rectWidth))
      .attr('fill', function(d, i) {
        return '#0000ff';
      });
  }
}
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
var yScale;
var num;
var rectWidth = 3;
var binWidth;
var fill = d3.scaleOrdinal(d3.schemeCategory10);
var currColors = [];
var currColorLabels = []
var sorter = 'NONE';
var currArray = [];
// Subcandy bar
var candyObject;
var totalLengthOfData;
var fullDataset;

var personTooltip = d3.tip()
  .attr("class", "person tooltip d3-tip")
  .offset([-12, 0])
  .html(function(d) {
    return "<table><thead><tr><td>Gender</td><td>Age</td><td>Country</td></tr></thead>" +
      "<tbody><tr><td>" + d.Q2_GENDER + "</td><td>" + d.Q3_AGE + "</td><td>" + d.Q4_COUNTRY + "</td></tr></tbody></table>";
  });
var candyTooltip = d3.tip()
  .attr("class", "candy tooltip d3-tip")
  .offset([-12, 0])
  .html(function(d) {
    console.log(d)
    return "<table><thead><tr><td>Candy Response</td><td>Perentage</td></tr></thead>" +
      "<tbody><tr><td>" + d.key + "</td><td>" + d.portion + "</td></tr></tbody></table>";
  });
svg.call(personTooltip)
svg.call(candyTooltip)

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
  updateChart();
}

function onColorChanged() {
  var select = d3.select('#colorSelect').node();
  var value = select.options[select.selectedIndex].value;
  if (value == "Q4_COUNTRY" || value == "Q3_AGE") {
    fill = d3.scaleOrdinal(d3.schemeCategory20);
  } else {
    fill = d3.scaleOrdinal(d3.schemeCategory10);
  }
  defineColor(value);
}

function onSortChanged() {
  var select = d3.select('#sortSelect').node();
  var value = select.options[select.selectedIndex].value;
  sorter = value;
  updateChart();
}

function updateXLabel(array) {
  xScaleLabels = [];

  if (array == age) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].key != -1) {
        xScaleLabels.push((array[i].key * 10) + ' - ' + ((array[i].key * 10) + 10));
      } else {
        xScaleLabels.push("Unknown");
      }
    }
  } else {
    for (var i = 0; i < array.length; i++) {
      if (array[i].key != -1) {
        xScaleLabels.push(array[i].key);
      } else {
        xScaleLabels.push("Unknown");
      }
    }
  }
  binWidth = xScale(.8) - xScale(0);
  num = Math.ceil(binWidth / (rectWidth + 2));
  yScale = d3.scaleLinear().domain([d3.max(array, function(d) {
      return d.values.length / num
    }), 0])
    .range([0, height * 3 / 4])
}

function defineXAxis(bins) {
  xScale = d3.scaleLinear()
    .domain([-.5, bins.length - .5])
    .range([0, 9 * width / 10])
  var numberTicks = 10;
  if (bins.length < 10) {
    numberTicks = bins.length;
  }
  return d3.axisBottom(xScale).ticks(numberTicks);
}

function defineSorter(a, b, type) {
  if (type == 'NONE') {
    return a.identifier > b.identifier;
  }
  if (type == 'Q2_GENDER') {
    if (a[type] == b[type]) {
      return 0;
    } else if (a[type] == 'Male') {
      return 1;
    } else if (b[type] == 'Male') {
      return -1;
    } else if (a[type] == 'Female') {
      return 1;
    } else if (b[type] == 'Female') {
      return -1;
    } else if (a[type] == 'Other') {
      return 1;
    } else if (b[type] == 'Other') {
      return -1;
    } else if (a[type] == "I'd rather not say") {
      return 1;
    } else {
      return -1;
    }
  }
  if (type == 'Q1_GOING_OUT') {
    if (a[type] == b[type]) {
      return 0;
    } else if (a[type] == 'Yes') {
      return 1;
    } else if (b[type] == 'Yes') {
      return -1;
    } else if (a[type] == 'No') {
      return 1;
    } else {
      return -1;
    }
  }
  if (type == 'Q3_AGE') {
    return parseInt(a[type]) - parseInt(b[type]);
  }
  if (type == 'Q4_COUNTRY') {
    if (a[type] == b[type]) {
      return 0;
    } else if (a[type] == 'Canada') {
      return 1;
    } else if (b[type] == 'Canada') {
      return -1;
    } else if (a[type] == 'Denmark') {
      return 1;
    } else if (b[type] == 'Denmark') {
      return -1;
    } else if (a[type] == 'Germany') {
      return 1;
    } else if (b[type] == 'Germany') {
      return -1;
    } else if (a[type] == 'Ireland') {
      return 1;
    } else if (b[type] == 'Ireland') {
      return -1;
    } else if (a[type] == 'Japan') {
      return 1;
    } else if (b[type] == 'Japan') {
      return -1;
    } else if (a[type] == 'Mexico') {
      return 1;
    } else if (b[type] == 'Mexico') {
      return -1;
    } else if (a[type] == 'Netherlands') {
      return 1;
    } else if (b[type] == 'Netherlands') {
      return -1;
    } else if (a[type] == 'Scotland') {
      return 1;
    } else if (b[type] == 'Scotland') {
      return -1;
    } else if (a[type] == 'United Kingdom') {
      return 1;
    } else if (b[type] == 'United Kingdom') {
      return -1;
    } else if (a[type] == 'United States') {
      return 1;
    } else {
      return -1;
    }
  }
  return a[type] > b[type];
}

function onCandyChanged() {
  var candyVarName = $("#candyOptions").val()
  var cummulative = 0; //Because d3.stack is hard to figure out
  var toUse = []
  candyObject[candyVarName].
  sort(function(a, b) {
    return a.key.localeCompare(b.key);
  }).
  forEach(function(d) {
    var key;
    if (d.key == -1) key = "No Response";
    else key = d.key
    toUse.push({
      "key": key,
      "portion": d.values.length / totalLengthOfData,
      "length": d.values.length,
      "cummulative": cummulative,
      "cummulativePortion": cummulative / totalLengthOfData,
      "original": d
    })
    cummulative += d.values.length;
  })

  var bar = d3.select("#candyBarGroup").selectAll(".bar.candy").data(toUse, function(d) {

    return d.key;
  })
  var enteredBar = bar.enter()
    .append("g")
  bar.merge(enteredBar).transition().attr("transform", function(d) {

      return "translate(" + String(d.cummulativePortion * width) + ", " + String(height - 25) + ")";
    })
    .attr("class", function(d) {
      return d.key + " bar candy"
    })
  enteredBar.append("rect")
    .attr("height", 25)
    .on("mouseover", function(d) {
      d3.selectAll("rect").attr("opacity", .5);
      d3.select(this).attr("opacity", 1)
      d.original.values.forEach(function(d) {
        d3.selectAll("#id" + String(d.identifier)).attr("opacity", 1);
      });
      candyTooltip.show(d);
    })
    .on("mouseout", function(d) {
      d3.selectAll("rect").attr("opacity", 1);
      candyTooltip.hide(d)
    })
    .on("dblclick", function(d) {
      var heldOntoVarName = $("#candyOptions").val()
      chartG.selectAll("*").remove()
      setup(false, d.original.values)
      $("#candyOptions").val(heldOntoVarName)
      onCandyChanged()
    })

  enteredBar.merge(bar).selectAll("rect").data(toUse,
      function(d) {
        return d.key;
      })
    .transition()
    .attr("width", function(d) {
      return d.portion * width;
    })
    .attr("fill", function(d) {
      if (d.key === "MEH") return "#FFBD33";
      else if (d.key === "DESPAIR") return "#C70039";
      else if (d.key === "JOY") return "#75FF33";
      else return "#FFFFFF"
    })


  enteredBar.append("text")
    .text(function(d) {
      if (d.key == -1) {
        return "No Response"
      }
      return d.key
    })
    .attr("y", 20)
  bar.exit().remove()
}

function defineColor(key) {
  currColors = [];
  currColorLabels = [];
  d3.selectAll('rect')
    .attr('fill', function(d, i) {
      if (key == "Q3_AGE") {
        var temp = Math.floor(parseInt(d[key]) / 10);
        if (currColors.indexOf(fill(temp)) == -1) {
          if (!isNaN(temp)) {
            currColors.push(fill(temp));
            currColorLabels.push(temp);
          }
        }
      } else {
        var temp = d[key];
        if (currColors.indexOf(fill(temp)) == -1) {
          if (temp != undefined) {
            currColors.push(fill(temp));
            currColorLabels.push(temp);
          }
        }
      }
      return fill(temp);
    })
  var colorLabel = chartG.selectAll('.colorLabel')
    .data(currColors);
  var enteredColor = colorLabel.enter().append('rect');
  colorLabel.merge(enteredColor)
    .attr('width', 15)
    .attr('height', 15)
    .attr('x', 2.2 * width / 3)
    .attr('class', 'colorLabel')
    .attr('y', function(d, i) {
      return 100 + (15 * i);
    })
    .attr('fill', function(d, i) {
      return d;
    });
  colorLabel.exit().remove();

  var colorLabelN = chartG.selectAll('.colorLabelN')
    .data(currColorLabels);
  var enteredColorn = colorLabelN.enter().append('text');
  colorLabelN.merge(enteredColorn)
    .attr('class', 'colorLabelN')
    .attr('x', (2.2 * width / 3) + 20)
    .attr('y', function(d, i) {
      return 113 + (15 * i);
    })
    .text(function(d, i) {
      var temp = d;
      if (temp < 0) {
        return 'Unknown';
      } else if (temp >= 0) {
        temp = (parseInt(temp) * 10) + ' - ' + (parseInt(temp) * 10 + 10);
      }
      return temp;
    });
  colorLabelN.exit().remove();
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
    setup(error, dataset);
    fullDataset = dataset;
  }
);

function setup(error, dataset) {
  if (error) {
    console.error('Error while loading dataset.');
    console.error(error);
    return;
  }
  chartG.selectAll('title').data(["CHART TITLE"]).enter().append('text').attr('x', width * .7).attr('y', -20).text(function(d) {
    return d;
  });
  totalLengthOfData = dataset.length;
  //CandyFrequencies and the pull down button setup
  var candyVarName = Object.keys(dataset[0]).slice(6, 54) // The location of the candy names
  var candyNames = candyVarName.map(function(d) {
    return {
      "varName": d,
      "real": d.substr(3).replace(new RegExp("_", "g"), " ")
    } // remove the Q6_ portion and any underscores
  })
  //Populate the select option for candy
  for (var i = 0; i < candyNames.length; i++) {
    var candyPullDown = d3.select("#candyOptions")
      .append("option")
      .text(candyNames[i].real)
      .attr("value", candyNames[i].varName)
  }
  $("#candyOptions").val(candyNames[0].varName)
  var allbins = Object.keys(dataset).map(function(keyName) {
    return candyBins(dataset, keyName);
  })
  //Populate the global candyObject with the data for candies
  candyObject = {}
  candyVarName.forEach(function(d) {
    candyObject[d] = candyBins(dataset, d);
  });
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

  document.getElementById('xScaleSelect').value = 'age';
  document.getElementById('colorSelect').value = 'NONE';
  document.getElementById('sortSelect').value = 'NONE';
  currArray = age;
  updateChart();
  defineColor('NONE');
  onColorChanged();
  onCandyChanged();
}

function updateChart() {

  var yAxis = d3.axisLeft(yScale).ticks(8);
  var xAxis = defineXAxis(currArray);
  updateXLabel(currArray);

  chartG.selectAll('g.x.axis')
    .attr('transform', 'translate(0,' + ((3 * height / 4) + 10) + ')')
    .call(xAxis);

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

  var count = chartG.select(".x").selectAll('.counters')
    .data(currArray);
  var enteredCount = count.enter().append('text');
  count.merge(enteredCount).attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('class', 'counters')
    .attr('y', ((3 * height / 4) + 50))
    .attr('font-size', '9')
    .attr('text-anchor', 'middle')
    .text(function(d) {
      if (d.values.length != 1) {
        return d.values.length + ' people';
      } else {
        return d.values.length + ' person';
      }
    });
  count.exit().remove();

  for (var j = 0; j < currArray.length; j++) {
    currArray[j].values.sort(function(a, b) {
      return defineSorter(a, b, sorter);
    });
    var ppl = chartG.selectAll(".people")
      .data(currArray[j].values, function(d) {
        return d.identifier;
      });
    var enteredPpl = ppl.enter()
      .append("rect")
      .attr("class", "people")
      .attr("id", function(d, i) {
        // Needs to start identifier with id, so id is id1234, etc.
        return "id" + String(d.identifier)
      })
      .on("mouseover", function(d) {
        personTooltip.show(d);
        d3.selectAll('.people')
          .transition()
          .attr('opacity', .5)
        d3.select(this)
          .transition()
          .attr("width", rectWidth * 3)
          .attr("height", rectWidth * 3)
          .attr('opacity', 1)
        d3.selectAll('.counters')
          .attr('opacity', .5)
      })
      .on("mouseout", function(d) {
        personTooltip.hide(d)
        d3.selectAll('.people')
          .attr('opacity', 1)
        d3.selectAll('.people')
          .transition()
          .attr("width", rectWidth)
          .attr("height", rectWidth)
        d3.selectAll('.counters')
          .attr('opacity', 1)
      });
    ppl.merge(enteredPpl).transition().attr("x", function(d, i) {
        return xScale(j) - binWidth / 2 + ((rectWidth + 2) * (i % num));
      })
      .attr("y", function(d, i) {
        return yScale(Math.floor(i / num));
      })
      .attr("width", (rectWidth))
      .attr("height", (rectWidth));
  }
}

$("#reset_graph").on("click", function() {
  chartG.selectAll("*").remove();
  setup(false, fullDataset);
})
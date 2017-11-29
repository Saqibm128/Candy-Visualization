///////VARIABLES
var svg = d3.select('svg');
var height = svg.attr('height');
var width = 710;//svg.attr('width');
///CHART1
var chart1 = svg.append('g')
  .attr('transform', 'translate(' + [width / 20, height / 10] + ')').attr("class","peopleG");
var chart2 = svg.append('g')
  .attr('transform', 'translate(' + [width+200, 20]+')').attr("class", "candybar");
var gender = [];
var goingOut = [];
var age = [];
var country = [];
var state = [];
var stackG = chart2.append('g').attr("class", "chart2");
var xScaleLabels = [];
var yScale;
var num;
var rectWidth = 3;
var binWidth;
var fill = d3.scaleOrdinal(d3.schemeCategory10);
var currColors = [];
var currColorLabels = [];
var sorter = 'NONE';
var currArray = [];
// Subcandy bar
var clicked = null;
var candyObject;
var totalLengthOfData;
var fullDataset;
var hide = .3;
var map;

var personTooltip = d3.tip()
  .attr("class", "person tooltip d3-tip")
  .offset([-20, 0])
  .html(function(d) {
    return "<table><thead><tr><td>Gender</td><td>Age</td><td>Country</td></tr></thead>" +
      "<tbody><tr><td>" + d.Q2_GENDER + "</td><td>" + d.Q3_AGE + "</td><td>" + d.Q4_COUNTRY + "</td></tr></tbody></table>";
  });
var candyTooltip = d3.tip()
  .attr("class", "candy tooltip d3-tip")
  .offset([-15, 0])
  .html(function(d) {
    if (d.key ==-1){
      return "<table><thead><tr><td>Candy Response</td><td>Perentage</td></tr></thead>" +
      "<tbody><tr><td>" + "No Response" + "</td><td>" + Math.round(d[0])+'%' + "</td></tr></tbody></table>";
    }
    return "<table><thead><tr><td>Candy Response</td><td>Perentage</td></tr></thead>" +
      "<tbody><tr><td>" + d.key + "</td><td>" + Math.round(d.values.length/d.total * 100)+'%' + "</td></tr></tbody></table>";
  });
var brushG;
var brush = d3.brushX()
  .extent([[0, 0],[.9 * width, height * (2.27) / 3]])
  .on("start", function(d){
    d3.selectAll(".people").classed("hidden", false);
    if (this != brushG) {
      // Clear the old brush
      brush.move(d3.select(brushG), null);
      brushG = this;
    }
  })
  .on("brush", function(d){
    d3.selectAll(".people").attr("opacity", hide)
    var toUpdate = []
    var e = d3.event.selection;
    if (e) {
      d.forEach(function(personData) {
        var personRect = d3.select("#id" + String(personData.identifier))
        if (e[0] < personRect.attr('x') && e[1] > personRect.attr('x')) {
          toUpdate.push(personData)
          personRect.attr("opacity", 1)
        }
      })
      createStackedBars(toUpdate)
    }
  })
  .on("end", function(d){
    d3.selectAll(".people").attr("opacity", hide)
    var toUpdate = []
    var e = d3.event.selection;
    if (e) {
      d.forEach(function(personData) {
        var personRect = d3.select("#id" + String(personData.identifier))
        if (e[0] < personRect.attr('x') && e[1] > personRect.attr('x')) {
          toUpdate.push(personData)
          personRect.attr("opacity", 1)
        }
      })
      createStackedBars(toUpdate)
    } else {
      d3.selectAll(".people").attr("opacity", 1)
      createStackedBars(fullDataset)
    }
  });
svg.call(personTooltip)
svg.call(candyTooltip)
chart1.call(brush);

//////FUNCTIONS

  //sorters
function sortDespair(a,b) {
  if (a.key == b.key) {
    return 0;
  } else if (a.key == "JOY") {
    return 1;
  } else if (b.key == "JOY") {
    return -1;
  } else if (a.key == "MEH") {
    return 1;
  } else {
    return -1;
  }
  return a.key>b.key;
}
function sortJoy(a,b) {
  if (a.key == b.key) {
    return 0;
  } else if (a.key == "JOY") {
    return 1;
  } else if (b.key == "JOY") {
    return -1;
  } else if (a.key == "MEH") {
    return 1;
  } else {
    return -1;
  }
  return a.key>b.key;
}
function sortMeh(a,b) {
  if (a.key == b.key) {
    return 0;
  } else if (a.key == "JOY") {
    return 1;
  } else if (b.key == "JOY") {
    return -1;
  } else if (a.key == "MEH") {
    return 1;
  } else {
    return -1;
  }
  return a.key>b.key;
}
function sortNoResponse(a,b) {
  if (a.key == b.key) {
    return 0;
  } else if (a.key == "JOY") {
    return 1;
  } else if (b.key == "JOY") {
    return -1;
  } else if (a.key == "MEH") {
    return 1;
  } else {
    return -1;
  }
  return a.key>b.key;
}


function cleanData(string) {
  if (string == "") {
    return -1;
  } else {
    return string;
  }
}

function candyBins(dataset, candy) {
  if ((dataset) == 'undefined' || dataset.length == 0) {
    dataset = fullDataset
  }
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

function mapUpdate(dataset) {
  var data_by_states = []
  for (var i = 1; i < 57; i++) {
    var fips = String(i);
    if (fips.length == 1) fips = "0" + fips; //weird fips encoding stuff
    data_by_states[i-1] = {"fips": fips, "count": String(0)} //initialize all as 0
  }
  candyBins(dataset, "fips").forEach(function(bin) {
    data_by_states[+bin.key-1] = {"fips":String(bin.key), "count":String(bin.values.length)}
  })
  d3.select('#map')
      .datum(data_by_states);
  map.data = data_by_states
  map.update(map);
}

function mapSetup(dataset) {
  d3.select("#map").selectAll("*").remove()
  map = d3.geomap.choropleth()
    .geofile('/data/USA.json')
    .projection(d3.geo.albersUsa)
    .column('count')
    .unitId('fips')
    .scale(650)
    .legend(true);
    map.height = height
    map.width = width
    var data_by_states = []
    for (var i = 1; i < 57; i++) {
      var fips = String(i);
      if (fips.length == 1) fips = "0" + fips; //weird fips encoding stuff
      data_by_states[i-1] = {"fips": fips, "count": String(0)} //initialize all as 0
    }
    candyBins(dataset, "fips").forEach(function(bin) {
      data_by_states[+bin.key-1] = {"fips":String(bin.key), "count":String(bin.values.length)}
    })
    d3.select('#map')
        .datum(data_by_states)
        .call(map.draw, map);
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
  if (select.options[select.length-1].value == 'Candy') {
    select.remove(select.length-1);
  }
  var value = select.options[select.selectedIndex].value;
  if (value == "Q4_COUNTRY" || value == "Q3_AGE") {
    fill = d3.scaleOrdinal(d3.schemeCategory20);
  } else {
    fill = d3.scaleOrdinal(d3.schemeCategory10);
  }
  if (clicked != null) {
    d3.select(clicked)
          .attr("fill", '#000000')
    clicked = null;
  }
  defineColor(value);
}

function onSortChanged() {
  var select = d3.select('#sortSelect').node();
  var value = select.options[select.selectedIndex].value;
  sorter = value;
  updateChart();
}

yScale2 = d3.scaleLinear()
    .domain([.5, 48])
    .range([9 * height / 10, 0])
xScale2 = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 4 * width / 10])
  var xAxis2 = d3.axisBottom(xScale2).ticks(1);
  chart2.append('g')
    .attr('transform', 'translate(0,'+(9 * height / 10)+')')
    .attr('class', 'x axis candy')
    .call(xAxis2);
function createStackedBars(dataset) {
  d3.selectAll(".candytext").remove(); //FIX THIS
  var candyVarName = Object.keys(dataset[0]).slice(7, 54) // The location of the candy names
  //Populate the global candyObject with the data for candies
  candyVarName.forEach(function(d) {
    candyObject[d] = candyBins(dataset, d);
    candyArr.push(candyBins(dataset, d));
    candyNames.push(d);
  });
  candyArr = Object.keys(candyObject)
    .map(function (name) {
      var accumulated = 0;
      toReturn = {'val':candyObject[name], 'key': name};
      toReturn.val.sort(function(a, b) {
        var comp = {"DESPAIR": 3, "MEH": 2, "JOY": 1}
        return comp[a.key] - comp[b.key]
      })
      var total = 0;
      toReturn.val.forEach(function(d) {
        total += d.values.length;
      })
      toReturn.total = total;
      toReturn.val.forEach(function(d) {
        d.cumm = accumulated;
        d.total = total;
        accumulated += d.values.length;
      })
      return toReturn;
    })
    .sort(function(a, b) {
      return a.val[0].values.length - b.val[0].values.length;
    })

  var bars = stackG.selectAll(".stackedBarsG").data(candyArr,
    function(d) {
      return d.key
    });
  var enteredBars = bars.enter().append("g").attr('class', 'stackedBarsG');
  enteredBars.merge(bars).transition().attr("transform", function(d, i) {
    return "translate(0," + String(yScale2(i + 1.5)) + ")"
  }).each(function(d) {
    var singleBar = d3.select(this).selectAll('.singleBar').data(d.val, function(d) {return d.key})
    var enteredBar = singleBar.enter().append("rect").attr("class", '.singleBar')
    d3.select(this).append("text").text(function(d) {
      return d.key.substr(3).replace(new RegExp("_", "g"), " ").replace("M M", "M&M");
    })
    .attr("transform", "translate(-150, 9)")
    .attr("class", "candytext")
    .attr("font-size", '12px')
    .on('mouseover', function(d){
      document.body.style.cursor = 'default'
      d3.select(this)
        .attr("fill", '#ff0000')
    })
    .on('mouseout', function(d){
      if (clicked!=this) {
        d3.select(this)
          .attr("fill", '#000000')
        }
    })
    .on('click', function(d){
      if (clicked!=null) {
        d3.select(clicked)
        .attr("fill", '#000000')
      } else {
        var select = d3.select('#colorSelect').node();
        var option = document.createElement("option");
        option.text = "Candy";
        select.add(option); 
        document.getElementById('colorSelect').value = 'Candy';
      }
      clicked = this;
      currColors = ["#33cd5f", "#ffc900", "#ef473a", "#387ef5"];
      currColorLabels = ["Joy", "Meh", "Despair", "No Response"];
      console.log(d)
      createColorLegend(currColors, currColorLabels, d.val.map(function (response) {
       return response.values
      }))
      var key = d.key
      d3.selectAll("rect.people")
        .attr('fill', function(d){
          if (d[key] === "MEH") return "#ffc900";
          else if (d[key] === "DESPAIR") return "#ef473a";
          else if (d[key] === "JOY") return "#33cd5f";
          else return "#387ef5";
       })
    })

    singleBar.merge(enteredBar).attr('x',
    function(d) {
      return d.cumm / d.total *  285
    })
      .attr('height', 9)
      .attr('y', 0)
      .attr('width', function(d) {
        return d.values.length / d.total * 285
      })
      .attr("fill", function(d) {
        if (d.key === "MEH") return "#ffc900";
        else if (d.key === "DESPAIR") return "#ef473a";
        else if (d.key === "JOY") return "#33cd5f";
        else return "#387ef5";
      })
      .on("mouseover", function(d) {
        d3.selectAll(".people").attr("opacity", hide);
        d3.select(this).attr("opacity", 1)
        d.values.forEach(function(d) {
          d3.selectAll("#id" + String(d.identifier)).attr("opacity", 1);
        });
        candyTooltip.show(d);
        mapUpdate(d.values);
      })
      .on("mouseout", function(d) {
        d3.selectAll("rect.people").attr("opacity", 1);
        candyTooltip.hide(d);
        mapUpdate(fullDataset);
      });
  })
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

function defineColor(key) {
  currColors = [];
  colorVarBin = []
  currColorLabels = [];
  d3.selectAll('rect.people')
    .attr('fill', function(d, i) {
      if (key == "Q3_AGE") {
        var temp = Math.floor(parseInt(d[key]) / 10);
        if (currColors.indexOf(fill(temp)) == -1) {
          if (!isNaN(temp)) {
            currColors.push(fill(temp))
            colorVarBin.push([d])
            currColorLabels.push(temp);
          }
        } else {
          colorVarBin[currColorLabels.indexOf(temp)].push(d)
        }
      } else {
        var temp = d[key];
        if (currColors.indexOf(fill(temp)) == -1) {
          if (temp != undefined) {
            currColors.push(fill(temp));
            colorVarBin.push([d])
            currColorLabels.push(temp);
          }
        } else {
          colorVarBin[currColorLabels.indexOf(temp)].push(d)
        }
      }
      return fill(temp);
    })
    createColorLegend(currColors, currColorLabels, colorVarBin)
}

function createColorLegend(currColors, currColorLabels, colorVarBin) {
  var colorLabel = chart1.selectAll('.colorLabel')
    .data(currColors.map(function(d, i) {
      return {'fill': d, 'data': colorVarBin[i]}
    }));
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
      return d.fill;
    }).on('mouseover', function(d) {
      d3.selectAll(".people").attr("opacity", ".2")
      d.data.forEach(function(person) {
        d3.selectAll("#id" + String(person.identifier)).attr("opacity", "1")
      })
    }).on('mouseout', function(d) {
      d3.selectAll(".people").attr("opacity", "1")
    });
  colorLabel.exit().remove();
  var colorLabelN = chart1.selectAll('.colorLabelN').data(currColorLabels)
  var enteredColorn = colorLabelN.enter().append('text');
  colorLabelN.merge(enteredColorn)
    .attr('class', 'colorLabelN')
    .attr('fill', '#000000')
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
d3.csv('./data/candy2.csv',
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
  chart1.datum(dataset)
  chart1.selectAll('title').data(["Candy Survey Participants", "Categorized By Demographics"]).enter().append('text').attr('x', width * .7).attr('y', function(d,i){return -20 + (i*20);}).attr('text-anchor', "middle").attr("fill","#000000").text(function(d) {
    return d;
  });
  totalLengthOfData = dataset.length;
  //CandyFrequencies and the pull down button setup
  candyObject = {}
  candyArr = [];
  candyNames = [];
  createStackedBars(dataset);
  //DEMOGRAPHICS;
  gender = candyBins(dataset, 'Q2_GENDER');
  goingOut = candyBins(dataset, 'Q1_GOING_OUT');
  age = ageBins(dataset).sort(function(a, b) {
    return a.key - b.key;
  });
  country = candyBins(dataset, 'Q4_COUNTRY').sort(function(a, b) {
    return a.key > b.key;
  }).sort(function(a, b) {
    return parseInt(a.values.length) < parseInt(b.values.length);
  });
  state = candyBins(dataset, 'Q5_STATE_PROVINCE_COUNTY_ETC');
  chart1.append('g')
    .attr('class', 'x')
    .append('g')
    .attr('class', 'x axis persons');

  document.getElementById('xScaleSelect').value = 'age';
  document.getElementById('colorSelect').value = 'NONE';
  document.getElementById('sortSelect').value = 'NONE';
  currArray = age;
  mapSetup(dataset);
  updateChart();
  defineColor('NONE');
  onColorChanged();
}

function updateChart() {

  var yAxis = d3.axisLeft(yScale).ticks(8);
  var xAxis = defineXAxis(currArray);
  updateXLabel(currArray);

  chart1.selectAll('g.x.axis')
    .attr('transform', 'translate(0,' + ((3 * height / 4) + 10) + ')')
    .call(xAxis);

  var xlabel = chart1.select(".x").selectAll('.xLabels')
    .data(xScaleLabels);

  var enteredXlabel = xlabel.enter().append('text');
  xlabel.merge(enteredXlabel).attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('class', 'xLabels')
    .attr('y', ((3 * height / 4) + 24))
    .attr('font-size', '9')
    .attr('fill','black')
    .attr('text-anchor', 'middle')
    .text(function(d) {
      return d;
    });
  xlabel.exit().remove();

  var count = chart1.select(".x").selectAll('.counters')
    .data(currArray);
  var enteredCount = count.enter().append('text');
  count.merge(enteredCount).attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('class', 'counters')
    .attr('y', ((3 * height / 4) + 50))
    .attr('font-size', '9')
    .attr('fill', '#000000')
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
    var ppl = chart1.selectAll(".people")
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
          .attr("width", rectWidth)
          .attr("height", rectWidth);
        d3.select(this)
          .transition()
          .attr("width", rectWidth * 3)
          .attr("height", rectWidth * 3)
      })
      .on("mouseout", function(d) {
        personTooltip.hide(d)
        d3.selectAll('.people')
          .transition()
          .attr("width", rectWidth)
          .attr("height", rectWidth)
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

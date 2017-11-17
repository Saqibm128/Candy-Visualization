var svg = d3.select('svg');
var height = svg.attr('height');
var width = svg.attr('width');

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
    for (var i = 0; i<dataset.length;i++) {
        var datum = dataset[i][candy];
        if (keys.indexOf(datum)>=0) {
            for (var j = 0; j<bin.length; j++) {
                if (bin[j].key == datum) {
                    bin[j].values.push(dataset[i]);
                }
            }
        } else {
            bin.push({key: datum, values: [dataset[i]]});
            keys.push(datum);
        }
    }
    return bin;
}

function ageBins(dataset) {
    var bin = [];
    var keys = [];
    for (var i = 0; i<dataset.length;i++) {
        var datum = dataset[i].Q3_AGE;
        var binNum = Math.floor(datum/10);
        if (keys.indexOf(binNum)>=0) {
            for (var j = 0; j<bin.length; j++) {
                if (bin[j].key == binNum) {
                    bin[j].values.push(dataset[i]);
                }
            }
        } else {
            bin.push({key: binNum, values: [dataset[i]]});
            keys.push(binNum);
        }
    }
    return bin;
}

d3.csv('./data/candy.csv',
function(row){
  var cleaned = {};
  Object.keys(row).forEach(function(keyName) {
    cleaned[keyName] = cleanData(row[keyName]);
  })
  return cleaned;
},
function(error, dataset){
    if(error) {
        console.error('Error while loading dataset.');
        console.error(error);
        return;
    }
// whichever format we want... we should probably choose one
    var listFormat = Object.keys(dataset).map(
      function(keyName) {
        return candyBins(dataset, keyName)
    })
    var objFormat = {}
    Object.keys(dataset).forEach(
      function(keyName){
        objFormat[keyName] = candyBins(dataset, keyName)
      }
    )
function defineXAxis(bins) {
    xScale = d3.scaleLinear()
        .domain([-1,bins.length])
        .range([0,9*width/10])
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
//DEMOGRAPHICS;
var gender = candyBins(dataset, 'Q2_GENDER');
var goingOut = candyBins(dataset, 'Q1_GOING_OUT');
var age = ageBins(dataset).sort(function(a,b) {return parseInt(a.key)>parseInt(b.key);});
console.log(age);
var country = candyBins(dataset,'Q4_COUNTRY');
var state = candyBins(dataset,'Q5_STATE_PROVINCE_COUNTY_ETC');
    var chartG = svg.append('g')
        .attr('transform', 'translate('+[10,10]+')');
//chart 1
    var yScale = d3.scaleLinear()
        .domain([60,0])
        .range([0,3*height/4])
    var yAxis = d3.axisLeft(yScale).ticks(8);

    var currArray = country;
    var xAxis = defineXAxis(currArray);
    chartG.append('g')
        .attr('class', 'x-axis')
        .call(xAxis);

        var rectWidth = 3;
        var binWidth = xScale(.8)-xScale(0);
        var num = Math.ceil(binWidth/(rectWidth+2))
    for (var j=0; j < currArray.length; j++) {
        var row = 0;
        var people = chartG.selectAll("people")
            .data(currArray[j].values)
            .enter()
        people.append("rect")
            .attr("x", function (d, i) {
                return xScale(j)-binWidth/2+((rectWidth+2)*(i%num));
            })
            .attr("y", function (d, i) {
                return yScale(Math.floor(i / num))+1;
            })
            .attr("width", (rectWidth+1))
            .attr("height", (rectWidth+1))
            .attr('fill', function(d,i) {
                return '#0000ff';
            })
            .on("mouseover", function(d){
                console.log(d);
            });
        }
});
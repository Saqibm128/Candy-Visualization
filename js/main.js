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

d3.csv('./data/candy.csv',
function(row){

    return {
        Q1_GOING_OUT: cleanData(row.Q1_GOING_OUT),
        Q2_GENDER: cleanData(row.Q2_GENDER),
        Q3_AGE: cleanData(row.Q3_AGE),
        Q4_COUNTRY: cleanData(row.Q4_COUNTRY),
        Q5_STATE_PROVINCE_COUNTY_ETC: cleanData(row.Q5_STATE_PROVINCE_COUNTY_ETC),
        
        Q6_Any_full_sized_candy_bar: cleanData(row.Q6_Any_full_sized_candy_bar),
        Q6_Butterfinger: cleanData(row.Q6_Butterfinger),
        Q6_Candy_Corn: cleanData(row.Q6_Candy_Corn),
        Q6_Chiclets: cleanData(row.Q6_Chiclets),
        Q6_Dots: cleanData(row.Q6_Dots),
        Q6_Fuzzy_Peaches: cleanData(row.Q6_Fuzzy_Peaches),
        Q6_Good_N_Plenty: cleanData(row.Q6_Good_N_Plenty),
        Q6_Gummy_Bears_straight_up: cleanData(row.Q6_Gummy_Bears_straight_up),
        Q6_Healthy_Fruit: cleanData(row.Q6_Healthy_Fruit),
        Q6_Heath_Bar: cleanData(row.Q6_Heath_Bar),
        Q6_Hershey_s_Dark_Chocolate: cleanData(row.Q6_Hershey_s_Dark_Chocolate),
        Q6_Hershey_s_Milk_Chocolate: cleanData(row.Q6_Hershey_s_Milk_Chocolate),
        Q6_Hershey_s_Kisses: cleanData(row.Q6_Hershey_s_Kisses),
        Q6_Jolly_Rancher_bad_flavor: cleanData(row.Q6_Jolly_Rancher_bad_flavor),
        Q6_Jolly_Ranchers_good_flavor: cleanData(row.Q6_Jolly_Ranchers_good_flavor),
        Q6_Junior_Mints: cleanData(row.Q6_Junior_Mints),
        Q6_Kit_Kat: cleanData(row.Q6_Kit_Kat),
        Q6_LaffyTaffy: cleanData(row.Q6_LaffyTaffy),
        Q6_LemonHeads: cleanData(row.Q6_LemonHeads),
        Q6_Licorice_not_black: cleanData(row.Q6_Licorice_not_black),
        Q6_Licorice_yes_black: cleanData(row.Q6_Licorice_yes_black),
        Q6_Lollipops: cleanData(row.Q6_Lollipops),
        Q6_Mike_and_Ike: cleanData(row.Q6_Mike_and_Ike),
        Q6_Milk_Duds: cleanData(row.Q6_Milk_Duds),
        Q6_Milky_Way: cleanData(row.Q6_Milky_Way),
        Q6_Regular_M_Ms: cleanData(row.Q6_Regular_M_Ms),
        Q6_Peanut_M_M_s: cleanData(row.Q6_Peanut_M_M_s),
        Q6_Mint_Kisses: cleanData(row.Q6_Mint_Kisses),
        Q6_Mr_Goodbar: cleanData(row.Q6_Mr_Goodbar),
        Q6_Nerds: cleanData(row.Q6_Nerds),
        Q6_Nestle_Crunch: cleanData(row.Q6_Nestle_Crunch),
        Q6_Peeps: cleanData(row.Q6_Peeps),
        Q6_Pixy_Stix: cleanData(row.Q6_Pixy_Stix),
        Q6_Reese_s_Peanut_Butter_Cups: cleanData(row.Q6_Reese_s_Peanut_Butter_Cups),
        Q6_Reese_s_Pieces: cleanData(row.Q6_Reese_s_Pieces),
        Q6_Rolos: cleanData(row.Q6_Rolos),
        Q6_Skittles: cleanData(row.Q6_Skittles),
        Q6_Snickers: cleanData(row.Q6_Snickers),
        Q6_Sourpatch_Kids_i_e_abominations_of_nature: cleanData(row.Q6_Sourpatch_Kids_i_e_abominations_of_nature),
        Q6_Starburst: cleanData(row.Q6_Starburst),
        Q6_Swedish_Fish: cleanData(row.Q6_Swedish_Fish),
        Q6_Tic_Tacs: cleanData(row.Q6_Tic_Tacs),
        Q6_Three_Musketeers: cleanData(row.Q6_Three_Musketeers),
        Q6_Tolberone_something_or_other: cleanData(row.Q6_Tolberone_something_or_other),
        Q6_Trail_Mix: cleanData(row.Q6_Trail_Mix),
        Q6_Twix: cleanData(row.Q6_Twix),
        Q6_Whatchamacallit_Bars: cleanData(row.Q6_Whatchamacallit_Bars),
        Q6_York_Peppermint_Patties: cleanData(row.Q6_York_Peppermint_Patties),
        Q7_JOY_OTHER: cleanData(row.Q7_JOY_OTHER),
        Q8_DESPAIR_OTHER: cleanData(row.Q8_DESPAIR_OTHER),
        Q9_OTHER_COMMENTS: cleanData(row.Q9_OTHER_COMMENTS)
    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading dataset.');
        console.error(error);
        return;
    }
//CandyFrequencies
    var fullCandyBar = candyBins(dataset, 'Q6_Any_full_sized_candy_bar');
    var butterFinger = candyBins(dataset, 'Q6_Butterfinger');
    var candyCorn = candyBins(dataset, 'Q6_Candy_Corn');
    var chiclets = candyBins(dataset, 'Q6_Chiclets');
    var dots = candyBins(dataset, 'Q6_Dots');
    var fuzzyPeaches = candyBins(dataset, 'Q6_Fuzzy_Peaches');
    var goodPlenty = candyBins(dataset, 'Q6_Good_N_Plenty');
    var gummyBears = candyBins(dataset, 'Q6_Gummy_Bears_straight_up');
    var healthyFruit = candyBins(dataset, 'Q6_Healthy_Fruit');
    var heathBar = candyBins(dataset, 'Q6_Heath_Bar');
    var darkChoco = candyBins(dataset, 'Q6_Hershey_s_Dark_Chocolate');
    var darkMilk = candyBins(dataset, 'Q6_Hershey_s_Milk_Chocolate');
    var hersheyKiss = candyBins(dataset, 'Q6_Hershey_s_Kisses');
    var jollyRancherBad = candyBins(dataset, 'Q6_Jolly_Rancher_bad_flavor');
    var jollyRancherGood = candyBins(dataset, 'Q6_Jolly_Rancher_good_flavor');
    var juniorMint = candyBins(dataset, 'Q6_Junior_Mints');
    var kitKat = candyBins(dataset, 'Q6_Kit_Kat');
    var laffyTaffy = candyBins(dataset, 'Q6_LaffyTaffy');
    var lemonHeads = candyBins(dataset, 'Q6_LemonHeads');
    var licorice = candyBins(dataset, 'Q6_Licorice_not_black');
    var licoriceBlack = candyBins(dataset, 'Q6_Licorice_yes_black');
    var lollipop = candyBins(dataset, 'Q6_Lollipops');
    var mikeIke = candyBins(dataset, 'Q6_Mike_and_Ike');
    var milkDuds = candyBins(dataset, 'Q6_Milk_Duds');
    var milkyWay = candyBins(dataset, 'Q6_Milky_Way');
    var mMReg = candyBins(dataset, 'Q6_Regular_M_Ms');
    var mMPeanut = candyBins(dataset, 'Q6_Peanut_M_M_s');
    var mintKiss = candyBins(dataset, 'Q6_Mint_Kisses');
    var mrGoodbar = candyBins(dataset, 'Q6_Mr_Goodbar');
    var nerds = candyBins(dataset, 'Q6_Nerds');
    var nestleCrunch = candyBins(dataset, 'Q6_Nestle_Crunch');
    var peeps = candyBins(dataset, 'Q6_Peeps');
    var pixyStix = candyBins(dataset, 'Q6_Pixy_Stix');
    var reecesCup= candyBins(dataset, 'Q6_Reese_s_Peanut_Butter_Cups');
    var reesesPieces = candyBins(dataset, 'Q6_Reese_s_Pieces');
    var rolos = candyBins(dataset, 'Q6_Rolos');
    var skittles = candyBins(dataset, 'Q6_Skittles');
    var snickers = candyBins(dataset, 'Q6_Snickers');
    var sourpatch= candyBins(dataset, 'Q6_Sourpatch_Kids_i_e_abominations_of_nature');
    var starburst = candyBins(dataset, 'Q6_Starburst');
    var swedishFish = candyBins(dataset, 'Q6_Swedish_Fish');
    var ticTac = candyBins(dataset, 'Q6_Tic_Tacs');
    var threeMusk = candyBins(dataset, 'Q6_Three_Musketeers');
    var tolberone = candyBins(dataset, 'Q6_Tolberone_something_or_other');
    var trailMix = candyBins(dataset, 'Q6_Trail_Mix');
    var twix = candyBins(dataset, 'Q6_Twix');
    var whatcha = candyBins(dataset, 'Q6_Whatchamacallit_Bars');
    var yorkPeppermint = candyBins(dataset, 'Q6_York_Peppermint_Patties');

//DEMOGRAPHICS
    var goingOut = candyBins(dataset, 'Q1_GOING_OUT');
    var gender = candyBins(dataset, 'Q2_GENDER');
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,3*width/4])
    var xAxis = d3.axisBottom(xScale).ticks(8);    
    var ageHisto = d3.histogram()
        .domain([0,100])
        .thresholds(xScale.ticks(80))
        .value(function (d) { return d.Q3_AGE;})
    const age = ageHisto(dataset).filter(d => d.length>0)
    //var age = candyBins(dataset, 'Q3_AGE');
    var country = candyBins(dataset, 'Q4_COUNTRY');
    var provinceState = candyBins(dataset, 'Q5_STATE_PROVINCE_COUNTY_ETC');
var candyList = [fullCandyBar, butterFinger, candyCorn, chiclets, dots, fuzzyPeaches, goodPlenty, gummyBears, healthyFruit, heathBar, darkChoco, darkMilk, hersheyKiss, jollyRancherBad, jollyRancherGood, juniorMint, kitKat, laffyTaffy, lemonHeads, licorice, licoriceBlack, lollipop, mikeIke, milkDuds, milkyWay, mMReg, mMPeanut, mintKiss, mrGoodbar, nerds, nestleCrunch, peeps, pixyStix, reecesCup, reesesPieces, rolos, skittles, snickers, sourpatch, starburst, swedishFish, ticTac, threeMusk, tolberone, trailMix, twix, whatcha, yorkPeppermint];
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
    chartScales = {x: 'age'};
    var yScale = d3.scaleLinear()
        .domain([100,0])
        .range([0,3*height/4])
    var yAxis = d3.axisLeft(yScale).ticks(8);
    var chart = svg.append('g').attr('class', 'chart').attr('transform','translate('+width/8+','+height/8+')');
    chart.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
    chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform','translate(0,'+3*height/4+')')
        .call(xAxis);
    chart.selectAll('ylines')
        .data([0,10,20,30,40,50,60,70,80,90,100])
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', function(d){return yScale(d)})
        .attr('x2', 3*width/4)
        .attr('y2', function(d){return yScale(d)})
        .style("stroke", "#555")
        .style("opacity",'.5')
    for(var j=0;j<age.length;j++) {
        var data = age[j].sort(function(a,b){
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
            .attr("cx", function (d, i) { return xScale(age[j].x0); })
            .attr("cy", function (d, i) { return yScale(age[j].length-i); })
            .attr("r", 2)
            .attr('fill',function(d,i){
                if(d.Q2_GENDER == "Female") {
                    return '#ff0081';
                } else if (d.Q2_GENDER == "Male") {
                    return '#0d9fab';
                } else {
                    return '#731982';
                }
            });
    }
});

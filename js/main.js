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
                    bin[j].value.push(dataset[i]);
                }
            }
        } else {
            bin.push({key: datum, value: [dataset[i]]});
            keys.push(datum);
        }
    }
    return bin;
}

d3.csv('./data/candy.csv',
function(row){

    return {
        // Demographics
        Q1_GOING_OUT: cleanData(row.Q1_GOING_OUT),
        Q2_GENDER: cleanData(row.Q2_GENDER),
        Q3_AGE: +cleanData(row.Q3_AGE),
        Q4_COUNTRY: cleanData(row.Q4_COUNTRY),
        Q5_STATE_PROVINCE_COUNTY_ETC: cleanData(row.Q5_STATE_PROVINCE_COUNTY_ETC),
        // Candies
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
        // Other, unstructured comments
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

    var candyObject = new Object();
    Object.keys(dataset[0]).forEach(function(key) {
      candyObject[key] = candyBins(dataset, key);
    })
    console.log(candyObject)
  }
);
//     var map;
//   var service;
//   var infowindow;
//   function initialize() {
//     var pyrmont = new google.maps.LatLng(0,0);
// 
// 
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: pyrmont,
//         zoom: 15
//       });
// 
//     var request = {
//       bounds: pyrmont,
//       query: ['OH']
//     };
// 
//     service = new google.maps.places.PlacesService(map);
//     service.textSearch(request, function(resp) {
//       console.log(resp);
//     });
//   }
//   initialize()
// });

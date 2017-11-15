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
                    bin[j].value = bin[j].value +1;
                }
            }
        } else {
            bin.push({key: datum, value: 1});
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
    var age = candyBins(dataset, 'Q3_AGE');
    var country = candyBins(dataset, 'Q4_COUNTRY');
    var provinceState = candyBins(dataset, 'Q5_STATE_PROVINCE_COUNTY_ETC');
});

const fs = require('fs');

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const weeks52 = 52 * 7;
console.log(weeks52);
function diffDays(firstDate, secondDate) {
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// debug print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

const ticker_name = process.argv[2];
var data;
try {
    data = fs.readFileSync(`input/${ticker_name}.csv`, 'utf8');
    // console.log(data);
} catch (err) {
    console.error(err);
}

const lines = data.split("\r\n");
const dates = [];
const close_values = [];

for (let i = 1; i < lines.length - 1; i++) {
    let line = lines[i].split(",");
    dates.push(new Date(line[0]));
    close_values.push(parseFloat(line[line.length - 1]));
}

let currentCount = 0;

let firstDatePos = 0; // position of the earliest Date in Dict
let currentDatePos = 0; // position of current Date in Dict

let highest = close_values[0]; // highest closing value
let highest_date = dates[0];
let lowest = close_values[0]; // lowest closing value
let lowest_date = dates[0];

// const result = [];
let result_csv = "date,close_value,highest_52_weeks_value,highest_date,lowest_52_weeks_value,lowest_date,is_high52,is_low52,business_days\n";
let count_business_days = 0;
let dict = {};
dates.forEach((date) => {
    currentCount = diffDays(dates[firstDatePos], dates[currentDatePos]);
    let cDate = dates[currentDatePos]; // current Date 
    let fDate = dates[firstDatePos]; // first Date in Dictionary
    let cClose = close_values[currentDatePos]; // current closing value
    while (currentCount > weeks52) {
        delete dict[dates[firstDatePos]]; // remove old value from dict
        firstDatePos++;

        currentCount = diffDays(dates[firstDatePos], dates[currentDatePos]);
        count_business_days--;
    }
    dict[cDate] = cClose;

    if (highest_date < fDate) { // highest value outdated
        highest = 0;
        highest_date = 0;
        // find_high(dict);
        for (const [key, value] of Object.entries(dict)) {
            if (highest <= value) {
                highest = value;
                highest_date = new Date(key);
            }
        }
    } else {
        if (highest <= cClose) { // current highest value is lower than current closing value
            highest = cClose;
            highest_date = cDate;
        }
    }


    if (lowest_date < fDate) { // lowest value outdated
        lowest = Number.MAX_VALUE;
        lowest_date = 0;
        // find_low(dict);
        for (const [key, value] of Object.entries(dict)) {
            if (lowest >= value) {
                lowest = value;
                lowest_date = new Date(key);
            }
        }
    } else {
        if (lowest >= cClose) { // current lowest value is higher than current closing value
            lowest = cClose;
            lowest_date = cDate;
        }
    }


    let close = close_values[currentDatePos];
    let high = close >= highest;
    let low = close <= lowest;
    result_csv += `${cDate.toISOString().split('T')[0]},${close},${highest},${highest_date.toISOString().split('T')[0]},${lowest},${lowest_date.toISOString().split('T')[0]},${high},${low},${count_business_days}\n`;

    currentDatePos++;
    count_business_days++;
});

console.log("done " + ticker_name);

/*
var jsonContent = JSON.stringify(result);
fs.writeFile(`output_json/${ticker_name}.json`, jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});*/

fs.writeFile(`output_csv/${ticker_name}.csv`, result_csv, 'utf8', function (err) {
    if (err) {
        console.log("An error occured.");
        return console.log(err);
    }
    console.log("CSV file has been saved.");
});
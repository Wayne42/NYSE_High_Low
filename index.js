const fs = require('fs');
const spawn = require('child_process').spawn;

function newProcess(ticker_name) {
    const proc = spawn('node', ['calc.js', ticker_name]); // ticker_name

    proc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    proc.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

var data;
try {
    data = fs.readFileSync(`tickerlist.csv`, 'utf8');
    // console.log(data);
} catch (err) {
    console.error(err);
}
const lines = data.split("\r\n");

for (let i = 1; i < lines.length - 1; i++) {
    console.log(lines[i]);
    // if (lines[i] !== 'A') continue;
    newProcess(lines[i]);
}



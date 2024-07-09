const { exec } = require('child_process');
const fs = require('fs');

function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        const process = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing script ${scriptPath}: ${error.message}`);
            } else if (stderr) {
                reject(`Script ${scriptPath} stderr: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });

        process.stdout.on('data', data => {
            console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', data => {
            console.error(`stderr: ${data}`);
        });
    });
}

async function run() {
    try {
        console.log('Running 47.extractData.js...');
        await runScript('47.extractData.js');
        console.log('Finished running 47.extractData.js.');

        // Check if the linksByState.json file exists
        if (fs.existsSync('47.Data.json')) {
            console.log('Running 47.cleanData.js...');
            await runScript('47.cleanData.js');
            console.log('Finished running 47.cleanData.js.');
        } else {
            console.error('linksByState.json not found. Aborting 47.cleanData.js execution.');
        }
    } catch (error) {
        console.error(error);
    }
}

run();

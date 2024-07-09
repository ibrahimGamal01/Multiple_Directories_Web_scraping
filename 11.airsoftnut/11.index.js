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
        console.log('Running 11.2.extractLinks.js...');
        await runScript('11.2.extractLinks.js');
        console.log('Finished running 11.2.extractLinks.js');

        // Check if the 2_place_links.txt file exists
        if (fs.existsSync('2_place_links.txt')) {
            console.log('Running 11.3.extractData.js...');
            await runScript('11.3.extractData.js');
            console.log('Finished running 11.3.extractData.js.');
        } else {
            console.error('linksByState.json not found. Aborting 11.3.extractData.js execution.');
        }
    } catch (error) {
        console.error(error);
    }
}

run();

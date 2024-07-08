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
        console.log('Running 05.getLinks.js...');
        await runScript('05.getLinks.js');
        console.log('Finished running 05.getLinks.js.');

        // Check if the linksByState.json file exists
        if (fs.existsSync('linksByState.json')) {
            console.log('Running 05.getData.js...');
            await runScript('05.getData.js');
            console.log('Finished running 05.getData.js.');
        } else {
            console.error('linksByState.json not found. Aborting 05.getData.js execution.');
        }
    } catch (error) {
        console.error(error);
    }
}

run();

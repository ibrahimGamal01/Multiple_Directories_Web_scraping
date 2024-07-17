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
        console.log('Running 77.getLinks.js...');
        await runScript('77.getLinks.js');
        console.log('Finished running 77.getLinks.js.');

        // Check if the links.txt file exists
        if (fs.existsSync('links.txt')) {
            console.log('Running 77.getData.js...');
            await runScript('77.getData.js');
            console.log('Finished running 77.getData.js.');
        } else {
            console.error('links.txt not found. Aborting 77.getData.js execution.');
        }
    } catch (error) {
        console.error(error);
    }
}

run();

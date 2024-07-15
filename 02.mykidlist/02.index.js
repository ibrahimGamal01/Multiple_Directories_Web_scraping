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
        console.log('Running 02.mykidlist.js...');
        await runScript('02.mykidlist.js');
        console.log('Finished running 02.mykidlist.js.');

        // Check if the 02.Data.json file exists
        if (fs.existsSync('02.Data.json')) {
            console.log('Running 02.getPhone.js...');
            await runScript('02.getPhone.js');
            console.log('Finished running 02.getPhone.js.');
        } else {
            console.error('02.Data.json not found. Aborting 02.getPhone.js execution.');
        }

        // Check if the 02.Data_with_phone.json file exists
        if (fs.existsSync('02.Data_with_phone.json')) {
            console.log('Running 02.getAddress.js...');
            await runScript('02.getAddress.js');
            console.log('Finished running 02.getAddress.js');
        } else {
            console.error('02.Data_with_phone.json found. Aborting 02.getAddress.js execution.');
        }
    } catch (error) {
        console.error(error);
    }
}

run();

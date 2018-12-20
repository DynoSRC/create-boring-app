#!/usr/bin/env node
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');

module.exports = function(args) {
  try {

    return new Promise((resolve, reject) => {

      const dir = args._.shift();
      if (!dir) {
        reject('No directory passed into create, please specify via:  create-boring-app <dir-name>');
      }

      const dirPath = path.normalize(process.cwd() + '/' + dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirpSync(dirPath);
        console.log('created directory ' + dirPath);
      }

      fs.mkdirpSync(dirPath + '/node_modules');
      console.log('installing boring into ' + dirPath);
      // Installing boring as a dep inside the target folder saves
      // a double install.  If we did not do this `npx boringbits generate`
      // would technially work, but npx would install boringbits in a
      // temporary place first, THEN run the generator, THEN still need to
      // run the install to actually put boring into app.  Doing
      // this step upfront eliminates the need for users to have to
      // run `npm install` after generating.
      childProcess.spawnSync('npm', ['install', 'boringbits@latest'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: dirPath,
      });

      console.log('Running boring generator in directory ' + dirPath);
      childProcess.spawnSync('npx', ['boring', 'generate'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: dirPath,
      });

    }).catch(e => {
      console.log('Problem running create-boring-app command\n', e);
    });
  } catch (e) {
    console.error('There was a problem the boring command\n', e);
    return Promise.reject({status: 1});
  }
};

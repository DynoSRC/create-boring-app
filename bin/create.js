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
        console.log('Created directory ' + dirPath);
      }

      console.log('Running boring generator in director ' + dirPath);
      childProcess.spawnSync('npx', ['boringbits@latest', 'generate'], {
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

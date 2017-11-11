/* eslint-env node */
'use strict';

const getCoverage = require('./src/get-coverage');
const displayCoverage = require('./src/display-coverage');
const runTestCommand = require('./src/run-test-command');
const checkCoverageChange = require('./src/check-coverage-change');

module.exports = {
  name: 'ember-cli-doorkeeper',
  includedCommands() {
    return {
      doorkeeper: {
        name: 'doorkeeper',
        description: 'Run tests and fail if coverage drops',
        run() {
          let config = require(`${this.project.root}/.doorkeeperrc`);
          let oldCoverage = getCoverage();
          this.ui.writeLine('Running tests ...');
          this.ui.writeLine(config.testCommand);
          runTestCommand(config.testCommand);
          let newCoverage = getCoverage();
          displayCoverage.call(this, oldCoverage, 'Old Coverage');
          displayCoverage.call(this, newCoverage, 'New Coverage');
          try {
            checkCoverageChange(oldCoverage, newCoverage, config.threshold);
            this.ui.writeLine('Awesome! Keep up the testing.');
          } catch(error) {
            console.error(error.message);
            process.exit(1);
          }
        }
      }
    };
  }
};

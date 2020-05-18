'use strict';

const program = require('commander')
const create = require('./create')

program
    .command('create')
    .description('create a new project')
    .alias('c')
    .option('-g, --git [message]', 'Force git initialization with initial commit message')
    .option('-n, --no-git', 'Skip git initialization')
    .option('-f, --force', 'Overwrite target directory if it exists')
    .option('-c, --clone', 'Use git clone when fetching remote preset')
    .option('-x, --proxy', 'Use specified proxy when creating project')
    .option('-b, --bare', 'Scaffold project without beginner instructions')
    .action((name) => {
    create(name.args[0])
});


program.version(require('../package.json').version, '-v --version').parse(process.argv);


if (!process.argv.slice(2).length) {
    program.outputHelp()
}

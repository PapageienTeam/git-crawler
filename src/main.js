'use strict';

const gitBot = require('git-bot');
const databaseInsertion = require('./database_insertion');

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

async function main() {
    await gitBot.config_handler.loadConfig('config.json');
    await databaseInsertion.nukeDatabaseAndWriteEverything(gitBot.db);
} 

main();
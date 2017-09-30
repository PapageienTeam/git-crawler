'use strict';

const gitBot = require('git-bot');
const databaseInsertion = require('./database_insertion');

await gitBot.config_handler.loadConfig('config.json');
databaseInsertion.nukeDatabaseAndWriteEverything();
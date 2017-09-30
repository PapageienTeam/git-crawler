'use strict';

const gitBot = require('git-bot');
const userMappingsHack = require('./user_mappings_hack');

userMappingsHack.insertHardcodedMappings(gitBot.db);

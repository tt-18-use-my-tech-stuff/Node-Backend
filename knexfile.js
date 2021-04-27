require('dotenv').config();
const pg = require('pg');

const sharedConfig = {
    migrations: {directory: './data/migrations'},
    seeds: {directory: './data/seeds'},
};

module.exports = {
    development: {
        ...sharedConfig,
        client: 'sqlite3',
        connection: './data/ourdb.db3',
    },
    testing: {
        ...sharedConfig,
        client: 'sqlite3',
        connection: './data/testing.db3',
    },
    production: {
        ...sharedConfig,
        client: 'pg',
        connection: process.env.PRODUCTION_URL,
        pool: { min: 2, max: 10 },
    },
}
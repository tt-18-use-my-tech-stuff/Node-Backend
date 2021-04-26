require('dotenv').config();
const pg = require('pg');

if (process.env.DATABASE_URL) {
    pg.defaults.ssl = {rejectUnauthorized: false};
}

const sharedConfig = {
    useNullAsDefault: true,
    migrations: {directory: './data/migrations'},
    seeds: {directory: './data/seeds'},
    pool: { afterCreate: (conn, done) => conn.run('PRAGMA foreign_keys = ON', done) },
};

module.exports = {
    development: {
        ...sharedConfig,
        client: 'sqlite3',
        connection: { filename: './data/ourdb.db3' },
    },
    testing: {
        ...sharedConfig,
        client: 'sqlite3',
        connection: { filename: './data/testing.db3' },
    },
    production: {
        ...sharedConfig,
        client: 'pg',
        connection: process.env.PRODUCTION_URL,
        pool: { min: 2, max: 10 },
    },
}
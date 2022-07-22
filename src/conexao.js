const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'ademar1619',
        database: 'market_cubos',
    }

});

module.exports = knex;
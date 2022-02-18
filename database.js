var mysql = require('mysql');

let dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
};

const connection =  mysql.createConnection(dbConfig);

module.exports = connection;
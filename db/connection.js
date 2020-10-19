const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Alfred_!9#6',
    database: 'employee_trackerDB'
});

module.exports = connection;
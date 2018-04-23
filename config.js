var mysql = require('mysql');

module.exports = {
    connection:mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'sak_framework'
      })
}
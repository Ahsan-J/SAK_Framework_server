var mysql = require('mysql');

module.exports = {
    connection:mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'sak_framework'
      }),
      schema:{
          user:function(paramObj){
              this.abc='';
            //   console.log(this);
              return false;
          }
      }
}
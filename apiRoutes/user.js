var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var CryptoJS = require("crypto-js");

route.get('/user',function(request,response){
    let sql = "SELECT * FROM tab_users"
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
      })
})

route.get('/user/fetch',function(request,response){
    let sql = "SELECT * FROM tab_users WHERE user='"+request.query.user+"'"
    connection.query(sql,function (error, results, fields) {
        if(results.length<=0){
            return response.status(404).send({ error: "No Data Found" });;
        }
        if (error){
            return response.send(error);  
        }
        
        var bytes  = CryptoJS.AES.decrypt(results[0].password, 'senpai');
        results[0].password = bytes.toString(CryptoJS.enc.Utf8);

        if(!(results[0].password.trim()===request.query.password.trim())){
            return response.status(500).send({ error: "Password is Incorrect" });;
        }


        var Obj = {
            id:results[0].id,
            user:results[0].user,
            name:results[0].Name,
            auth:true,
            role:results[0].role,
        }

        return response.json(Obj);
      })
})

route.post('/user/register',function(request,response){
    let param = request.body;
    param.id = ShortID.generate();
    param.password = CryptoJS.AES.encrypt(param.password, 'senpai');

    let sql = "INSERT INTO tab_users(id, Name, user, password, role) VALUES ('"+param.id+"','"+param.name+"','"+param.user+"','"+param.password+"','"+param.role+"')"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }

        var Obj = {
            id:param.id,
            user:param.user,
            name:param.name,
            auth:true,
            role:param.role,
        }

        return response.json(Obj);
      })
})

route.get('/user/app/fetch',function(request,response){
    let sql = "SELECT * FROM tab_user_application WHERE user_id='"+request.query.user_id+"'"
    connection.query(sql,function (error, results, fields) {
        if(results.length<=0){
            return response.status(404).send({ error: "No Data Found" });;
        }
        if (error){
            return response.send(error);  
        }

        return response.json(results);
      })
})

route.post('/user/app/add',function(request,response){
    let sql = "SELECT * FROM tab_user_application WHERE user_id='"+request.query.user_id+"'"
    connection.query(sql,function (error, results, fields) {
        if(results.length<=0){
            return response.status(404).send({ error: "No Data Found" });;
        }
        if (error){
            return response.send(error);  
        }

        return response.json(results);
      })
})

module.exports = route;
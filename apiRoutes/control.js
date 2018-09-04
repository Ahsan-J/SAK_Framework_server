var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var _ = require('lodash');
var moment = require('moment');

route.get('/control',function(request,response){
    let sql = "SELECT * FROM tab_controls"
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

route.get('/control/fetch',function(request,response){
    let sql = "SELECT * FROM tab_controls WHERE id='"+request.query.control_id+"'"
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

route.post('/control/add',function(request,response){
    console.log(request.body)
    let param = request.body;
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }
    let sql = "INSERT INTO tab_controls (id, name, type, screen_id, created_at, created_by, updated_at) VALUES ('"+param.id+"', '"+param.name+"', '"+param.type+"', '"+param.screen_id+"', CURRENT_TIMESTAMP, '"+param.created_by+"', NULL)";

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            type:param.type,
            screen_id:param.screen_id,
            created_at:"NULL",
            created_by:param.created_by,
            updated_at : "NULL"
        }

        return response.json(Obj);
      
    })
})

route.put('/control/update',function(request,response){
    let param = request.body;
    console.log(param)
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "UPDATE tab_controls SET name='"+param.name+"',type='"+param.type+"',updated_at='"+moment()+"',screen_id='"+param.screen_id+"' WHERE id='"+param.id+"'"

    connection.query(sql,function (error, results, fields) {
        if (error){
            console.log(error)
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            type:param.type,
            screen_id:param.screen_id,
            created_at:"NULL",
            created_by:param.created_by,
            updated_at : "NULL"
        }

        return response.json(Obj);
      
    })
})

module.exports = route;
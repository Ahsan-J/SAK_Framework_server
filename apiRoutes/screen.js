var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var _ = require('lodash');
var moment = require('moment');

route.get('/screen',function(request,response){
    let sql = "SELECT * FROM tab_screens"
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

route.get('/screen/fetch',function(request,response){
    let sql = "SELECT * FROM tab_screens WHERE id='"+request.query.screen_id+"'"
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

route.post('/screen/add',function(request,response){
    console.log(request.body)
    let param = request.body;
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "INSERT INTO tab_screens(id, name, module_id, created_by) VALUES ('"+param.id+"','"+param.name+"','"+param.module_id+"','"+param.created_by+"')"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            module_id:param.module_id,
            created_at:"NULL",
            created_by:param.created_by
        }

        return response.json(Obj);
      
    })
})

route.put('/screen/update',function(request,response){
    let param = request.body;
    console.log(param)
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "UPDATE tab_screens SET name='"+param.name+"',module_id='"+param.module_id+"',updated_at='"+moment()+"' WHERE id='"+param.id+"'"

    connection.query(sql,function (error, results, fields) {
        if (error){
            console.log(error)
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            module_id:param.module_id,
            created_at:"NULL",
            created_by:param.created_by
        }

        return response.json(Obj);
      
    })
})

module.exports = route;
var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var _ = require('lodash');
var moment = require('moment');

route.get('/module',function(request,response){
    let sql = "SELECT * FROM tab_module"
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

route.get('/module/fetch',function(request,response){
    let sql = "SELECT * FROM tab_module WHERE id='"+request.query.module_id+"'"
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

route.post('/module/add',function(request,response){
    console.log(request.body)
    let param = request.body;
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "INSERT INTO tab_module(id, name, description, app_id, created_by) VALUES ('"+param.id+"','"+param.name+"','"+param.description+"','"+param.app_id+"','"+param.created_by+"')"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            description:param.description,
            parent_module_id:"NULL",
            app_id:param.app_id,
            created_at:"NULL"
        }

        return response.json(Obj);
      
    })
})

route.put('/module/update',function(request,response){
    let param = request.body;
    console.log(param)
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "UPDATE tab_module SET name='"+param.name+"',description='"+param.description+"',updated_at='"+moment()+"',parent_module_id=NULL WHERE id='"+param.id+"'"

    connection.query(sql,function (error, results, fields) {
        if (error){
            console.log(error)
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            description:param.description,
            parent_module_id:"NULL",
            app_id:param.app_id,
            created_at:"NULL"
        }

        return response.json(Obj);
      
    })
})

module.exports = route;
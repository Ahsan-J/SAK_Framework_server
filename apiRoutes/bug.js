var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var _ = require('lodash');
var moment = require('moment');

route.get('/bug',function(request,response){
    let sql = "SELECT * FROM tab_bug"
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

route.get('/bug/fetch',function(request,response){
    let sql = "SELECT * FROM tab_bug WHERE id='"+request.query.bug_id+"'"
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

route.post('/bug/add',function(request,response){
    console.log(request.body)
    let param = request.body;
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }
    let sql = "INSERT INTO tab_bug (id, name, description, control_id, reported_by, status) VALUES ('"+param.id+"', '"+param.name+"', '"+param.description+"', '"+param.control_id+"', '"+param.reported_by+"', '"+param.status+"')";

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            description:param.description,
            control_id:param.control_id,
            reported_by:param.reported_by,
            status : param.status,
        }

        return response.json(Obj);
      
    })
})

route.put('/bug/update',function(request,response){
    let param = request.body;
    console.log(param)
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }

    let sql = "UPDATE tab_bug SET name='"+param.name+"',type='"+param.type+"',updated_at='"+moment()+"',screen_id='"+param.screen_id+"' WHERE id='"+param.id+"'"

    connection.query(sql,function (error, results, fields) {
        if (error){
            console.log(error)
            return response.send(error);  
        }
        
        var Obj = {
            id:param.id,
            name:param.name,
            description:param.description,
            control_id:param.control_id,
            reported_by:param.reported_by,
            status : param.status,
        }

        return response.json(Obj);
      
    })
})

module.exports = route;
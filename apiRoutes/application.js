var route = require('express').Router();
var connection = require('../config.js').connection;
var ShortID = require('shortid');
var _ = require('lodash');

route.get('/app',function(request,response){
    let sql = "SELECT * FROM tab_application"
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

route.get('/app/fetch',function(request,response){
    let sql = "SELECT * FROM tab_application WHERE id='"+request.query.app_id+"'"
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

route.get('/app/user/fetch',function(request,response){
    let sql = "SELECT * FROM tab_user_application WHERE app_id='"+request.query.app_id+"'"
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

route.post('/app/add',function(request,response){
    let param = request.body;
    if(!_.isString(param.name)&&_.isEmpty(param.name)){
        return response.status(400).send({error:'Name is invalid'})
    }
    param.id = ShortID.generate();

    let sql = "INSERT INTO tab_application(id, name, created_by) VALUES ('"+param.id+"','"+param.name+"','"+param.created_by+"')"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        
        sql = "INSERT INTO tab_user_application (id, user_id, app_id, assigned_by) VALUES ('"+ShortID.generate()+"','"+param.created_by+"','"+param.id+"','"+param.created_by+"')"

        connection.query(sql,function (error, results, fields) {
            if (error){
                return response.send(error);  
            }
        
            var Obj = {
                id:param.id,
                name:param.name,
                created_by:param.created_by,
            }

            return response.json(Obj);
      })
    })
})

route.get('/app/all',function(request,response){
    let param = request.query;

    let sql = "SELECT tab_module.name AS module,tab_screens.name AS screen,tab_controls.name AS control,tab_bug.name AS bug,tab_testcase.description FROM tab_module,tab_screens,tab_controls,tab_bug,tab_testcase WHERE tab_module.app_id='"+param.app_id+"' AND tab_screens.module_id=tab_module.id AND tab_controls.screen_id=tab_screens.id AND tab_bug.control_id=tab_controls.id AND tab_testcase.screen_id = tab_screen.id";

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }

        return response.json(results);
    })
})

route.get('/app/module',function(request,response){
    let param = request.query;
    let sql = "SELECT * FROM tab_module WHERE app_id='"+param.app_id+"'"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
    })

})

route.get('/app/screen',function(request,response){
    let param = request.query;
    let sql = "SELECT * FROM `tab_screens` WHERE `module_id`=(SELECT id FROM `tab_module` WHERE app_id = '"+param.app_id+"')"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
    })
})

route.get('/app/control',function(request,response){
    let param = request.query;
    let sql = "SELECT * FROM `tab_controls` WHERE screen_id = (SELECT id FROM `tab_screens` WHERE `module_id`=(SELECT id FROM `tab_module` WHERE app_id = '"+param.app_id+"'))"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
    })
})

route.get('/app/bug',function(request,response){
    let param = request.query;
    let sql = "SELECT * FROM `tab_bug` WHERE control_id = (SELECT id FROM `tab_controls` WHERE screen_id = (SELECT id FROM `tab_screens` WHERE `module_id`=(SELECT id FROM `tab_module` WHERE app_id = '"+param.app_id+"')))"

    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
    })
})
module.exports = route;
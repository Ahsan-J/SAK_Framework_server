var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var connection = require('./config.js').connection;
var fs = require('fs');

var app = express();
var port = 9000;
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

var CryptoJS = require("crypto-js");

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',function(request,response){
    response.send('<h1>Server Running</h1>')
})

app.post('/user/add',function(request,response){
    console.log(request.body);
    var ciphertext = CryptoJS.AES.encrypt('password', 'one piece');

    response.json({});
})

app.get('/user',function(request,response){
    let sql = "SELECT * FROM tab_users"
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
      })
})

app.get('/user/fetch',function(request,response){
    let sql = "SELECT * FROM tab_users WHERE user='"+request.query.user+"'"
    connection.query(sql,function (error, results, fields) {
        if(results.length<=0){
            return response.status(404).send({ error: "No Data Found" });;
        }
        if (error){
            return response.send(error);  
        }
        if(!(results[0].password.trim()===request.query.password)){
            return response.status(500).send({ error: "Password is Incorrect" });;
        }
        console.log(results[0]);
        var Obj = {
            id:results[0].id,
            user:results[0].user,
            name:results[0].Name,
            auth:true,
            type:results[0].type,
        }
        return response.json(Obj);
      })
})


app.get('/bug',function(request,response){
    let sql = "SELECT * FROM tab_bug"
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        var data = fs.readFileSync('duplicate.json','utf-8');
        data = JSON.parse(data);
        results.forEach(function(value,index){
            data.forEach(function(item,i){
                if(i!=index&&(value.bugid==item)){
                    results[index].duplicate=true;
                }
            })
        })
        return response.json(results);
      })
})

app.get('/bug/chart_data',function(request,response){
    let sql = "SELECT COUNT(bugid) AS total FROM tab_bug";
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        calculateDup();
        var data = fs.readFileSync('duplicate.json','utf-8');
        data = JSON.parse(data);
        
        return response.json({
            total:results[0].total,
            duplicate:data.length,
        });
      })

})

app.post('/bug/add',function(request,response){
    let sql = "INSERT INTO `tab_bug`(`bugid`, `bugdesc`, `controlname`, `screenname`, `reportedby`, `assignto`, `appid`, `status`, `reportdate`) VALUES ('"+request.body.bugid+"','"+request.body.bugdesc+"','"+request.body.controlname+"','"+request.body.screenname+"','"+request.body.reportedby+"','"+request.body.assignto+"','"+request.body.appid+"','"+request.body.status+"','"+request.body.reportdate+"')"
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        calculateDup();
        return response.json(results);
      })
})

app.get('/projects',function(request,response){
    let sql = ""
    connection.query(sql,function (error, results, fields) {
        if (error){
            return response.send(error);  
        }
        return response.json(results);
    })
})

var server = app.listen(port,function(){
    console.log("Running at "+port);
})

var serverIO = socket(server);

function calculateDup(){
    let sql = "SELECT * FROM tab_bug"
    connection.query(sql,function (error, results, fields) {
        if (error){
            
        }
        var duplicateId = new Set();
        var results_d = [...results];

        for(var j = 0;j<results.length;j++){
            for (var k = 0;k<results_d.length; k++) {
                if(j!=k && (results[j].controlname+results[j].screenname+results[j].appid)==(results_d[k].controlname+results_d[k].screenname+results_d[k].appid)){
                    duplicateId.add(results[k].bugid);
                }
            }
        }
        // results.forEach(function(item, index) {
        //     results.forEach(function(value,i){
        //         if((item.controlname+item.screenname+item.appid)===(value.controlname+value.screenname+value.appid)){
        //             duplicateId.add(value.bugid);
        //         }
        //     })
        // });
        fs.writeFile('duplicate.json',JSON.stringify([...duplicateId]));
    })
}

serverIO.on('connection',function(socket){
    console.log('User '+socket.id+' is connected');
})
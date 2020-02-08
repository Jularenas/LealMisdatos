const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'misdatos',
    debug    :  false
});


function register_database(req,res) {
   
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  

        console.log('connected as id ' + connection.threadId);
       

        console.log(req.query);

        connection.query(req.query,function(err,rows){
            connection.release();
            if(!err) {
                
                res.json(rows);
                console.log('fetched');
            }          
            else{
                //console.log(err)
                res.json(err);
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;    
        });
  });
}




app.post('/register', (req,res)=>{

    var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        } 

        if(mm<10) 
        {
            mm='0'+mm;
        } 

        var seconds = today.getSeconds();
        var minutes = today.getMinutes();
        var hour = today.getHours();
        if (seconds<10){
            seconds='0'+seconds;
        }
        if (minutes<10){
            minutes='0'+minutes;
        }
        if (hour<10){
            hour='0'+hour;
        }
        today = mm+'-'+dd+'-'+yyyy+' '+hour+':'+minutes+':'+seconds;
        var name=req.body.name;
        var last_name=req.body.last_name;
        var birth=req.body.birthday;
        var email=req.body.email;
        var password=req.body.password;
        let user_id = crypto.createHash('md5').update(email).digest("hex");

        var queryString="Insert into users values('"+user_id+"','"+today+"','"+name+"','"+last_name+"','"+birth+"','"+email+"','"+password+"');";

        req.query=queryString;

        register_database(req,res);
        

});
console.log(`Register service listening on port ${port}`);
app.listen(port);


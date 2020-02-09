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




function create_transaction_db(req,res) {
   
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
                return;
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


app.post('/crearTransaccion', (req,res)=>{

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

    var value=req.body.value;
    var points=req.body.points;
    var email=req.body.email;
    let user_id = crypto.createHash('md5').update(email).digest("hex");

    var queryString="INSERT INTO `misdatos`.`transactions` (`transaction_id`, `created_date`, `value`, `points`, `status`, `user_id`) VALUES (null, '"+today+"', "+value+", "+points+", 1, '"+user_id+"');";

    req.query=queryString;
    create_transaction_db(req,res);

     
});

console.log(`Transaction service listening on port ${port}`);
app.listen(port);
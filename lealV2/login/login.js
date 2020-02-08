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

function get_user_database(req,res) {
   
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
                
                console.log(rows);

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

app.post('/login', (req,res)=>{

    var email=req.body.email;
    var password=req.body.password;

    var resp={};

    let user_id = crypto.createHash('md5').update(email).digest("hex");

    var queryString="Select * from users where user_id='"+user_id+"';"

    req.query=queryString;

    req.user_id = user_id;

    if (email == undefined || password == undefined){
        res.json({"code" : 400, "status" : "No email or password specified"});
        return; 
    }

    get_user_database(req,res);

    console.log(res);
});

console.log(`Login service listening on port ${port}`);
app.listen(port);
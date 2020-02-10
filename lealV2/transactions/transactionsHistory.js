const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const mysql = require('mysql');
const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'sql10.freemysqlhosting.net',
    user     : 'sql10322076',
    password : 'gXNBJjsnwq',
    database : 'sql10322076',
    debug    :  false
});


function get_transactions_db(req,res) {
   
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
                res.send(rows);
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

app.get('/transactionsHistory', (req,res)=>{
    var email=req.body.email;
    let user_id = crypto.createHash('md5').update(email).digest("hex");

    var queryString="Select * from transactions where user_id='"+user_id+"' ORDER BY created_date DESC;";

    req.query=queryString;
    req.user_id = user_id;

    get_transactions_db(req,res);

});

console.log(`Transaction service listening on port ${port}`);
app.listen(port);
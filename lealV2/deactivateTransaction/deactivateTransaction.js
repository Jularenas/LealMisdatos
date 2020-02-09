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




function deactivate_transaction_db(req,res) {
   
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


app.put('/inactivarTransaccion', (req,res)=>{
    var trans_id=req.body.transaction_id;

    var queryString="UPDATE transactions  SET status=0 WHERE transaction_id="+trans_id+";";
    req.query=queryString;

    deactivate_transaction_db(req,res);

});

console.log(`Transaction service listening on port ${port}`);
app.listen(port);
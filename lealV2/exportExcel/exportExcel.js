const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

var json2xls = require('json2xls');
var fs = require('fs');


const mysql = require('mysql');
const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());
app.use(json2xls.middleware);

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'misdatos',
    debug    :  false
});







function get_transactions_db(req,res) {
   
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  

        console.log('connected as id ' + connection.threadId);
       

        //console.log(req.query);

        connection.query(req.query,function(err,rows){
            connection.release();
            if(!err) {
                var strRows=JSON.stringify(rows);
                var jsonRows=JSON.parse(strRows);
                console.log(jsonRows);
                //res.send(rows);
                res(jsonRows);
            }          
            else{
                //console.log(err)
                //res.json(err);
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;    
        });
  });
}


app.get('/exportExcel', (req,res)=>{
    var email=req.body.email;

    let user_id = crypto.createHash('md5').update(email).digest("hex");
    var queryString="Select * from transactions where user_id='"+user_id+"'";
    req.query=queryString;
    get_transactions_db(req,function(rows){
        console.log('onCallBack');
        //var data=json2xls(rows);
        console.log("dataConverted");
        res.xls('data.xlsx', rows);
        //fs.writeFileSync('data.xlsx', data, 'binary');
        //console.log('fileWritten');
        //res.download('data.xlsx');
        return;
    });
    //console.log(x);
    
    
});

console.log(`Transaction service listening on port ${port}`);
app.listen(port);
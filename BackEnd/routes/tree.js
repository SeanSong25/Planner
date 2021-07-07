const express = require('express')
const router = express.Router()
const mysql = require('mysql')

function getConnection(){
    return mysql.createPool({
        connectionLimit: 10,
        host:"localhost",
        user: "root",
        password: "123456",
        database: 'PlannerDB',
        multipleStatements: true,
        charset: 'UTF8_GENERAL_CI'
    })
}

router.get('/tree/Data', (req,res)=>{
    const connection = getConnection();
    var sql = "SELECT * FROM element_keys";
    connection.query(sql, (err,result,fields)=>{
        if(err){
            console.log("Insert Failed", err);
            res.sendStatus(500);
            return;
        }
        let data = [];
        for(let item of result){
            data.push(item)
        }
        
        res.json(data);
    })
})

router.post('/tree/Data', (req,res)=>{
    let Pid = req.body.Pid;
    let Name = req.body.label;
    let id = req.body.id;
    var sql = "INSERT INTO element_keys (`Pid`, `id`, `Name`)"+
    "VALUES(?,?,?)";
    const connection = getConnection();
    connection.query(sql, [Pid,id,Name],(err,result,fields)=>{
        if(err){
            console.log("Insert Failed: ",err);
            res.sendStatus(500);
            return;
        }
    })
    res.end();
})

router.post('/tree/Data/delete',(req,res)=>{
    const connection = getConnection();
    const tableSql = "DROP TABLE ";
    var sql = "DELETE FROM element_keys WHERE(`id` = '?')";
    console.log("id",req.body.id);
    let obj = req.body.children_Id;
    let names = req.body.children_names;
    connection.query(tableSql + '`'+req.body.fixedName+'`',(err,result,fields)=>{
        if(err){
            console.log("drop table failed", err);
            res.sendStatus(500);
            return;
        }
    })
    connection.query(sql,[req.body.id],(err,result,fields)=>{
        if(err){
            console.log("delete failed: ", err);
            res.sendStatus(500);
            return;
        }
    })

    for(let item of obj){
        connection.query(sql,[item],(err,result,fields)=>{
            if(err){
            console.log("delete failed: ", err);
            res.sendStatus(500);
            return;
            }

        })
    }

    for(let item of names){
        connection.query(tableSql+'`'+item+'`',(err,result,fields)=>{
            if(err){
                console.log("drop children failed: ", err);
                res.sendStatus(500);
                return;
            }
        })
    }
    res.end();
})

module.exports = router;
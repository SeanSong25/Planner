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
        multipleStatements: true
    })
}

router.get('/tree/Data', (req,res)=>{
    const connection = getConnection();
    var sql = "SELECT * FROM element_keys";
    connection.query(sql, (err,result,fields)=>{
        if(err){
            console.log("Insert Failed");
            res.sendStatus(500);
            return;
        }
        let data = {...result};
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
    var sql = "DELETE FROM element_keys WHERE(`id` = '?')";
    console.log("id",req.body.id);
    let obj = req.body.children_Id;
    connection.query(sql,[req.body.id],(err,result,fields)=>{
        if(err){
            console.log("delete failed: ", err);
            res.sendStatus(500);
            return;
        }
        console.log(sql);
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
    res.end();
})

module.exports = router;
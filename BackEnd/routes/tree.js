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
//the refresh function refreshes all the keys in consecutive order starting from 1, and for all 
//the children of parent key, it loops through and find them and set their Pid to the updated value
/*router.get('/refresh',(req,res)=>{
    const connection = getConnection();
    var sql = "SELECT * FROM element_keys";
    var updateSql = "UPDATE element_keys SET `id` = ? WHERE (`id` = ?)";
    var updateChildSql = "UPDATE element_keys SET `Pid`= ? WHERE (`id` = ?)";
    connection.query(sql,(err,result,field)=>{
        let len = result.length;
        let resultSet = [...result];
        for(let i = 1; i<=len; i++){
            let lastId = result[i-1].id;
            console.log("LastId", lastId);
            console.log("I: ", i);
            connection.query(updateSql,[i,lastId],(err,result,field)=>{
                if(err){
                    console.log("failed", err);
                    res.sendStatus(500);
                    return;
                }
                for(let item of resultSet){
                    console.log("child LastId: ", lastId);
                    console.log("I: ", i);
                    if(item.Pid == lastId){
                        console.log("found child LastId: ", lastId);
                        console.log("I: ", i);
                        connection.query(updateChildSql,[i, item.id],(err,result,field)=>{
                            if(err){
                                console.log(err);
                            }
                        })
                    }
                }
                
            })
        }
    })
    res.end();
})*/

router.get('/tree/Data', (req,res)=>{
    const connection = getConnection();
    var sql = "SELECT * FROM element_keys";
    connection.query(sql, (err,result,fields)=>{
        if(err){
            console.log("Select failed", err);
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
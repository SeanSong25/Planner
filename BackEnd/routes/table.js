const express = require('express')
const router = express.Router()
const mysql = require('mysql')

var getConnection = mysql.createPool({
        connectionLimit: 50,
        host:"localhost",
        user: "root",
        password: "123456",
        database: 'PlannerDB',
        charset:'UTF8_GENERAL_CI',
        multipleStatements: true
    })


router.post("/formtableCreate", (req,res)=>{
    const connection = getConnection;
    const Title = req.body.Title;
    
    /*CREATE TABLE `PlannerDB`.`new_table` (
        `id` INT NOT NULL,
        `Title` VARCHAR(45) NULL,
        PRIMARY KEY (`id`));*/
    const sql = "CREATE TABLE"+'`'+Title+'`'+"(`id` INT NOT NULL, `Title` VARCHAR(45) NOT NULL," +
    "PRIMARY KEY(`id`))";
    connection.query(sql,(err,result,field)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

    })
    res.end()
})

router.post("/fixedtableCreate",(req,res)=>{
    const connection = getConnection;
    const Title = req.body.Title;
    const sql = "CREATE TABLE"+'`'+Title+'`'+"(`id` INT NOT NULL,`Monday` VARCHAR(45) NOT NULL, "+
    "`Tuesday` VARCHAR(45) NOT NULL, `Wednesday` VARCHAR(45) NOT NULL, `Thursday` VARCHAR(45) NOT NULL, "+
    "`Friday` VARCHAR(45) NOT NULL, `Saturday` VARCHAR(45) NOT NULL, `Sunday` VARCHAR(45) NOT NULL, PRIMARY KEY(`id`))";
    connection.query(sql,(err,result,field)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
    })
    res.end();
})



    




module.exports = router;

const express = require('express')
const router = express.Router()
const mysql = require('mysql')


function getConnection() {
    return mysql.createPool({
        connectionLimit: 10,
        host: "localhost",
        user: "root",
        password: "123456",
        database: 'PlannerDB',
        charset: 'UTF8_GENERAL_CI',
        multipleStatements: true
    })
}

function getUnfilled(tableId) {
    return new Promise(function (resolve, reject) {
            const connection = getConnection();
            let sql = "Select * FROM element_keys WHERE (Pid = " + tableId + " )";

            connection.query(sql, (err, result, field) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return reject(err);
                }
                else {
                    var data = [];
                    for (let item of result) {
                        let firstOrderData = {
                            id: item.id,
                            name: item.Name,
                            children: [],
                            label: item.Name
                        }
                        data.push(firstOrderData);
                        resolve(data);
                    }
                }
            })

        }
    )
}

router.get('/fixedFormTable/:id', (req, res) => {
    let tableId = req.params.id;
    getUnfilled(tableId).then(data => {
        console.log("hey", data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })

})

function filler(unfilledOptionName){
    return new Promise((resolve,reject)=>{
        const connection = getConnection();
        let childName = '`'+unfilledOptionName+'`';
        let sql = "SELECT Title FROM "+childName;
        connection.query(sql,(err,result,field)=>{
            if(err){
                return reject(err);
            }
            else{
                console.log(result);
                resolve(result);
            }
        })
    })
}

router.post('/fixedFormTable/filler', async (req,res)=>{
    let result = await loopfiller(req.body);
    console.log(result)
    res.json(result);
})

async function loopfiller(options){
    let data = [];
    
    for(let item of options){
        let results = await filler(item.name);
        
        for(let i of results){
            let Obj = {
                name:i.Title,
                label:i.Title,
                children:undefined
            }
            item.children.push(Obj);
            
        }
        if(results.length==0){
            let newObj = {
                name:item.name,
                label: item.label
            }
            data.push(newObj)
        }
        else{
            data.push(item);
        }
        
    }
    console.log("data: ", data);
    return data;

}
module.exports = router;
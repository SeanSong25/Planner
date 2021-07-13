
const express = require('express')
const router = express.Router()
const mysql = require('mysql')


var getConnection =  mysql.createPool({
        connectionLimit: 50,
        host: "localhost",
        user: "root",
        password: "123456",
        database: 'PlannerDB',
        charset: 'UTF8_GENERAL_CI',
        multipleStatements: true
    })


function getUnfilled(tableId) {
    return new Promise(function (resolve, reject) {
            const connection = getConnection;
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
                            value: item.Name,
                            children: [],
                            label: item.Name
                        }
                        data.push(firstOrderData);
                        
                    }
                    resolve(data);
                }
            })

        }
    )
}

router.get('/fixedFormTable/:id', (req, res) => {
    let tableId = req.params.id;
    getUnfilled(tableId).then(data => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })

})


function filler(unfilledOptionName){
    return new Promise((resolve,reject)=>{
        const connection = getConnection;
        let childName = '`'+unfilledOptionName+'`';
        let sql = "SELECT Title FROM "+childName;
        connection.query(sql,(err,result,field)=>{
            if(err){
                return reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

router.post('/fixedFormTable/filler', async (req,res)=>{
    let result = await loopfiller(req.body);
    
    res.json(result);
})

async function loopfiller(options){
    let data = [];
    
    for(let item of options){
        let results = await filler(item.value);
        
        for(let i of results){
            let Obj = {
                value:i.Title,
                label:i.Title,
                children:undefined
            }
            item.children.push(Obj);
            
        }
        if(results.length==0){
            let newObj = {
                value:item.value,
                label: item.label
            }
            data.push(newObj)
        }
        else{
            data.push(item);
        }
        
    }
    
    return data;

}

router.post("/fixedTableUpdate",(req,res)=>{
    let data = req.body;
    let Title = '`'+data.Title+'`';
    let tableData = data.fieldData;
    
    //REPLACE into table (id, name, age) values(1, "A", 19)
    const connection = getConnection;
    
    for(let item of tableData){
        let sql = "REPLACE into "+Title+"(id, Monday, Tuesday, Wednesday, Thursday, "+
        "Friday, Saturday, Sunday) VALUES (?)";
        let vals = [item.index]
        for(let i in item){
            let arr = item[i]
            if(i!='index')
            {
            valStr = arr[0]+'/'+arr[1];
            vals.push(valStr)
            }
        }
        connection.query(sql,[vals],(err,result,fields)=>{
            if(err){
                console.log("error occurred: ", err);
                res.sendStatus(500)
                return;
            }
        })
    }
    res.end();
})


function getFieldData(Title){
    return new Promise((resolve,reject)=>{
        let sql = "SELECT * FROM "+'`'+Title+'`';
        let connection = getConnection;
        connection.query(sql,(err,result,fields)=>{
            if(err){
                console.log("there is error", err);
                return reject(err);
            }
            else {console.log("resolved");
            console.log(result)
            resolve(result);
            }
        })
    })
}

router.get('/fixedFormTable/tableData/:Title', (req,res)=>{
    let Title = req.params.Title;
    let data=[];
    console.log("before promise")
    getFieldData(Title).then((result)=>{
        for(let item of result){
            let tempObj = {};
            tempObj["index"]=item['id']
            for(let i in item){
                if(i!='id'){
                    tempObj[i]=item[i].split('/',2);
                }
            }
            
            data.push(tempObj);
        }
        res.json(data)
        
    }).catch(
        (e)=>{
            console.log(e)
        }
    )
    
})

function deleteRow(id, Title){
    return new Promise((resolve,reject)=>{
        const connection = getConnection;
        
        let sql = 'DELETE From '+'`'+Title+'`'+" WHERE (id = ?)";
        connection.query(sql,[id],(err,result,fields)=>{
            if(err){
                return reject(err)
            }
                resolve(result);
            
        })

    })
}

router.post('/fixedFormTable/DeleteData',(req,res)=>{
    let indexArr = req.body.indexArr;
    
    let Title = req.body.Title;
    
    for(let item of indexArr){
        deleteRow(item,Title).catch(e=>{
            console.log(e);
            res.sendStatus(500);
            return;
        });
    }
    res.end();
})



module.exports = router;
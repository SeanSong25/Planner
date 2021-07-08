const express = require('express')
const router = express.Router()
const mysql = require('mysql')

router.get('/messages',(req,res)=>{
    res.send("this is a demo message")
})

function getConnection(){
    return mysql.createPool({
        connectionLimit: 10,
        host:"localhost",
        user: "root",
        password: "123456",
        database: 'PlannerDB',
        charset:'UTF8_GENERAL_CI',
        multipleStatements: true
    })
}

router.get('/formTable/Data/:name', (req,res)=>{
    const tableName = '`'+req.params.name+'`';
    const connection = getConnection();
    let sql = 'SELECT * FROM '+tableName;
    connection.query(sql,(err,rows,fields)=>{
        if(err){
            console.error("Failed to query "+err)
            res.sendStatus(500)
            return
        }
        console.log(rows)
        console.log("fetched successfully")
        const data = [];

        for(item of rows)
        {
            data.push(item);
        }
       res.json(data);
    })
    
})

router.post('/formTable/Data', (req,res)=>{
    const connection = getConnection();
    const tableName = '`'+req.body.name+'`';
    //INSERT INTO `PlannerDB`.`demo` (`id`, `Title`, `Warm-up`) VALUES ('2', '2', '2');
    //let sql = "INSERT INTO demo (id,Title,Warm-up,Main-Activity) VALUES (`2`,`2`,`2`,`2`)"
    let ColString = "(`id`,`Title`";
    if(Object.keys(req.body).length == 2){ColString = ColString+')'}
    else{
        for(let item in req.body){
            if(item!='id'&&item!='Title'&&item!='name'){
                ColString+=",`"+item+"`";
            }
        }
        ColString+=')';
    }
    
    let valName = [];
    for(let item in req.body){
        if(item!='name')
        valName.push(req.body[item])
    }
    let sql = "INSERT INTO "+tableName+" "+ColString+" VALUES (?)";
    connection.query(sql,[valName],(err,result,end)=>{
        if(err){console.log(err);
        res.sendStatus(500);
        return;}
        
    });
    
    res.end();
    
})

router.post('/formTable/DataDelete',(req,res)=>{
    const connection = getConnection();
    const tableName = '`'+req.body.name+'`';
    let sql = "DELETE FROM "+tableName+" WHERE (`id` = (?)) ";
    //DELETE FROM `PlannerDB`.`demo` WHERE (`id` = '2');
    connection.query(sql,[req.body.ColNum],(err,result,fields)=>{
        if(err) {console.log(err);
                res.sendStatus(500);
                return;
            }

    })
    
    res.end();

})

router.post('/formTable/Data/allData',(req,res)=>{
    const connection = getConnection();
    const tableName = '`'+req.body.name+'`';
    let sql = "SELECT * FROM "+tableName;
    //UPDATE `PlannerDB`.`demo` SET `Warm-up` = 'hello', `Main-Activity` = 'hi' WHERE (`id` = '2');
    //UPDATE `PlannerDB`.`demo` SET `Main-Activity` = 'hey' WHERE (`id` = '1');

    connection.query(sql,(err,result,fields)=>{
        if(err) {console.log(err);
            res.sendStatus(500);
            return;
        }
        let arrayLength = result.length;
        
        for(let i = 0;  i<arrayLength; i++){
            for(let item in result[i]){
                if(result[i][item]!==req.body.Data[i][item]&&item!='name'){
                    let rowString = '`'+item+'`';
                    let exeSql = "UPDATE "+tableName+" SET "+ rowString+ "= ?"+" WHERE (`id` = '?')";
                    connection.query(exeSql,[req.body.Data[i][item],i+1], 
                    (err,result,fields)=>{
                        console.log(exeSql);
                        if(err){
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }
                    })  
                }
            }
        }   
    }
)
    res.end();
})


router.get('/formTable/nameData/:name',(req,res)=>{

    const connection = getConnection();
    const tableName = '`'+req.params.name+'`';
    let sql = 'SELECT * from '+tableName;
    connection.query(sql,(err,result,fields)=>{
        if(err){
            console.error("Failed to query ")
            res.sendStatus(500)
            return
        }
        console.log("fetched table columns successfully")
        const data = [];
        let ind = 1;
        
        for(item of fields){
            if(item.name!="id")
            {
                let obj = {title: item.name, key: ind}
                ind++;
                data.push(obj)
            }
        }
        res.json(data)
        
    })
})

router.post('/formTable/nameData',(req,res)=>{
    
    const connection = getConnection();
    const tableName = '`'+req.body.name+'`';
    let sql = "ALTER TABLE "+tableName+" ADD COLUMN `" + req.body.title + "` VARCHAR(64) NULL";
    console.log(sql);
    connection.query(sql,(err,rows,fields)=>{
        if(err){
            console.log("error occured when inserting column"+err);
            res.sendStatus(500)
            return
        }
    })
 
    res.end();
})

router.post('/formTable/nameData/delete',(req,res)=>{
    const connection = getConnection();
    const tableName = '`'+req.body.name+'`';
    let sql = "ALTER TABLE "+tableName+" DROP ";
    let colName = "`"+req.body.title+"`";
    sql = sql+colName;
    connection.query(sql,(err,result,fields)=>{
        if(err){
            console.log(err);
            res.sendStatus(500);
            return
        }
    })
    
    res.end();
})

router.get('/formTable/tempData/:name',(req,res)=>{
    const tableName = '`'+req.params.name+'`';
    const connection = getConnection();
    let sql = "SELECT * from "+tableName;
    connection.query(sql,(err,result,fields)=>{
        const data = [];
        let i = 1
        for(item of fields){
                if(item.name!='id')
                {
                    let temp = {};
                    temp["title"] = item.name;
                    temp["key"] = i
                    temp["value"] = ''
                    data.push(temp);
                    i++;
                }  
        }

        res.json(data);
        
    })
   
})



module.exports = router
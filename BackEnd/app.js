const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require("cors")
const bodyParser = require('body-parser')
app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./htmls'))

const router = require('./routes/user.js')
app.use(router)
const treeRouter = require('./routes/tree.js')
app.use(treeRouter)
const tableRouter = require('./routes/table.js')
app.use(tableRouter)
const fixedTableRouter = require('./routes/fixed.js')
app.use(fixedTableRouter)


app.get("/", (req,res)=>{
    console.log("Responding to root route")
    res.send("Hello from root")
})

app.post("/test/1",(req,res)=>{
    //const id = req.params.id;
    //console.log(id);
    console.log("posted")
})

const PORT = process.env.PORT || 3003

app.listen(PORT, ()=>{
    console.log("Server is up and listening on 3003")
})




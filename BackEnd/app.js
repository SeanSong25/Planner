const express = require('express')
const app = express()
const morgan = require('morgan')

const bodyParser = require('body-parser')

app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./htmls'))
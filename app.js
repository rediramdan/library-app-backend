const express = require('express')
var dotenv = require('dotenv');
dotenv.config()

const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routeNavigator = require('./src/index')

const server = app.listen(3001,'192.168.43.67', function(){
    const address = server.address().address
    const port = server.address().port

    console.log('Listening port at '+address+':'+port)
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(function(req,res,next){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","*");
  next();
})
app.use(express.static('src'))
app.use('/', routeNavigator)


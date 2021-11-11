const express = require('express');
const hbs = require('hbs');
const mysql = require('mysql');
const path = require('path');
const app = express();
const PORT =  process.env.PORT || 4000;

const publicDirectoryPath = path.join(__dirname, './public')
const viewPath = path.join(__dirname, './views')

app.use(express.static(publicDirectoryPath))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// middleware
app.set("view engine", "hbs")
app.set("views", viewPath)


const routers = require('./routes/pages')
app.use('/', routers)


app.listen(PORT, function(){
    console.log('listening on port ' + PORT);
})
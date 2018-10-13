var express = require('express');
var bodyParser = require('body-parser');//pull post content from http request
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//var mongo = require('mongo');
var router = express.Router();

var app = express();
app.use(express.static('./views'));
app.use(bodyParser());
//app.use('/api', router);
app.set('view engine','ejs');
app.use('/api',require('./api/routes/index.js'));

app.get('/',function(req,res){
	res.render('login.ejs');
}); 
app.get('/registration',function(req,res){
	res.render('registration.ejs');
}); 

app.get('/dashboard',function(req,res){
	res.render('dashboard.ejs');
}); 
/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/polling-app');*/

app.listen(8080, () => {
    console.log("listining on port 8080");
})
 

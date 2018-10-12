var express = require('express');
var bodyParser = require('body-parser');//pull post content from http request
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//var mongo = require('mongo');
var router = express.Router();
//If extended is false, you can not post "nested object"
// Nested Object = { person: { name: cw } } needed in app for options
var app = express();
app.use(express.static('./views'));
//app.use(bodyParser());//depreciated
app.use(bodyParser.urlencoded({
	extended: true
  }));
app.use(bodyParser.json());
//app.use('/api', router);
app.set('view engine','ejs');

//
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(require('express-jquery')('/jquery.js'));

//

//session
var session = require('express-session');
app.use(session({secret: 'prashant',saveUninitialized: true , resave:true}));

//sssion


app.use('/api',require('./api/routes/index.js'));

app.get('/',function(req,res){
	res.render('login.ejs');
}); 
app.get('/registration',function(req,res){
	res.render('registration.ejs');
}); 

/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/polling-app');*/

app.listen(8081, () => {
    console.log("listining on port 8081");
})


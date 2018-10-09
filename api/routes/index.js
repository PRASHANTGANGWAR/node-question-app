var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var url ='mongodb://localhost:27017/polling-app';
mongoose.connect(url);
var questions = require("./src/questions.js").collection;
// catch 404
// router.use((req, res, next) => { 
//   res.status(404).send('<h2 align=center>Page Not Found!</h2>');
// });

router.get('/', function (req, res) {
    res.send("hello");
});

router.post('/addOptions', function (req, res) {
  console.log(req.body);
  // const inserData = {
  //   id: req.body.newID 
  // }
  questions.insertOne(req.body)
  res.send(req.body);
});



router.get('/login',function(req,res){
	res.render('login.ejs');
});
module.exports = router;






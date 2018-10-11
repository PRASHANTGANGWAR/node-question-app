var express = require('express');
var router = express.Router();

var app = express();

var mongoose = require('mongoose');
var url ='mongodb://localhost:27017/polling-app';
mongoose.connect(url);
var questions = require("./src/questions.js");

var registrationSchema = require('./src/registration').collection;
var loginSchema = require('./src/login')
var bodyParser = require('body-parser');//pull post content from http request

var urlencodedParser = bodyParser.urlencoded({extended:true});
var bodyParser = require('body-parser');//pull post content from http request

app.use(express.static('./views'));
app.use(bodyParser());


var cookieParser = require('cookie-parser')
app.use(cookieParser())

var session = require('express-session');
app.use(session({secret: 'prashant'}));

var sess;


var id = count;

router.get('/', function (req, res) {
    res.send("hello");
});

router.post('/addOptions',async function (req, res) {
  
   if(sess.voted==false){
   id =id;
   var VoteCount = 1;
   var option= req.body.textbox;
   var optionselected = req.body.optionselected;
    if(option==''){
    
    console.log("in if");
    var resp =await questions.updateOne({option:optionselected},{$inc:{VoteCount:1}});
    console.log("mongo",resp)

  }
  else{
    console.log("in else")
    let queryAdd = {id,option,VoteCount};
    var resp =await questions.insertOne(queryAdd);//if option added
    console.log(resp);
    count++;
  }

  await registrationSchema.updateOne({email:sess.email},{$set:{voted:true}});
 res.send("voted");
}
else{
  res.send("why you want to vote again ??? hmmmm ????");
}
});



router.get('/login',function(req,res){
	res.render('login.ejs');
});

router.get('/dashboard',async function(req,res,result){

  try{
    var voted = await registrationSchema.findOne({email:sess.email});
    sess.voted =voted.voted; 
    console.log("voted arr", voted.voted);
    console.log("hhhhhhhhhhhhhhhhhhhh",sess.email);

      let resp = await questions.find({});
      console.log(resp)
            // if (err) return console.log(err)
      res.render('dashboard.ejs',{data:resp,voted:voted.voted});
  }
  catch(e){
      console.log(e)
  }

});
// router.post('/dashboard',async function(req,res,result){

//   try{
    
//     var voted = await registrationSchema.findOne({email:sess.email}); 
//     if(voted.voted==false){
//       var id =req.body.id;
//       var resp= await questionSchema.updateOne({id:4},{$inc:{VoteCount:1}})
//     }
//   }
//   catch(e){
//       console.log(e)
//   }  
// });


router.post('/login', urlencodedParser , async function(req,res,next){
  if (!req.body) return res.sendStatus(400)
  sess = req.session;
  sess.email=req.body.email;
var query = {
      email:req.body.email,
      password:req.body.password
};

  try{
  
      let resp = await registrationSchema.findOne(query);
      //console.log(resp);
      if (resp.length == 0) res.send("Not found");
      else{
        res.redirect('/api/dashboard');
      }
    }
  catch(e){
      console.log(e)
  }

});

// mailer
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: 'prashant.dreamkix@gmail.com',
  pass: 'prashant1001'
}
});
//mailer

//JWT
var jwt = require('jsonwebtoken');
app.set('secret', 'prashant');
//JWT
var count = 1;




var msg
// verify mail 
router.get('verify', (req,res)=>{
  console.log("in verify")
  let token=req.query.token
  jwt.verify(token, app.get('secret'), async function(err, decoded) {
    // add the decoded user name and org name to the request object
    // for the downstream code to use
          username = decoded.username;
          var resp= await registrationSchema.updateOne({email:username},{ $set:{ "active": true } })
          console.log(username);
    //logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
});
})
// verify mail

router.post('/registration', urlencodedParser, async function (req, res) {
      if (!req.body) return res.sendStatus(400)
      req.body.id=count;
      var active=false;
      var voted=false;
      let a = {name,email,password} = req.body;// decorative syntax
      a={id,name,email,password,active,voted};
      console.log(a);
      emailTo = req.body.email;
      // generate token for emaIL
      var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + parseInt(3600000),   // expire time in milliseconds IN HOUR
          username: email   // username is now set to the email specified
      }, app.get('secret'));
      // generate token for emaIL

      // obj = {
      //     id: 1,
      //     name: 'Hello',
      //     email: 'test',
      //     password: 'test',
      //      active :0
      // }
      try{
         // let resp = await (new registrationSchema(obj).save())  
         // var registrationSchema = require('./api/routes/src/registration').collection; without .collection

         let resp = await registrationSchema.insertOne(a);
         count++;

         // return res.send("inserted succesfully")
         // console.log(res)

          // mailer
          var mailOptions = {
              from: 'prashant.dreamkix@gmail.com',
              to: emailTo,
              subject: 'Sending Email using Node.js',
              text: 'http://localhost:8080/api/verify?token='+token
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          //mailer
          res.redirect('/');

      }catch(e){
          console.log(e)
      }
  })



// catch 404
router.use((req, res, next) => { 
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});
  module.exports = router;

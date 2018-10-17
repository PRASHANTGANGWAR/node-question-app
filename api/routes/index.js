var express = require('express');
var router = express.Router();
var app = express();
var mongoose = require('mongoose');
var url ='mongodb://localhost:27017/polling-app';
mongoose.connect(url);
var questions = require("./src/questions.js");
var registrationSchema = require('./src/registration').collection;
//var loginSchema = require('./src/login')
var bodyParser = require('body-parser');//pull post content from http request
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(express.static('./views'));
app.use(bodyParser());

var session = require('express-session');
var cookieParser = require('cookie-parser')
var flash1 = require('connect-flash');
var flash = require('express-flash');
app.use(cookieParser('secret'))
app.use(session({secret: 'prashant',saveUninitialized:true , resave:true,cookie: { maxAge: 60000 }}));
router.use(flash());



router.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});

//JWT
var jwt = require('jsonwebtoken');
app.set('secret', 'prashant');
//JWT

var sess;
var id = count;
var count = 1;
var msg



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

router.get('/forgot',function(req,res){
	res.render('forgot.ejs');
});


router.get('/dashboard',async function(req,res,result){
  try{
    var voted = await registrationSchema.findOne({email:sess.email});
    sess.voted =voted.voted; 
    sess.name = voted.name;
    let resp = await questions.find({});
    res.render('dashboard.ejs',{data:resp,voted:voted.voted,name:voted.name});
  }
  catch(e){
      console.log(e)
  }
});

router.post('/login', urlencodedParser , async function(req,res,next){
  if (!req.body) return res.sendStatus(400)
  sess = req.session;
  sess.email=req.body.email;
var query = {
      email:req.body.email,
      password:req.body.password
};
  try{
    let resp  = await registrationSchema.findOne(query);
    console.log(resp);
    if(!resp)
    {
      req.flash('success', ', Enter Valid Exixting Email ID');   //   req.flash('success', 'Registration successfully');
      res.locals.message = req.flash();
       res.render('login');
      //res.send("not foud");
    }
    else{
      console.log("login",resp);
      if (resp.length == 0  ) {
        req.flash('success', ', Enter Valid Exixting Email ID');   //   req.flash('success', 'Registration successfully');
      res.locals.message = req.flash();
       res.render('login');
      }
      else{
        console.log("isActive",resp.active);
        if(resp.active==true){
        res.redirect('/api/dashboard');
        }
        else{
          req.flash('success', ', Verify Your Mail First');   //   req.flash('success', 'Registration successfully');
          res.locals.message = req.flash();
           res.render('login');        }
      }
    }
  }
  catch(e){console.log(e)}
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

// verify mail 
router.get('/verify', (req,res)=>{
  console.log("in verify")
  let token=req.query.token
  jwt.verify(token, app.get('secret'), async function(err, decoded) {
          username = decoded.username;
          var resp= await registrationSchema.updateOne({email:username},{ $set:{ "active": true } })
          console.log("username of verified mail",username);
          res.render('verified');
});
})
// verify mail

router.post('/registration', urlencodedParser, async function (req, res) {
      if (!req.body) return res.sendStatus(400)
      var query = {
        email:req.body.email,
      };
      let resp  = await registrationSchema.findOne(query);
     // console.log('response for checking emial; existance',resp);

      if(!resp){
      req.body.id=count;
      var active=false;
      var voted=false;
      let a = {name,email,password} = req.body;// decorative syntax
      a={id,name,email,password,active,voted};
      emailTo = req.body.email;
      // generate token for emaIL
      var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + parseInt(3600000),   // expire time in milliseconds IN HOUR
          username: email   // username is now set to the email specified
      }, app.get('secret'));
      // generate token for emaIL
      try{
         let resp = await registrationSchema.insertOne(a);
         count++;
          // mailer
          var mailOptions = {
              from: 'prashant.dreamkix@gmail.com',
              to: emailTo,
              subject: 'verify your mail for voting app',
              text: 'http://localhost:8081/api/verify?token='+token
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

    }

    else{
      req.flash('success', ', Email ID already exists');   //   req.flash('success', 'Registration successfully');
      res.locals.message = req.flash();
       res.render('registration');
    }
  })

router.post('/registration', urlencodedParser, async function (req, res) {
      if (!req.body) return res.sendStatus(400)
      var query = {
        email:req.body.email,
      };
      let resp  = await registrationSchema.findOne(query);
     // console.log('response for checking emial; existance',resp);

      if(!resp){
      req.body.id=count;
      var active=false;
      var voted=false;
      let a = {name,email,password} = req.body;// decorative syntax
      a={id,name,email,password,active,voted};
      emailTo = req.body.email;
      // generate token for emaIL
      var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + parseInt(3600000),   // expire time in milliseconds IN HOUR
          username: email   // username is now set to the email specified
      }, app.get('secret'));
      // generate token for emaIL
      try{
         let resp = await registrationSchema.insertOne(a);
         count++;
          // mailer
          var mailOptions = {
              from: 'prashant.dreamkix@gmail.com',
              to: emailTo,
              subject: 'verify your mail for voting app',
              text: 'http://localhost:8081/api/verify?token='+token
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

    }

    else{
      req.flash('success', ', Email ID already exists');   //   req.flash('success', 'Registration successfully');
      res.locals.message = req.flash();
       res.render('registration');
    }
  })

  router.post('/forgot', urlencodedParser, async function (req, res) {
    console.log("in forgot");
    var email =req.body.email;
    console.log(email);
    let resp  = await registrationSchema.findOne({email});
    console.log("in forgot checking resp", resp);
    if(!resp){
      req.flash('success', ', Email ID not exists reigister first'); 
      res.locals.message = req.flash();
      res.render('forgot');
    }
    else{
      console.log("in else");
          // generate token for emaIL
      var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(3600000),   // expire time in milliseconds IN HOUR
        username: email   // username is now set to the email specified
    }, app.get('secret'));

 
              // mailer
              var mailOptions = {
                from: 'prashant.dreamkix@gmail.com',
                to: email,
                subject: 'Reset your password for Voting App',
                text: 'http://localhost:8081/api/resetPassword?token='+token
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            //mailer
           res.render('login');
    }
    
  });


router.get('/resetPassword',  function (req,res) {

  console.log("in resetpasswrd")
  let token=req.query.token
  jwt.verify(token, app.get('secret'), async function(err, decoded) {
          username = decoded.username;
          res.render('resetPassword.ejs',{username:username});
    });
 
});
router.post('/resetPassword', async function (req,res) {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body.confirmPassword , req.body.password);

  if(req.body.password == req.body.confirmPassword)
  {
  var query = {
    email:req.body.email
    };
    let updaetQuery ={$set:{password:req.body.password}};
  let resp  = await registrationSchema.updateOne(query,updaetQuery);
  // req.flash('success', ' reset sucessfull'); 
  // res.locals.message = req.flash();
  res.redirect('login');
  }
  else{
    req.flash('success', ' Passwod did not match'); 
    res.locals.message = req.flash();
    res.render('resetPassword')
  }
});









// catch 404
router.use((req, res, next) => { 
  res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});



  module.exports = router;

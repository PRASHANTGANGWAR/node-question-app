var express = require('express');
var bodyParser = require('body-parser');//pull post content from http request
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//var mongo = require('mongo');
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({extended:true});
//If extended is false, you can not post "nested object"
// Nested Object = { person: { name: cw } } needed in app for options
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


// jwt token
//var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
//var bearerToken = require('express-bearer-token');


// app.use(expressJWT({
// 	secret: 'thisismysecret'
// }).unless({
// 	path: ['/registration']
// }));

// app.use(bearerToken());
// app.use(function(req, res, next) {
// 	logger.debug(' ------>>>>>> new request for %s',req.originalUrl);
// 	if (req.originalUrl.indexOf('/users') >= 0) {
// 		return next();
// 	}

// 	var token = req.token;
// 	jwt.verify(token, app.get('secret'), function(err, decoded) {
// 		if (err) {
// 			res.send({
// 				success: false,
// 				message: 'Failed to authenticate token. Make sure to include the ' +
// 					'token returned from /users call in the authorization header ' +
// 					' as a Bearer token'
// 			});
// 			return;
// 		} else {
// 			// add the decoded user name and org name to the request object
// 			// for the downstream code to use
// 			req.username = decoded.username;
// 			req.orgname = decoded.orgName;
// 			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
// 			return next();
// 		}
// 	});
// });
//jwt token



app.set('secret', 'prashant');


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


var count = 1;
var registrationSchema = require('./api/routes/src/registration').collection;
var questionSchema = require('./api/routes/src/questions')

var msg

app.get('/verify', (req,res)=>{
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
    app.post('/registration', urlencodedParser, async function (req, res) {
        if (!req.body) return res.sendStatus(400)
        req.body.id=count;
       var active=false;
        var id = count;
         let a = {name,email,password} = req.body;// decorative syntax
         a={id,name,email,password,active};
        console.log(a);
        emailTo = req.body.email;

        var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + parseInt(124578999999),   // expire time in milliseconds
            username: email   // username is now set to the email specified
        }, app.get('secret'));
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
                text: 'http://localhost:8080/verify?token='+token
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
/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/polling-app');*/

app.listen(8080, () => {
    console.log("listining on port 8080");
})

app.post('/update/:id', (req, res) => {
    var id = req.params.id;
    obj =req.body
    //id = parseInt(id);
        id = toString(id);
taskSchema
    .findOneAndUpdate({
        'id':  id  // search query
    }),
    {
        'id': id // field value to update
    },
    {
        new:true
    }
    .then(doc => {
        console.log(doc)
        res.send({'message':doc}) 

    })
    .catch(err => {
        console.error(err)
        res.send({'message':doc}) 

    })

});




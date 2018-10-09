let mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/todo-db";
var connection = mongoose.connection;
connection.on('connected', function()
{
    console.log("connected");
})


// mongoose.connection.openUri(config.mongourl);   // New Syntax
//var db = mongoose.connection;
// //handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
// console.log('connected to modb') // we're connected!
// });
mongoose.connect(url, { useNewUrlParser: true });

let questionSchema = new mongoose.Schema({
  id: Number, 
  options:String,
    VoteCount:Number
})

module.exports = mongoose.model('questions', questionSchema)



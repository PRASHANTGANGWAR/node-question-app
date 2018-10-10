let mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/polling-app";
var connection = mongoose.connection;
connection.on('connected', function()
{
    console.log("connected");
})
mongoose.connect(url, { useNewUrlParser: true });

// to add options in the questions collectuon
let questionSchema = new mongoose.Schema({
  id: Number, 
  options:String,
  VoteCount:Number
})
module.exports = mongoose.model('questions', questionSchema)


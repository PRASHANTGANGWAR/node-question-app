

let mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/polling-app";
var connection = mongoose.connection;
connection.on('connected', function()
{
    console.log("connected optionAdd");
})
mongoose.connect(url, { useNewUrlParser: true });

// to optionAdd 

var Schema = mongoose.Schema;
var optionAdd = new Schema({
    optionAdd:String
})
module.exports = mongoose.model('registrations', optionAdd)

//export default mongoose.model('registration', optionAdd)
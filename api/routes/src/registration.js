

let mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/polling-app";
var connection = mongoose.connection;
connection.on('connected', function()
{
    console.log("connected reg");
})
mongoose.connect(url, { useNewUrlParser: true });

// to register 

var Schema = mongoose.Schema;
var registrationSchema = new Schema({
    id: Number,
    name: String,
    email: String,
    password : String,
    active : Boolean,
    voted :Boolean,
    opted :String
    //  isVerified: { type: Boolean, default: false },
})
module.exports = mongoose.model('registrations', registrationSchema)

//export default mongoose.model('registration', registrationSchema)
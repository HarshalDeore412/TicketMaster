const mongoose = require('mongoose');

const forgotPassSchema = new mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
    token : { type : String, required : true },
    expireAt : { type : Date, default : Date.now, index : { expires : '1d' } }
});

const ForgotPass = mongoose.model('ForgotPass', forgotPassSchema);

module.exports = ForgotPass;

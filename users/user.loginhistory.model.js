const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({

    userId:{type:String,required:true},
    UserName:{type:String,required:true},
    loginIp:{type:String,required:true},
    loginTime:{type:Date,default:Date.now },
    loginEndTime:{type:Date},
    isActive:{type:Boolean,default:true},
    token:{type:String,required:true},
    unique:{type:String,required:true},
    createdDate: { type: Date, default: Date.now }


   
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('loginhistory', schema);
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const schema = new Schema({
//     username: { type: String, unique: true, required: true },
//     hash: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     createdDate: { type: Date, default: Date.now }
// });

// schema.set('toJSON', { virtuals: true });

// module.exports = mongoose.model('User', schema);



const mongoose = require('mongoose');
const config =  require('../config');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive:{type:Boolean,default:true},
    createdDate: { type: Date, default: Date.now },
    createdBy:{type:String},
    LastLoginDate:{type:String},
    role:{type:String,required: true,enum:config.roles,default:config.roles[1]}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('usermaster', schema);

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String,  required: true, },
    email : { type: String, required: true, unique: true,},
    password : { type: String, required: true},
    dob : { type: Date, required: true},
    bio : { type: String, required: true},
    posts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    friends : [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    friendRequests : [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

const userModel = mongoose.model('user', userSchema);

module.exports = { userModel}
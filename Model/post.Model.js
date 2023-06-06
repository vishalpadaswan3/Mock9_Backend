
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    text: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        text: { type: String, required: true },
        createdAt: { type: Date, required: true }
    }]
});

const postModel = mongoose.model('post', postSchema);


module.exports = { postModel }


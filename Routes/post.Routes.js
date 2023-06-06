
const express = require('express');
const { postModel } = require('../Model/post.Model');
const { userModel } = require('../Model/user.Model');
const { auth } = require('../Middleware/auth.middleware');

const postRouter = express.Router();

// get all posts
postRouter.get('/api/posts', async (req, res) => {
    try {
        let posts = await postModel.find({})
        return res.status(200).json({ message: 'Posts fetched successfully', posts: posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// post an post with specific userID
postRouter.post('/api/posts', auth, async (req, res) => {
    try {
        let { text, image } = req.body;
        let userID = req.user.id;

        let up = await userModel.find({ _id: userID })
        let createdAt = Date.now();
        let likes = [];
        let comments = [];

        let post = new postModel({
            user: userID,
            text: text,
            image: image,
            createdAt: createdAt,
            likes: likes,
            comments: comments
        });

        await post.save()
        up[0].posts.push(post._id)
        await up[0].save()
        res.status(200).json({ message: 'Post created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});


// change something in post
postRouter.patch("/api/posts/:id", auth, async (req, res) => {
    try {
       let { id } = req.params;
        let s = await postModel.findByIdAndUpdate({ _id: id }, req.body)
        res.status(200).json({ message: 'Post updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// delete a post
postRouter.delete("/api/posts/:id", auth, async (req, res) => {
    try {
        let { id } = req.params;
        let s = await postModel.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// /api/posts/:id post a like

postRouter.post("/api/posts/:id/like", auth, async (req, res) => {
    try {
        let { id } = req.params;
        let userID = req.user.id;

        let up = await postModel.find({ _id: id })
        up[0].likes.push(userID)
        await up[0].save()

        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' ,error});
    }
})


///api/posts/:id/comment post a comment

postRouter.post("/api/posts/:id/comment", auth, async (req, res) => {
    try {
        let { id } = req.params;
        let userID = req.user.id;
        let { text } = req.body;

        let up = await postModel.find({ _id: id })
        let createdAt = Date.now();

        up[0].comments.push({ user: userID, text: text, createdAt: createdAt })
        await up[0].save()

        res.status(200).json({ message: 'Commented successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// get post by id
postRouter.get('/api/posts/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let post = await postModel.find({ _id: id })
        return res.status(200).json({ message: 'Post fetched successfully', post: post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { postRouter }
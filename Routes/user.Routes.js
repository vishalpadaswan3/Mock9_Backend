
const { userModel } = require('../Model/user.Model');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../Middleware/auth.middleware');


const userRouter = express.Router();

// register
userRouter.post('/api/register', async (req, res) => {

    try {
        let { name, email, password, dob, bio } = req.body;
        let user = await userModel.find({ email: email });
        if (user.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let pass = await bcrypt.hash(password, 10);
        password = pass;
        let posts = [];
        let friends = [];
        let friendRequests = [];

        let newUser = await userModel.create({ name, email, password, dob, bio, posts, friends, friendRequests });
        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// login
userRouter.post('/api/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.find({ email: email });
        if (user.length == 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        let result = await bcrypt.compare(password, user[0].password);
        if (!result) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user[0]._id }, process.env.token_key, { expiresIn: '3h' });
        return res.status(201).json({ message: 'User logged in successfully', token: token, user: user[0] });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get all user
userRouter.get('/api/users', async (req, res) => {
    try {
        let users = await userModel.find({});
        return res.status(200).json({ message: 'Users fetched successfully', users: users });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// list of all friends with specific userID
userRouter.get('/api/users/:id/friends', async (req, res) => {
    try {
        let { id } = req.params;
        let user = await userModel.find({ _id: id });
        if (user.length == 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        let friends = user[0].friends;
        res.status(200).json({ message: 'Friends fetched successfully', friends: friends });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// send friend request to specific userID
userRouter.post('/api/users/:id/friends', auth, async (req, res) => {
    try {
        let { id } = req.params;
        let user = await userModel.find({ _id: id });
        if (user.length == 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        let friendRequests = user[0].friendRequests;

        if (friendRequests.includes(req.user.id)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        friendRequests.push(req.user.id);
        await userModel.updateOne({ _id: id }, { friendRequests: friendRequests });
        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// accept friend request from specific userID
userRouter.patch('/api/users/:id/friends/:friendId', auth, async (req, res) => {
    try {
        let { id, friendId } = req.params;
        let flag = req.body.flag;
        let user = await userModel.find({ _id: id });
        if (user.length == 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (flag) {
            let friendRequests = user[0].friendRequests;
            let friends = user[0].friends;
            if (!friendRequests.includes(friendId)) {
                return res.status(400).json({ message: 'Friend request does not exist' });
            }
            friendRequests = friendRequests.filter((friend) => friend != friendId);
            friends.push(friendId);
            await userModel.updateOne({ _id: id }, { friendRequests: friendRequests, friends: friends });

            let ss = await userModel.find({ _id: friendId });
            let friendRequests1 = ss[0].friendRequests;

            friendRequests1 = friendRequests1.filter((friend) => friend != id);

            let friends1 = ss[0].friends;
            friends1.push(id);

            await userModel.updateOne({ _id: friendId }, { friendRequests: friendRequests1, friends: friends1 });
            return res.status(200).json({ message: 'Friend request accepted successfully' });
        } else {
            let friendRequests = user[0].friendRequests;
            if (!friendRequests.includes(friendId)) {
                return res.status(400).json({ message: 'Friend request does not exist' });
            }
            friendRequests = friendRequests.filter((friend) => friend != friendId);
            await userModel.updateOne({ _id: id }, { friendRequests: friendRequests });
            return res.status(400).json({ message: 'Friend request rejected' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { userRouter }
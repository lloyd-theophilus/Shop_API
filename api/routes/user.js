const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res) => {
    //validating user details at signup
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        //creating new user of the user details length is greater or equal to 1
        if(user.length >= 1){
            res.status(409).json({
                message: 'User email or password already exists.'
            });
        } else{
             //hashing user passwords at signup
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                err: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'User created'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err
                });
            });
        }
    });
        }
    });

});


module.exports = router;
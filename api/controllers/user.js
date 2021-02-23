const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_get_all_users =  (req, res, next) => {
    User.find()
    .select('email password')
    .exec()
    .then(result => {
        console.log(result);
        return res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            message: 'No user found',
            err: err
        })
    })
}

exports.user_signup = (req, res) => {
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

}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    //validaing a plain text passoword from user input to query a user login details from the database
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if(err){
            return res.status(401).json({
                message: 'Auth failed'
            });
        } else if(result) {
            //parse users email and ID to the client using JWT
           const token = jwt.sign(
               {
                email: user[0].email,
                userId: user[0]._id
            },
            "" + process.env.JWT_KEY,
            {
                expiresIn: '1hr'
            }
            );
            return res.status(200).json({
                message: 'Auth successful',
                token: token
            })
        } else {
            return res.status(401).json({
                message: 'Auth failed'
            });
        };

        });
    })
    .catch(err => {
        console.log(err);
         res.status(500).json({
         err: err
     });
    });
}

exports.user_delete_user =  (req, res, next) =>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'User deleted successfully!'
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            err: err
        });
    });
}
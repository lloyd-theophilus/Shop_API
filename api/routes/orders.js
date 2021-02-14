const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const order = require('../models/order');

const Order = require('../models/order');
const product = require('../models/product');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
   order.find()
   .select('product quantity _id')
   .exec()
   .then(docs => {
       res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
            return {
                _id: doc._id,
                product: doc.product,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + doc._id
                }
            }
        })
       })
   })
   .catch(err => {
       res.status(500).json({
           err: err
       })
   })
});

router.post('/', (req, res, next) => {
    product.findById(req.body.productId)
    .then(product => {
//Method to validate product ID before saving
        if(!product) {
            return res.status(500).json({
                message: 'Product not found'
            });
//End of constraint on product ID
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
       return  order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored successfully',
            createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result. quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });

       })
});


router.get('/:orderId', (req, res, next) => {
        res.status(200).json({
            message: 'Order details',
            orderId: req.params.orderId
        });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});



module.exports = router;
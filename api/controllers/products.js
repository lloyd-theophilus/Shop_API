const mongoose = require('mongoose');

const Product = require('../models/product');


exports.products_get_all_products = (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
     const response = {
         count: docs.length,
         product: docs.map(doc => {
             return {
                 name: doc.name,
                 price: doc.price,
                 _id: doc._id,
                 request: {
                     type: 'GET',
                     url: 'http://localhost:3000/products/' + doc._id
                 }
             }
         })
     }
       // if(docs.length >=0){
        res.status(200).json(response)
    // } else{
     //    res.status(404).json({
      //       message: 'Sorry no entries found!, check back later.'
      //   })
    // }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: err
        });
    });
 }

 exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created product successfully',
            createProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            err: err
        });
    });

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc)
        if(doc){
            res.status(200).json(doc);
        } else{
            res.status(404).json({message: 'No entry found for the provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err, err})
    });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product update',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + _id
            }
        })
    })
    .catch(err => {
        console.log(err => {
            res.status(200).json({
                err: err
            })
        });
    });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        id: id
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message:'product deleted',
            request:{
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {name: 'string', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            err: err
        })
    });
}
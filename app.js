const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('./db');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//morgan package to handle all routes
app.use(morgan('dev'));
//Parsing body and handling cors
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Acess-Controll-Allow-Methods', 'PUT, PATCH, POST, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Error handling functions
app.use((req, res, next) => {
    const error = new Error('Not  found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;
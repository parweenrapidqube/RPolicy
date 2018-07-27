'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentDetailsSchema = mongoose.Schema({

    quoteID:String,
    response: Object,
    created_at:String
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });
// mongoose.connect('mongodb://rpqb:rpqb123@ds131583.mlab.com:31583/digitalid', {
//     useMongoClient: true
// });

mongoose.connect('mongodb://parween:parween123@ds263660.mlab.com:63660/digitalid', {
     useMongoClient: true
});

module.exports = mongoose.model('paymentdetails', paymentDetailsSchema);
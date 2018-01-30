'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newUserLoginSchema = mongoose.Schema({

    phone: {
        type: Number,
        unique: true
    },
    created_at: String,
    otp: Number,
    count: Number

});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });

mongoose.connect('mongodb://rpqb:rpqb123@ds131583.mlab.com:31583/digitalid', {
    useMongoClient: true
});



module.exports = mongoose.model('newuser', newUserLoginSchema);

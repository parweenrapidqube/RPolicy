'use strict';

const paymentDetails = require('../models/paymentDetails');

exports.savePaymentDetails = (object) => new Promise((resolve, reject) => {
    console.log("payment details js function file :",object)
    const quoteID = object.quoteId;
    console.log("QuoteID : :",quoteID);
    const details = new paymentDetails({

        quoteID: quoteID,
        response: object,
        created_at: new Date()
    });
    details
        .save()
        .then(() => resolve({status: 201, message: 'Details saved successfully'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'Details Already added !'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});

'use strict';

const paymentDetails = require('../models/paymentDetails');

exports.getPaymentDetailsById = (quoteId) => {

    console.log("QuoteID : :",quoteId);
    const quoteID= ""+quoteId;
    console.log("quoteID : :",quoteID);
    return new Promise((resolve, reject) => {

        paymentDetails

            .find({quoteID : quoteID}).then((results) => {
                console.log("results :",results)
            resolve({status: 201, details: results})

        })
            .catch(err => {

                if (err.code == 11000) {

                    return reject({
                        status: 409,
                        message: 'cant fetch !'
                    });

                } else {
                    console.log("error occurred" + err);

                    return reject({
                        status: 500,
                        message: 'Internal Server Error !'
                    });
                }
            })
    })
};
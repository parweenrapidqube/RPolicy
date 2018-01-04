'use strict';
// const bc_client = require('../blockchain_sample_client'); const bcrypt =
// require('bcryptjs');
var bcSdk = require('../fabcar/invoke.js');

exports.savetransaction = (policyNumber,transactionString) => new Promise((resolve, reject) => {
    const transactiondetails = ({
        policyNumber:policyNumber,
        transactionString: transactionString
        
    });
    console.log("ENTERING THE CORE MODULE");
    bcSdk
        .savetransaction({
            
            TransactionDetails: transactiondetails
        })
        .then((result) => resolve({
            status: 201,
            response:result.response,
            message: 'Policy Issued Sucessfully !'
        }))
        .catch(err => {
            if (err.code == 11000) {
                reject({
                    status: 409,
                    message: 'some error !'
                });
            } else {
                console.log("error occurred" + err);
                reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            }
        });
});

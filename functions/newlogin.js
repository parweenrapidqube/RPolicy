'use strict';

const user = require('../models/newuserlogin');

const users = 'risabh.s';


exports.newlogin = (phonetosend,otp) => new Promise((resolve, reject) => {

    const newUser = new user({

        phone: phonetosend,
        otp: otp,
        created_at: new Date(),
        count:0
    });
    newUser
        .save()
        .then(() => resolve({status: 201, message: 'Please verify your phone no', otp:otp}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'number already registered!'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});

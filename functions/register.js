'use strict';

const user = require('../models/user');

const users = 'risabh.s';


exports.registerUser = (userObject) => new Promise((resolve, reject) => {

    const newUser = new user({

      
        userObject: userObject,
        created_at: new Date()
       
    });
    newUser
        .save()
        .then(() => resolve({status: 201, message: 'User Registered successfully!'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'User Already Registered !'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});
'use strict';

const addexistingPolicy = require('../models/addPolicy');

exports.addPolicy = (userid,addPolicyObject) => new Promise((resolve, reject) => {

    const newPolicy = new addexistingPolicy({

        userid:userid,
        addPolicyObject: addPolicyObject,
        created_at: new Date()
       
    });
    newPolicy
        .save()
        .then(() => resolve({status: 201, message: 'policy added successfully!'}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'policy Already added !'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});
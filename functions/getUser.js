'use strict';

const user = require('../models/newuserlogin');

exports.getUser = (phone) => {

    return new Promise((resolve, reject) => {

        user
            .find({phone:phone}).then((users) => {

            console.log(users)

            resolve({status: 201, usr: users})

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
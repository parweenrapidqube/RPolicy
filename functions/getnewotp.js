'use strict';

const user = require('../models/newuserlogin');

exports.getnewotp = (phone,otp) => {

    return new Promise((resolve, reject) => {

        user.findOneAndUpdate({
            phone: phone
        }, {
            $set: {
                otp: otp,
                created_at:new Date()
            }
        }, {new: true}).then((users) => {

            console.log(users)

            resolve({status: 201, message: 'your otp has been sent successfully to phone'})

        }).catch(err => {

            if (err.code == 11000) {

                return reject({status: 409, message: 'cant fetch !'});

            } else {
                console.log("error occurred" + err);

                return reject({status: 500, message: 'Internal Server Error !'});
            }
        })
    })
};
'use strict';

const user = require('../models/newuserlogin');

exports.loginUser = (otp) =>

    new Promise((resolve, reject) => {

 

        user.find({
                "otp": otp
            })
            .then(newusers => {

                const dbotp = newusers[0];
                console.log(dbotp,"user")
                //console.log(dbpin + "   " + users[0].password)

                if (String(otp) === String(dbotp)) {

                    resolve({
                        status: 200,
                        message:"OTP verified",
                        users: users
                    });

                } else {

                    reject({
                        status: 402,
                        message: ' email or password wrong!'
                    });
                }
            })




            .then(users => {
                console.log(users)
                if (users.length == 0) {

                    reject({
                        status: 404,
                        message: 'User Not Found !'
                    });

                } else {

                    return users[0];

                }
            })


            .catch(err => reject({
                status: 401,
                message: 'user does not exist !'
            }));


    });
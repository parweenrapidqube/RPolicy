'use strict';

const policydetails = require('../models/policydetails');

exports.fetchMotorIssuedPolicy = (userid) => {

    return new Promise((resolve, reject) => {

        policydetails
            .find({rapidID:userid},{
            'vehicleObject.registrationNo':1,
            'vehicleObject.model':1,
            'policyObject.policyName':1,
             'created_at':1,  
             'policyObject.premiumAmount':1,
             'policyObject.sumInsured':1,
             'policyObject.name':1,
             'policyNumber':1,
}
            )
            .then(policylist => {
                 console.log(policylist)
                 console.log(Date.parse(policylist[0]._doc.created_at));
                 var date=new Date(policylist[0]._doc.created_at);
                 console.log(date)
                 var year =date.getFullYear();
                 console.log(year);
                 var month = date.getMonth();
                 console.log(month);
                 var day = date.getDate();
                 console.log(day);
                 var expiredDate = new Date(year + 1, month, day).toString();
                  console.log(expiredDate)

                resolve({
                    status: 201,
                    policylist: policylist,
                    expireddate:expiredDate
                })

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
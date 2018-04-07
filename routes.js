// This is just a sample script. Paste your real code (javascript or HTML) here.
// here only routing is done and if the ro
'use strict';
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('207988A2Bt4ReFksh5ac76ebe');
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
var request = require('request');
var cors = require('cors');
var dateTime = require('node-datetime');
var Promises = require('promise');
const date = require('date-and-time');
const Nexmo = require('nexmo');
var mongoose = require('mongoose');
var Photo = require('./models/documents');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
const log4js = require('./log4js-node/lib/log4js');
log4js.configure({
    appenders: { readypolicy: { type: 'file', filename: 'readypolicy.log' } },
    categories: { default: { appenders: ['readypolicy'], level: 'error' } }
  });

const logger = log4js.getLogger('readypolicy');


  
const config = require('./config/config.json');

const register = require('./functions/register');
const newlogin = require('./functions/newlogin');
const login = require('./functions/login');
const updateprofile = require('./functions/updateprofile');
const verifyemail = require('./functions/emailverification');
const verifyphone = require('./functions/phoneverification');
const getnewotp = require('./functions/getnewotp');
const setpassword = require('./functions/setpassword');
const deleteuser = require('./functions/deleteuser');
const getotpcount = require('./functions/getotpcount');
const registerpublicadjuster = require('./functions/registerpublicadjuster');
const publicadjusterList = require('./functions/publicadjusterList');
const userfullname = require('./functions/userfullname');
const User = require('./functions/getUser');

const motorsavepolicy = require('./functions/motorsavepolicy');
const addPolicy = require('./functions/addPolicy');
const motorfetchSavePolicy = require('./functions/motorfetchSavePolicy');
const motordeletesavepolicy = require('./functions/motordeletesavepolicy');
const policydetails = require('./functions/policydetails');
const savetransaction = require('./functions/savetransaction');
const fetchMotorIssuedPolicy = require('./functions/fetchMotorIssuedPolicy');
const readRequest = require('./functions/readRequest');
const readIndex = require('./functions/readIndex');
const readAllRequest = require('./functions/readAllRequest');
const updatetransaction = require('./functions/updatetransaction');
const brandnewupdatevehical = require('./functions/brandnewupdatevehical');
const calculatepremium = require('./functions/calculatepremium');
const getPolicyinfo = require('./functions/getPolicyinfo');
const gproposal = require('./functions/gproposal');
const calculatecarpremium = require('./functions/calculatecarpremium');
const updatevehicalcardetails = require('./functions/updatevehicaldetails');
const gproposalcar = require('./functions/gproposalcar');
const notifyClaim = require('./functions/notifyClaim');
const createClaim = require('./functions/createClaim');
const rejectClaim = require('./functions/rejectClaim');
const examineClaim = require('./functions/examineClaim');
const negotiateClaim = require('./functions/negotiateClaim');
const negotiateClaimFind = require('./functions/negotiateClaimFind');
const approveClaim = require('./functions/approveClaim');
const settleClaim = require('./functions/settleClaim');
const fetchClaimlist = require('./functions/fetchClaimlist');

const nexmo = new Nexmo({
    apiKey: 'c7ae10d1',
    apiSecret: '5d6766133225cd92'
});

// connection to email API
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.office365.com',
    port: 25,
    secure: true,
    auth: {
        user: "arun.hossamani@rapidqube.com",
        pass: "8983028@Ar"
    }
});

var requestList = [];

module.exports = router => {

    router.get('/', (req, res) => res.send("Welcome to commercial-insurance,please hit a service !"));

    router.post('/registerUser', cors(), (req, res) => {

        const userObject = req.body.userObject;
        console.log(userObject);
        


            register
                .registerUser(userObject)
                .then(result => {

                   
                    res
                        .status(result.status)
                        .json({
                            message: result.message
                        
                        });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
        
    });
   
  

    router.post('/newLogin1', cors(), (req, res) => {

    logger.fatal('Hitting Login services.......');
        var phonetosend = req.body.phone;

        var otp = "";
        var possible = "0123456789";
       
        for (var i = 0; i < 4; i++)
            otp += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("otp" + otp);
        logger.fatal('OTP getting generate'+ '-->' +otp);
        sendOtp.send(phonetosend, "RDYPOL", otp, function (error, data, response) {
            console.log(data);
           // console.log("response",response)
            console.log(otp,"otp")
          });
        var otptosend = 'your otp is ' + otp;

        if (!phonetosend) {
            logger.error('Invalid Request');
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {
            User
            .getUser(phonetosend)
            .then(result => {
                if (result.usr.length == 0) {
                   
            newlogin
                .newlogin(phonetosend, otp)
                .then(result => {

                    
                    console.log(token,"token")
                    // nexmo
                    //     .message
                    //     .sendSms('919768135452', phonetosend, otptosend, {
                    //         type: 'unicode'
                    //     }, (err, responseData) => {
                    //         if (responseData) {
                    //             console.log(responseData)
                    //         }
                    //     });
                    res
                        .status(result.status)
                        .json({
                            message: result.message,
                            token:token,
                            phone: phonetosend
                        });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
        }else{

            getnewotp
            .getnewotp(phonetosend, otp)
            .then(result => {
                const token = jwt.sign(result, config.secret, {
                    expiresIn: 60000
                })
                res
                    .status(result.status)
                    .json({
                        message: result.message,
                        token:token,
                        otp:otp
                    });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        }
    
    });
    }
    });



    router.post('/newLogin', cors(), (req, res) => {


        var phonetosend = req.body.phone;

        var otp = "";
        var possible = "0123456789";
        for (var i = 0; i < 4; i++)
            otp += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("otp" + otp);

        var otptosend = 'your otp is ' + otp;

        if (!phonetosend) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            newlogin
                .newlogin(phonetosend, otp)
                .then(result => {

                    const token = jwt.sign(result, config.secret, {
                        expiresIn: 60000
                    })

                    nexmo
                        .message
                        .sendSms('919768135452', phonetosend, otptosend, {
                            type: 'unicode'
                        }, (err, responseData) => {
                            if (responseData) {
                                console.log(responseData)
                            }
                        });
                    res
                        .status(result.status)
                        .json({
                            message: result.message,
                            token:token,
                            otp: result.otp
                        });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
        }
    });

    router.post('/otp', cors(), (req, res) => {

        const otp = req.body.otp;

   

        if (!otp) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {
            
               
                   
                        //var status = result.usr[0]._doc.status
                        
                            login
                                .loginUser(otp)
                            

                                    .then(result => {

                                    res
                                        .status(result.status)
                                        .json({
                                            message: result.message,
                                            token: token,
                                            userdetails: result.users[0]
                                        });

                                })
                                .catch(err => res.status(err.status).json({
                                    message: err.message
                                }));
                      
                    
                

        }
    });

    router.post('/UpdateProfile', cors(), (req, res) => {

        const email = req.body.email;
        console.log(email);
        var emailtosend = email;
        console.log(emailtosend);
        const password = req.body.password;
        console.log(password);

        const userObject = req.body.userObject;
        console.log(userObject);

        const usertype = req.body.usertype;
        console.log(usertype);

        if (!email || !password || !usertype) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            updateprofile
                .updateprofile(email, password, userObject, usertype)
                .then(result => {

                    res
                        .status(result.status)
                        .json({
                            message: result.message
                        });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
        }
    });

    router.get("/email/verify", cors(), (req, res, next) => {
        var status;
        var querymail = req.query.mail;
        var email = req.query.email;
        console.log("URL: " + querymail);
        console.log("email: " + email);
        User
            .getUser(email)
            .then(result => {
                var minutes1 = new Date(result.usr[0]._doc.created_at).getMinutes();
                console.log("minutes1" + minutes1);
                var minutes2 = new Date().getMinutes();
                console.log("minutes2" + minutes2);
                var diffinminutes = minutes2 - minutes1;
                if (diffinminutes > 10) {
                    deleteuser
                        .deleteuser(email)
                        .then(result => {
                            res.send({
                                status: 201,
                                message: 'your email link has been expired please register again'
                            });
                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));

                } else {
                    verifyemail
                        .emailverification(querymail)
                        .then(result => {
                            var status = result.usr.status
                            if (status.length == 2) {
                                res.send({
                                    "status": true,
                                    "message": "registration successful"
                                });
                            } else {

                                res.send({
                                    "status": false,
                                    "message": "please verify mobile no too"
                                });
                            }

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                }
            });
    });

    router.post("/newotp", cors(), (req, res, next) => {
        var phonetosend = req.body.phone;
        var email = req.body.email;
        var emailtosend = email;
        var otp = "";
        var possible = "0123456789";
        for (var i = 0; i < 4; i++)
            otp += possible.charAt(Math.floor(Math.random() * possible.length));
        var otptosend = 'your new otp is ' + otp;

        if (!email || !phonetosend) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            var mailOptions = {
                transport: transporter,
                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                to: emailtosend,
                subject: 'OTP Confirmation',

                html: "Hello,<br> Your Otp is.<br> " + otp
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {}
            });
            nexmo
                .message
                .sendSms('919768135452', phonetosend, otptosend, {
                    type: 'unicode'
                }, (err, responseData) => {
                    if (responseData) {
                        console.log(responseData)
                    }
                });
            getnewotp
                .getnewotp(email, otp)
                .then(result => {
                    res
                        .status(result.status)
                        .json({
                            message: result.message
                        });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    router.post("/getotpcount", cors(), (req, res, next) => {
        var count = req.body.count;
        var email = req.body.email;

        getotpcount
            .getotpcount(email, count)
            .then(result => {
                res
                    .status(result.status)
                    .json({
                        email: result.email,
                        count: result.count
                    });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    });

    router.post("/user/phoneverification", cors(), (req, res) => {
        logger.fatal('Entering into phone verification');
        const phone = parseInt(req.body.phone);
        var otp = req.body.otp;
        const userinfo = req.body.user;
        console.log(otp);
        console.log(phone);
        console.log(userinfo);
        User
            .getUser(phone)
            .then(result => {
                if (result.usr.length == 0) {
                    res.send({
                        status: 401,
                        message: 'user does not exist !'
                    });
                } else {
                var minutes1 = new Date(result.usr[0]._doc.created_at).getMinutes();
                console.log("minutes1" + minutes1);
                var minutes2 = new Date().getMinutes();
                console.log("minutes2" + minutes2);
                var diffinminutes = minutes2 - minutes1;
                if (diffinminutes > 10) {
                    logger.error('your otp has been expired please request new one');
                    res.send({
                        status: 201,
                        message: 'your otp has been expired please request new one'
                    });
                } else {
                    verifyphone
                        .phoneverification(otp, phone, userinfo)
                        .then(result => {

                            if (result.status === 202) {

                                const token = jwt.sign(result, config.secret, {
                                    expiresIn: 60000
                                })

                                res
                                    .status(result.status)
                                    .json({
                                        message: result.message,
                                        token: token

                                    });
                               
                            } else {

                                if (result.status === 404) {
                                    res
                                        .status(result.status)
                                        .json({
                                            message: result.message
                                        });
                                } else {
                                    logger.fatal('sucessfully verified'+'-->'+phone);
                                    res
                                        .status(200)
                                        .json({
                                            message: "please verify emailid too",
                                            status: false
                                        });

                                }
                            }

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                }
            }
            })
        
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    });

    router.post("/setPassword", cors(), (req, res, next) => {
        var password = req.body.password;
        var email = req.body.email;

        setpassword
            .setpassword(email, password)
            .then(result => {
                res
                    .status(result.status)
                    .json({
                        message: result.message
                    });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    });

    router.get('/publicadjusterlist', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);

        if (!userid || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            publicadjusterList
                .publicadjusterList(userid)
                .then(function(result) {
                    console.log(result)

                    res
                        .status(result.status)
                        .json({
                            status: result.status,
                            message: result.usr
                        })
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }

    });

    router.post('/userfullname', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);
        const rapidid = req.body.rapidID;
        console.log(rapidid);
        if (!rapidid || !rapidid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            userfullname
                .userfullname(rapidid)
                .then(function(result) {
                    console.log(result)

                    res
                        .status(result.status)
                        .json({
                            status: result.status,
                            fullname: result.usr
                        })
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }

    });

    router.post("/motorfetchPolicyQuotes", (req, res) => {
        var id = getUserId(req)

        console.log("id" + id);
        const insuranceObject = (req.body.insuranceObject);
        console.log("insuranceObject" + JSON.stringify(insuranceObject));
        const _id=req.body._id
        

        if (!id || !id.trim()) {

            res
                .status(400)
                .json({
                    "status": false,
                    "message": 'Invalid Request !'
                });

        } else {

            var policyList;
           if(insuranceObject.vehicleType == "Bike"){
            if(insuranceObject.variant == "F1 149 CC"){
                policyList = [{
                    "SrNo": 1,
                    "Policy Name": "Bharati Insurance",
                    "Premium Amount": "1322",
                    "IDV": "20,347",
                    "Insured Declared Value": "3,21,402",
                    "NCB": "10%",
                    "Cashless Garage": "Nil",
                    "Advance Cash": "Nil",
                    "Tp Premium": "Nil",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "N/A",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 2,
                    "Policy Name": "Ergo Insurance",
                    "Premium Amount": "1452",
                    "IDV": "22,647",
                    "Insured Declared Value": "3,17,402",
                    "NCB": "15%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "3,45,000",
                    "Tp Premium": "3,45,000",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 3,
                    "Policy Name": "Oriental Insurance",
                    "Premium Amount": "1682",
                    "IDV": "21,654",
                    "Insured Declared Value": "3,10,402",
                    "NCB": "20%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,50,000",
                    "Zero Depreciation": "3 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 4,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1482",
                    "IDV": "23,654",
                    "Insured Declared Value": "3,20,402",
                    "NCB": "18%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,30,500",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 5,
                    "Policy Name": "ICICI Lombard Insurance",
                    "Premium Amount": "1682",
                    "IDV": "27,654",
                    "Insured Declared Value": "3,50,602",
                    "NCB": "22%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,45,500",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 6,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1542",
                    "IDV": "25,543",
                    "Insured Declared Value": "3,42,675",
                    "NCB": "19%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,43,450",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }]

            } else if (insuranceObject.variant == "STD 149 CC") {
                
                                policyList = [{
                                    "SrNo": 1,
                                    "Policy Name": "Bharati Insurance",
                                    "Premium Amount": "1322",
                                    "IDV": "20,347",
                                    "Insured Declared Value": "3,21,402",
                                    "NCB": "10%",
                                    "Cashless Garage": "Nil",
                                    "Advance Cash": "Nil",
                                    "Tp Premium": "Nil",
                                    "Zero Depreciation": "2 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "N/A",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                                }, {
                                    "SrNo": 2,
                                    "Policy Name": "Ergo Insurance",
                                    "Premium Amount": "1452",
                                    "IDV": "22,647",
                                    "Insured Declared Value": "3,17,402",
                                    "NCB": "15%",
                                    "Cashless Garage": "3 Garages Near You",
                                    "Advance Cash": "3,45,000",
                                    "Tp Premium": "3,45,000",
                                    "Zero Depreciation": "1 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "Nil",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                
                                }, {
                                    "SrNo": 3,
                                    "Policy Name": "Oriental Insurance",
                                    "Premium Amount": "1682",
                                    "IDV": "21,654",
                                    "Insured Declared Value": "3,10,402",
                                    "NCB": "20%",
                                    "Cashless Garage": "2 Garages Near You",
                                    "Advance Cash": "Nil",
                                    "Tp Premium": "3,50,000",
                                    "Zero Depreciation": "3 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "Nil",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                
                                }, {
                                    "SrNo": 4,
                                    "Policy Name": "Reliance Life Insurance",
                                    "Premium Amount": "1482",
                                    "IDV": "23,654",
                                    "Insured Declared Value": "3,20,402",
                                    "NCB": "18%",
                                    "Cashless Garage": "3 Garages Near You",
                                    "Advance Cash": "Nil",
                                    "Tp Premium": "3,30,500",
                                    "Zero Depreciation": "1 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "Nil",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                
                                }, {
                                    "SrNo": 5,
                                    "Policy Name": "ICICI Lombard Insurance",
                                    "Premium Amount": "1682",
                                    "IDV": "27,654",
                                    "Insured Declared Value": "3,50,602",
                                    "NCB": "22%",
                                    "Cashless Garage": "2 Garages Near You",
                                    "Advance Cash": "Nil",
                                    "Tp Premium": "3,45,500",
                                    "Zero Depreciation": "2 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "Nil",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                                }, {
                                    "SrNo": 6,
                                    "Policy Name": "Reliance Life Insurance",
                                    "Premium Amount": "1542",
                                    "IDV": "25,543",
                                    "Insured Declared Value": "3,42,675",
                                    "NCB": "19%",
                                    "Cashless Garage": "2 Garages Near You",
                                    "Advance Cash": "Nil",
                                    "Tp Premium": "3,43,450",
                                    "Zero Depreciation": "2 Claims Per Year",
                                    "Already Included Addons": "Nil",
                                    "Own Damage": "Nil",
                                    "Owner/Driver PA Cover": "Accessible",
                                    "Unnamed Pasanger Cover": "N/A"
                                }]
                
                            }
                            else{


                            }
            }else if (insuranceObject.vehicleType == "Car"){
            if ( insuranceObject.variant == "AC 4 SPEED(796CC)") {

                policyList = [{
                    "SrNo": 1,
                    "Policy Name": "Bharati Insurance",
                    "Premium Amount": "1322",
                    "IDV": "20,347",
                    "Insured Declared Value": "3,21,402",
                    "NCB": "10%",
                    "Cashless Garage": "Nil",
                    "Advance Cash": "Nil",
                    "Tp Premium": "Nil",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "N/A",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 2,
                    "Policy Name": "Ergo Insurance",
                    "Premium Amount": "1452",
                    "IDV": "22,647",
                    "Insured Declared Value": "3,17,402",
                    "NCB": "15%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "3,45,000",
                    "Tp Premium": "3,45,000",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 3,
                    "Policy Name": "Oriental Insurance",
                    "Premium Amount": "1682",
                    "IDV": "21,654",
                    "Insured Declared Value": "3,10,402",
                    "NCB": "20%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,50,000",
                    "Zero Depreciation": "3 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 4,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1482",
                    "IDV": "23,654",
                    "Insured Declared Value": "3,20,402",
                    "NCB": "18%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,30,500",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 5,
                    "Policy Name": "ICICI Lombard Insurance",
                    "Premium Amount": "1682",
                    "IDV": "27,654",
                    "Insured Declared Value": "3,50,602",
                    "NCB": "22%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,45,500",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 6,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1542",
                    "IDV": "25,543",
                    "Insured Declared Value": "3,42,675",
                    "NCB": "19%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,43,450",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }]

            } else if (insuranceObject.variant == "LPG AC") {

                policyList = [{
                    "SrNo": 1,
                    "Policy Name": "Bharati Insurance",
                    "Premium Amount": "1322",
                    "IDV": "20,347",
                    "Insured Declared Value": "3,21,402",
                    "NCB": "10%",
                    "Cashless Garage": "Nil",
                    "Advance Cash": "Nil",
                    "Tp Premium": "Nil",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "N/A",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 2,
                    "Policy Name": "Ergo Insurance",
                    "Premium Amount": "1452",
                    "IDV": "22,647",
                    "Insured Declared Value": "3,17,402",
                    "NCB": "15%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "3,45,000",
                    "Tp Premium": "3,45,000",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 3,
                    "Policy Name": "Oriental Insurance",
                    "Premium Amount": "1682",
                    "IDV": "21,654",
                    "Insured Declared Value": "3,10,402",
                    "NCB": "20%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,50,000",
                    "Zero Depreciation": "3 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 4,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1482",
                    "IDV": "23,654",
                    "Insured Declared Value": "3,20,402",
                    "NCB": "18%",
                    "Cashless Garage": "3 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,30,500",
                    "Zero Depreciation": "1 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"

                }, {
                    "SrNo": 5,
                    "Policy Name": "ICICI Lombard Insurance",
                    "Premium Amount": "1682",
                    "IDV": "27,654",
                    "Insured Declared Value": "3,50,602",
                    "NCB": "22%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,45,500",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }, {
                    "SrNo": 6,
                    "Policy Name": "Reliance Life Insurance",
                    "Premium Amount": "1542",
                    "IDV": "25,543",
                    "Insured Declared Value": "3,42,675",
                    "NCB": "19%",
                    "Cashless Garage": "2 Garages Near You",
                    "Advance Cash": "Nil",
                    "Tp Premium": "3,43,450",
                    "Zero Depreciation": "2 Claims Per Year",
                    "Already Included Addons": "Nil",
                    "Own Damage": "Nil",
                    "Owner/Driver PA Cover": "Accessible",
                    "Unnamed Pasanger Cover": "N/A"
                }]

            }
        }
            motorsavepolicy
                .motorsavepolicy(id,_id,insuranceObject)
                .then((result) => {
                    console.log("_id" + result._id)
                    res
                        .status(200)
                        .json({
                            "status": true,
                            "message": result.message,
                            "policyList": policyList,
                            "_id": result._id
                        });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        }
    });

    router.get('/motorfetchSavePolicy', cors(), (req, res) => {
        const userid = getUserId(req)
        console.log(userid);

        if (!userid || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            motorfetchSavePolicy
                .motorfetchSavePolicy(userid)
                .then(function(result) {
                    console.log(result)
                    res
                        .status(result.status)
                        .json({
                            status: result.status,
                            policylist: result.policylist
                        })
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }

    });

    router.post('/motorIssuePolicy', cors(), function(req, res) {
        var id = getUserId(req)
        var policydetailmessage;
        var transactiondeletemessage;

        const _id = (req.body.transactionString._id).toString()
        console.log("_id" + _id);
        const phonetosend = req.body.transactionString.policydetails.phone;
        console.log(phonetosend);
        const emailtosend = req.body.transactionString.policydetails.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 working days to receive your copy of the Insurance Policy Document';
        var transaction = req.body.transactionString;
        console.log(transaction)
        var policy = transaction.policydetails;
        var vehicle = transaction.vehicledetails;

        var policyNumber = "";
        var possible = "01234567891011121314151617181920213031404151523548854547585474654987878";
        for (var i = 0; i < 10; i++)
            policyNumber += possible.charAt(Math.floor(Math.random() * possible.length));

        var object = {
            "from": policy.name,
            "to": policy.companyName,
            "policyName": policy.policyName,
            "premiumPayment": policy.premiumPayment
        }
        // object = function(policy, vehicle) {
        //     var record = {};

        //     function set(k) {
        //         record[k] = this[k];
        //     }
        //     Object
        //         .keys(policy)
        //         .forEach(set, policy);
        //     Object
        //         .keys(vehicle)
        //         .forEach(set, vehicle);

        //     return record;
        // }(policy, vehicle)

        var transactionString = JSON.stringify(object)
        console.log(transactionString)



        var firstMethod = function() {
            var promise = new Promise(function(resolve, reject) {
                policydetails
                    .policydetails(policyNumber, id, policy, vehicle)
                    .then(result => {
                        policydetailmessage = result.message
                        console.log("policydetailmessage" + policydetailmessage);
                        resolve(policydetailmessage);

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            });
            return promise;
        };

        var secondMethod = function() {
            var promise = new Promise(function(resolve, reject) {

                motordeletesavepolicy
                    .motordeletesavepolicy(_id)
                    .then(function(result) {
                        transactiondeletemessage = result.message
                        console.log("transactiondeletemessage" + transactiondeletemessage);
                        resolve(transactiondeletemessage);

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            });
            return promise;
        };

        var thirdMethod = function() {

            savetransaction
                .savetransaction(policyNumber, transactionString)
                .then((result) => {
                    if (result !== null && result !== '') {
                        var mailOptions = {
                            transport: transporter,
                            from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                            to: emailtosend,
                            subject: 'Policy Issue Notification',

                            html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {}
                        });
                        // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                        //         type: 'unicode'     }, (err, responseData) => {         if
                        // (responseData) {             console.log(responseData)         }     });

                        res
                            .status(200)
                            .json({
                                "message": "Policy issued succesfully !",
                                "status": "success"
                            });
                    }

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        };
        firstMethod()
            .then(secondMethod)
            .then(thirdMethod);

    });

    router.post('/brandnewupdatevehical', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Entering in Brandnewupdatevehicle');
        const updatevehical = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(updatevehical,"brandnewupdatevehical")
      
        
        
    
         if (!updatevehical) {
        logger.error('Body is Invalid');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
    
        brandnewupdatevehical.brandnewupdatevehical(updatevehical)
        
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });

    router.post('/calculatepremium', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Entering Into Calculate Premium......');
        const premiumrequest = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(premiumrequest,"premiumrequest")
      
        
        
    
         if (!premiumrequest) {
        logger.error('Body Is Invalid');
        console.log("invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
        logger.fatal('Premium Request Sucessfull....');
        calculatepremium.calculatepremium(premiumrequest)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });   

    router.post('/gproposalrequest', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Hitting gproposal for two wheeler');
        const proposalrequest = req.body.GPROPOSALREQUEST;
       
      
       console.log(proposalrequest,"proposalrequest")
      
        
        
    
         if (!proposalrequest) {
        logger.error('Body is Invalid...');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{

            gproposal.gproposal(proposalrequest)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });

    router.post('/calculatecarpremium', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
      
logger.fatal('Entering in Calculate Premium....');

    
        const calculatepremium = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(calculatepremium,"calculatepremium")
      // logger.debug("Some debug messages");
      
        
        
    
         if (!calculatepremium) {
        logger.fatal('Body is not valid...');
        console.log("invalid body")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
    
            calculatecarpremium.calculatecarpremium(calculatepremium)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
            
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });  
    
    router.post('/updatevehicalcardetails', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Entering in Update Vehicle car details..');
        const updatevehical = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(updatevehical,"updatevehical")
      
        
        
    
         if (!updatevehical) {
        logger.error('Body is Invalid....');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
    
            updatevehicalcardetails.updatevehical(updatevehical)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });
    
    router.post('/gproposalcar', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Hitting gproposal car...');
        const gpproposalcar = req.body.GPROPOSALREQUEST;
       
      
       console.log(gpproposalcar,"gpproposalcar")
      
        
        
    
         if (!gpproposalcar) {
            if (!checkToken(req)) {
                console.log("invalid token")
                return res.status(401).json({
                    message: "invalid token"
                })
            }
            logger.error('Body is Invalid..');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
    
            gproposalcar.gpcar(gpproposalcar)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });

    router.post('/calculatepremiumrollover', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Entering Into Calculate Premium Rollover......');
        const premiumrequest = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(premiumrequest,"premiumrequest")
      
        
        
    
         if (!premiumrequest) {
        logger.error('Body Is Invalid');
        console.log("invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
        logger.fatal('Premium Request Sucessfull....');
        calculatepremium.calculatepremium(premiumrequest)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });   

    router.post('/brandnewupdatevehicalrollover', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        
        logger.fatal('Entering in Brandnewupdatevehicle Rollover');
        const updatevehical = req.body.CALCULATEPREMIUMREQUEST;
       
      
       console.log(updatevehical,"brandnewupdatevehical")
      
        
        
    
         if (!updatevehical) {
        logger.error('Body is Invalid');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{
    
        brandnewupdatevehical.brandnewupdatevehical(updatevehical)
        
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });

    router.post('/gproposalrequestrollover', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
        logger.fatal('Hitting gproposal for two wheeler rollover....');
        const proposalrequest = req.body.GPROPOSALREQUEST;
       
      
       console.log(proposalrequest,"proposalrequest")
      
        
        
    
         if (!proposalrequest) {
        logger.error('Body is Invalid...');
        console.log(" invalid body ")
        return res.status(400).json({
            message: 'Invalid Request !'
        });
    
    }else{

            gproposal.gproposal(proposalrequest)
    
        .then(result => {
           
                res.status(result.status).json({
                    message: result.message,
                    response: result.Response
                })
            })
    
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    
        }
    });

    router.post('/calculatecarpremiumrollover', (req, res) => {
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }
      
        logger.fatal('Entering in Calculate Premium Rollover....');
        
            
                const calculatepremium = req.body.CALCULATEPREMIUMREQUEST;
               
              
               console.log(calculatepremium,"calculatepremium")
              // logger.debug("Some debug messages");
              
                
                
            
                 if (!calculatepremium) {
                logger.fatal('Body is not valid...');
                console.log("invalid body")
                return res.status(400).json({
                    message: 'Invalid Request !'
                });
            
            }else{
            
                    calculatecarpremium.calculatecarpremium(calculatepremium)
            
                .then(result => {
                   
                        res.status(result.status).json({
                            message: result.message,
                            response: result.Response
                        })
                    })
                    
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            
                }
            });  

            router.post('/updatevehicalcardetailsrollover', (req, res) => {
                logger.fatal('Entering in Update Vehicle car details Rollover..');
                const updatevehical = req.body.CALCULATEPREMIUMREQUEST;
               
              
               console.log(updatevehical,"updatevehical")
              
                
                
            
                 if (!updatevehical) {
                logger.error('Body is Invalid....');
                console.log(" invalid body ")
                return res.status(400).json({
                    message: 'Invalid Request !'
                });
            
            }else{
            
                    updatevehicalcardetails.updatevehical(updatevehical)
            
                .then(result => {
                   
                        res.status(result.status).json({
                            message: result.message,
                            response: result.Response
                        })
                    })
            
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            
                }
            });

            router.post('/gproposalcarrollover', (req, res) => {
                if (!checkToken(req)) {
                    console.log("invalid token")
                    return res.status(401).json({
                        message: "invalid token"
                    })
                }
                logger.fatal('Hitting gproposal car Rollover...');
                const gpproposalcar = req.body.GPROPOSALREQUEST;
               
              
               console.log(gpproposalcar,"gpproposalcar")
              
                
                
            
                 if (!gpproposalcar) {
                    logger.error('Body is Invalid..');
                console.log(" invalid body ")
                return res.status(400).json({
                    message: 'Invalid Request !'
                });
            
            }else{
            
                    gproposalcar.gpcar(gpproposalcar)
            
                .then(result => {
                   
                        res.status(result.status).json({
                            message: result.message,
                            response: result.Response
                        })
                    })
            
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));
            
                }
            });

            router.get("/getPolicyinfo", cors(), (req, res) => {
            
                    getPolicyinfo.getPolicyinfo()
                     .then(function(result) {
                         console.log("result.query---->", JSON.stringify (result.query));
                         return res.json({
                             "status": 200,
                             "getdata": JSON.stringify (result.query)
                         });
                     })
                     .catch(err => res.status(err.status).json({
                         message: err.message
                     }));
              
             
             
         });
    router.post("/addPolicy", (req, res) => {
        const userid = getUserId(req)
        console.log(userid);
        const addPolicyObject=req.body.addPolicyObject;

        if (!userid || !userid.trim()) {
            // the if statement checks if any of the above paramenters are null or not..if
            // is the it sends an error report.
            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            addPolicy
                .addPolicy(userid,addPolicyObject)
                .then(function(result) {
                    console.log(result)

                    return res.json({
                        "status": true,
                        "message":result.message 
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }

    });

    router.get("/readIndex", cors(), (req, res) => {

        if (checkToken(req)) {

            readIndex
                .readIndex({})
                .then(function(result) {
                    var firstrequest = result.query[0]
                    console.log("firstrequest--", firstrequest);
                    var length = result.query.length;
                    var lastrequest = result.query[length - 1];
                    console.log("lastrequest--", lastrequest);
                    if (requestList.length === 0) {
                        requestList.push(firstrequest.requestid);
                        requestList.push(lastrequest.requestid);

                    }

                    return res.json({
                        "status": 200,
                        "requestrange": requestList
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res
                .status(401)
                .json({
                    "status": false,
                    message: 'cant fetch data !'
                });
        }
    });

    router.get("/readAllrequest", cors(), (req, res) => {

        
        if (!checkToken(req)) {
            console.log("invalid token")
            return res.status(401).json({
                message: "invalid token"
            })
        }


            readAllRequest
                .readAllRequest()
                .then(function(result) {
                    console.log("  result.query---->", result.query);
                    return res.json({
                        "status": 200,
                        "readAllRequest": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        
           
        }
    )

    router.post("/readTransaction", (req, res) => {

        if (checkToken(req)) {

            const requestid = req.body.policyNumber;
            console.log("requestid1", requestid);

            readRequest
                .readRequest(requestid)
                .then(function(result) {

                    return res.json({
                        "status": 200,
                        "message": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res
                .status(401)
                .json({
                    "status": false,
                    message: 'cant fetch data !'
                });
        }
    });



    router.post('/notifyClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const NotificationClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 working days to receive your copy of the Insurance Policy Document';

        const policyNumber = NotificationClaim.policyNumber;
        const claim_no1 = Math.floor(Math.random() * (1000 - 1)) + 1;
        const claim_no = claim_no1.toString();
        const claimNotifiedDate = new Date();
        const status = "Claim Notified";

        NotificationClaim.claimNotifiedDate = claimNotifiedDate;
        NotificationClaim.status = status;
        NotificationClaim.InsuredId = userid;
        console.log("NotificationClaim" + JSON.stringify(NotificationClaim));
        const transactionString = JSON.stringify((({
            claim_no,
            Title,
            status,
            claimNotifiedDate
        }) => ({
            claim_no,
            Title,
            status,
            claimNotifiedDate
        }))(NotificationClaim));
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    notifyClaim
                        .notifyClaim(claim_no, policyNumber, userid, NotificationClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }

    });

    router.get('/claim/Claimlist', (req, res) => {

        if (checkToken(req)) {

            fetchClaimlist
                .fetch_Claim_list({
                    "user": "risabh",
                    "getclaims": "getclaims"
                })
                .then(function(result) {
                    var daysDifference = [];
                    var claimDifference = [];
                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {

                        if (result.claimlist.claimlist[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                            var date1 = new Date(result.claimlist.claimlist[i].claimnotifieddate);
                            console.log("date1" + date1);
                            var date2 = new Date(result.claimlist.claimlist[i].claimsettleddate);
                            console.log("date1" + date2);
                            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            console.log("diffDays" + diffDays);
                            daysDifference.push(diffDays)
                            console.log("daysDifference" + daysDifference);
                            var total = 0;
                            for (let i = 0; i < daysDifference.length; i++) {
                                total += daysDifference[i];
                            }
                            var averagedays = total / daysDifference.length;
                            var longest = Math
                                .max
                                .apply(null, daysDifference)
                            var shortest = Math
                                .min
                                .apply(null, daysDifference)

                        }

                    }
                    res.json({
                        message: "user claims found",
                        allClaims: result,
                        Average: averagedays,
                        Longest: longest,
                        Shortest: shortest
                    });
                    //res.json(result)
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });
        }
    });
    router.post('/createClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const SubmissionClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 worki' +
            'ng days to receive your copy of the Insurance Policy Document';

        const policyNumber = SubmissionClaim.policyNumber;
        const claim_no = SubmissionClaim.claim_no;
        const claimSubmittedDate = new Date();
        const status = "Claim Submitted";

        SubmissionClaim.claimSubmittedDate = claimSubmittedDate;
        SubmissionClaim.status = status;
        SubmissionClaim.InsuredId = userid;
        console.log("SubmissionClaim" + JSON.stringify(SubmissionClaim));
        const transactionString = JSON.stringify(SubmissionClaim);
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    createClaim
                        .createClaim(claim_no, SubmissionClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }

    });

    router.post('/rejectClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const RejectionClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 worki' +
            'ng days to receive your copy of the Insurance Policy Document';

        const policyNumber = RejectionClaim.policyNumber;
        const claim_no = RejectionClaim.claim_no;
        const claimRejectedDate = new Date();
        const status = "Claim Rejected";

        RejectionClaim.claimRejectedDate = claimRejectedDate;
        RejectionClaim.status = status;
        RejectionClaim.ExaminerId = userid;
        console.log("RejectionClaim" + JSON.stringify(RejectionClaim));
        const transactionString = JSON.stringify(RejectionClaim);
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    rejectClaim
                        .rejectClaim(claim_no, RejectionClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }



    });

    router.post('/examineClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const ExamineClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 worki' +
            'ng days to receive your copy of the Insurance Policy Document';

        const policyNumber = ExamineClaim.policyNumber;
        const claim_no = ExamineClaim.claim_no;
        const claimExaminedDate = new Date();
        const status = "Claim Examined";

        ExamineClaim.claimExaminedDate = claimExaminedDate;
        ExamineClaim.status = status;
        ExamineClaim.ExaminerId = userid;
        console.log("ExamineClaim" + JSON.stringify(ExamineClaim));
        const transactionString = JSON.stringify(ExamineClaim);
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    examineClaim
                        .examineClaim(claim_no, ExamineClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }

    });

    router.post('/negotiateClaim', cors(), (req, res) => {

        const userid = getUserId(req)
        const Negotiations = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 worki' +
            'ng days to receive your copy of the Insurance Policy Document';

        const policyNumber = Negotiations.policyNumber;
        const claim_no = Negotiations.claim_no;
        const claimNegotiatedDate = new Date();
        const status = "Claim Examined";

        Negotiations.claimNegotiatedDate = claimNegotiatedDate;
        Negotiations.status = status;
        Negotiations.userid = userid;
        console.log("NegotiateClaim" + JSON.stringify(Negotiations));
        const transactionString = JSON.stringify(Negotiations);
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    negotiateClaim
                        .negotiateClaim(claim_no, Negotiations)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }


    });

    router.post('/approveClaim', cors(), (req, res) => {
        const userid = getUserId(req)
        const ApproveClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 worki' +
            'ng days to receive your copy of the Insurance Policy Document';

        const policyNumber = ApproveClaim.policyNumber;
        const claim_no = ApproveClaim.claim_no;
        const claimApprovedDate = new Date();
        const status = "Approved";

        ApproveClaim.claimApprovedDate = claimApprovedDate;
        ApproveClaim.status = status;
        ApproveClaim.ClaimAdjusterId = userid;
        console.log("ApproveClaim" + JSON.stringify(ApproveClaim));
        var transactionString;

        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    negotiateClaimFind
                        .negotiateClaimFind(claim_no)
                        .then(result => {
                            var negotiationAmount = result.negotiationAmount
                            ApproveClaim.ApprovedAmount = negotiationAmount;
                            transactionString = JSON.stringify(ApproveClaim);
                            resolve(negotiationAmount);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    approveClaim
                        .approveClaim(claim_no, ApproveClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var thirdMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod()
                .then(secondMethod)
                .then(thirdMethod);
        }


    });



    router.post('/settleClaim', cors(), (req, res) => {

        const userid = getUserId(req)
        const SettleClaim = req.body.transaction;
        const phonetosend = req.body.phone;
        console.log(phonetosend);
        const emailtosend = req.body.email;
        console.log(emailtosend);
        var messagetosend = 'Thank you for choosing HDFC Ergo to insure your Motor. Please wait for 4-5 working days to receive your copy of the Insurance Policy Document';

        const policyNumber = SettleClaim.policyNumber;
        const claim_no = SettleClaim.claim_no;
        const claimSettledDate = new Date();
        const status = "Settled";

        SettleClaim.claimSettledDate = claimSettledDate;
        SettleClaim.status = status;
        SettleClaim.ClaimAdjusterId = userid;
        console.log("SettleClaim" + JSON.stringify(SettleClaim));
        const transactionString = JSON.stringify(SettleClaim);
        console.log("transactionString" + transactionString);
        if (!userid || !userid.trim()) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });
        } else {

            var firstMethod = function() {
                var promise = new Promise(function(resolve, reject) {
                    settleClaim
                        .settleClaim(claim_no, SettleClaim)
                        .then(result => {
                            var message = result.message
                            console.log("message" + message);
                            resolve(message);

                        })
                        .catch(err => res.status(err.status).json({
                            message: err.message
                        }));
                });
                return promise;
            };

            var secondMethod = function() {

                updatetransaction
                    .updatetransaction(policyNumber, transactionString, userid)
                    .then((result) => {
                        if (result !== null && result !== '') {
                            var mailOptions = {
                                transport: transporter,
                                from: '"Marin Service"<vikram.viswanathan@rapidqube.com>',
                                to: emailtosend,
                                subject: 'Policy Issue Notification',

                                html: "Hello,<br> Thank you for choosing HDFC Ergo to insure your Motor. Please wait fo" +
                                    "r 4-5 working days to receive your copy of the Insurance Policy Document<br>"
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {}
                            });
                            // nexmo     .message     .sendSms('919768135452', phonetosend, messagetosend, {
                            //         type: 'unicode'     }, (err, responseData) => {         if
                            // (responseData) {             console.log(responseData)         }     });

                            res
                                .status(200)
                                .json({
                                    "message": result.message,
                                    "status": "success"
                                });
                        }

                    })
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            };
            firstMethod().then(secondMethod);
        }

    });

    router.get('/claim/UserClaims', function(req, res) {

        var filteredclaims = [];
        var status = [];
        var daysDifference = [];
        var averagedays,
            longest,
            shortest;
        const id = getUserId(req)
        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({
                    " user ": " risabh ",
                    " getclaims ": " getclaims "
                })
                .then(function(result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];
                    var status = [];
                    var daysDifference = [];
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].insuredid);
                        if (result.claimlist.claimlist[i].insuredid === id) {
                            console.log("userid" + result.claimlist.claimlist[i].insuredid);
                            filteredclaims.push(result.claimlist.claimlist[i]);
                            status.push(result.claimlist.claimlist[i].status);
                            var countstatus = count(status);
                            console.log("countstatus" + countstatus);
                            console.log("filteredclaims array " + filteredclaims);
                            if (result.claimlist.claimlist[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                var date1 = new Date(result.claimlist.claimlist[i].claimnotifieddate);
                                console.log("date1" + date1);
                                var date2 = new Date(result.claimlist.claimlist[i].claimsettleddate);
                                console.log("date1" + date2);
                                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                console.log("diffDays" + diffDays);
                                daysDifference.push(diffDays)
                                console.log("daysDifference" + daysDifference);
                                var total = 0;
                                for (let i = 0; i < daysDifference.length; i++) {
                                    total += daysDifference[i];
                                }
                                var averagedays = total / daysDifference.length;
                                var longest = Math
                                    .max
                                    .apply(null, daysDifference)
                                var shortest = Math
                                    .min
                                    .apply(null, daysDifference)

                            }

                        }
                    }
                    return res.json({
                        message: "user claims found",
                        userClaims: filteredclaims,
                        statuscount: countstatus,
                        Average: averagedays,
                        Longest: longest,
                        Shortest: shortest
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            return res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });
        }
    });

    router.get('/claim/ExaminerClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({
                    "user": "risabh",
                    "getclaims": "getclaims"
                })
                .then(function(result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var daysDifference = [];
                    var countstatus
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (id === id) {

                            if (result.claimlist.claimlist[i].status == "Submitted") {
                                filteredclaims.push(result.claimlist.claimlist[i]);
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);

                                console.log("countstatus" + countstatus);
                                console.log("filteredclaims array " + filteredclaims);
                                for (let i = 0; i < filteredclaims.length; i++) {
                                    if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                        var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                        console.log("date1" + date1);
                                        var date2 = new Date(filteredclaims[i].claimsettleddate);
                                        console.log("date1" + date2);
                                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                        console.log("diffDays" + diffDays);
                                        daysDifference.push(diffDays)
                                        console.log("daysDifference" + daysDifference);
                                        var total = 0;
                                        for (let i = 0; i < daysDifference.length; i++) {
                                            total += daysDifference[i];
                                        }
                                        var averagedays = total / daysDifference.length;
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }
                            if (result.claimlist.claimlist[i].status == "Notified") {
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);
                            }
                            if (result.claimlist.claimlist[i].examinerid === id) {
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);

                            }
                        }
                    }
                    return res.json({
                        message: "user claims found",
                        userClaims: filteredclaims,
                        statuscount: countstatus,
                        Average: averagedays,
                        Longest: longest,
                        Shortest: shortest

                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            return res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });
        }
    });

    router.get('/claim/ClaimAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({
                    "user": "risabh",
                    "getclaims": "getclaims"
                })
                .then(function(result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var daysDifference = [];
                    var countstatus
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (id === id) {

                            if (result.claimlist.claimlist[i].status == "Examined" || result.claimlist.claimlist[i].status == "Validated" || result.claimlist.claimlist[i].status == "Approved" || result.claimlist.claimlist[i].status == "Settled") {
                                filteredclaims.push(result.claimlist.claimlist[i]);

                                if (result.claimlist.claimlist[i].status == "Examined") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Validated") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Approved") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Settled") {
                                    status.push(result.claimlist.claimlist[i].status);
                                }

                                countstatus = count(status);

                                console.log("countstatus" + countstatus);
                                console.log("filteredclaims array " + filteredclaims);
                                for (let i = 0; i < filteredclaims.length; i++) {
                                    if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                        var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                        console.log("date1" + date1);
                                        var date2 = new Date(filteredclaims[i].claimsettleddate);
                                        console.log("date1" + date2);
                                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                        console.log("diffDays" + diffDays);
                                        daysDifference.push(diffDays)
                                        console.log("daysDifference" + daysDifference);
                                        var total = 0;
                                        for (let i = 0; i < daysDifference.length; i++) {
                                            total += daysDifference[i];
                                        }
                                        var averagedays = total / daysDifference.length;
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }

                            if (result.claimlist.claimlist[i].status == "Notified" || result.claimlist.claimlist[i].status == "Submitted") {
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);
                            }

                        }
                    }
                    return res.json({
                        message: "user claims found",
                        userClaims: filteredclaims,
                        statuscount: countstatus,
                        Average: averagedays,
                        Longest: longest,
                        Shortest: shortest

                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            return res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });
        }
    });

    router.get('/claim/PublicAdjusterClaims', (req, res) => {

        const id = getUserId(req)

        console.log("id" + id);
        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({
                    "user": "risabh",
                    "getclaims": "getclaims"
                })
                .then(function(result) {
                    console.log("result array data" + result.claimlist.claimlist);

                    var filteredclaims = [];

                    var status = [];
                    var status1 = [];
                    var daysDifference = [];
                    var countstatus
                    var countstatus1
                    console.log("length of result array" + result.claimlist.claimlist.length);

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("id" + id);
                        console.log("userid" + result.claimlist.claimlist[i].userid);
                        if (result.claimlist.claimlist[i].publicadjusterid === id) {

                            if (result.claimlist.claimlist[i].status == "Validated" || result.claimlist.claimlist[i].status == "Approved" || result.claimlist.claimlist[i].status == "Settled") {
                                filteredclaims.push(result.claimlist.claimlist[i]);
                                if (result.claimlist.claimlist[i].status == "Validated") {
                                    status1.push(result.claimlist.claimlist[i].status);
                                    countstatus1 = count(status1);
                                } else if (result.claimlist.claimlist[i].status == "Approved") {
                                    status.push(result.claimlist.claimlist[i].status);
                                } else if (result.claimlist.claimlist[i].status == "Settled") {
                                    status.push(result.claimlist.claimlist[i].status);
                                }

                                countstatus = count(status);

                                console.log("filteredclaims array " + filteredclaims);
                                for (let i = 0; i < filteredclaims.length; i++) {
                                    if (filteredclaims[i].claimsettleddate !== "0001-01-01T00:00:00Z") {

                                        var date1 = new Date(filteredclaims[i].claimnotifieddate);
                                        console.log("date1" + date1);
                                        var date2 = new Date(filteredclaims[i].claimsettleddate);
                                        console.log("date1" + date2);
                                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                        console.log("diffDays" + diffDays);
                                        daysDifference.push(diffDays)
                                        console.log("daysDifference" + daysDifference);
                                        var total = 0;
                                        for (let i = 0; i < daysDifference.length; i++) {
                                            total += daysDifference[i];
                                        }
                                        var averagedays = total / daysDifference.length;
                                        var longest = Math
                                            .max
                                            .apply(null, daysDifference)
                                        var shortest = Math
                                            .min
                                            .apply(null, daysDifference)

                                    }
                                }

                            }

                            if (result.claimlist.claimlist[i].status == "Notified" || result.claimlist.claimlist[i].status == "Submitted" || result.claimlist.claimlist[i].status == "Examined") {
                                status.push(result.claimlist.claimlist[i].status);
                                countstatus = count(status);
                            }
                        }
                    }

                    return res.json({
                        message: "user claims found",
                        userClaims: filteredclaims,
                        statuscount: countstatus,
                        statuscount1: countstatus1,
                        Average: averagedays,
                        Longest: longest,
                        Shortest: shortest

                    });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            return res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });
        }
    });

    cloudinary.config({
        cloud_name: 'diyzkcsmp',
        api_key: '188595956976777',
        api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'
    });

    router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
        const id = getUserId(req)
        const claimno = parseInt(req.body.claimno, 10);
        // const claimno =215;
        console.log(claimno)
        var photo = new Photo(req.body);
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.file.path;

        cloudinary
            .uploader
            .upload(imageFile, {
                tags: 'express_sample'
            })
            .then(function(image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                photo.url = image.url;
                photo.userid = id;
                photo.claimno = claimno;
                // Save photo with image metadata
                return photo.save();
            })
            .then(function(photo) {

                res.send({
                    url: photo._doc.url,
                    claimno: photo._doc.claimno,
                    message: "files uploaded succesfully"
                });
            })
            .finally(function() {

                res.render('photos/create_through_server', {
                    photo: photo,
                    upload: photo.image
                });
            });
    });

    router.get('/images/id', cors(), (req, res) => {
        const id = getUser(req)
        console.log("id" + id);
        Photo
            .find({
                "userid": id
            })
            .then((images) => {
                var image = [];
                for (let i = 0; i < images.length; i++) {
                    image.push(images[i]._doc)

                }

                res.send({
                    images: image,
                    message: "image fetched succesfully"
                });
            })

    });

    function getUserId(req) {
        const token = req.headers['x-access-token'];
        if (token) {
            try {
                var decoded = jwt.verify(token, config.secret);
                return decoded.usr[0]._id
            } catch (err) {
                return false;
            }
        } else {
            return failed;
        }
    }

    function getUser(req) {
        const token = req.query.token;
        if (token) {
            try {
                var decoded = jwt.verify(token, config.secret);
                return decoded.users[0].rapidID
            } catch (err) {
                return false;
            }
        } else {
            return failed;
        }
    }

    function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);
                return true

            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }

    function filterstatus(status) {

        if (1 == 1) {

            fetchClaimlist
                .fetch_Claim_list({
                    "user": "risabh",
                    "getclaims": "getclaims"
                })
                .then(function(result) {

                    console.log("result" + result.claimlist.claimlist)
                    var statusfilter = [];

                    for (let i = 0; i < result.claimlist.claimlist.length; i++) {
                        console.log("status" + status);
                        console.log("statusledger" + result.claimlist.claimlist[i].status);
                        if (result.claimlist.claimlist[i].status === status) {

                            statusfilter.push(result.claimlist.claimlist[i].status);
                            console.log("statusfilter" + statusfilter);

                        }
                    }
                    return statusfilter;
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {
            return res
                .status(401)
                .json({
                    message: 'cant fetch data !'
                });

        }
    }

    function count(arr) {
        var statusname = [],
            statuscount = [],
            prev;

        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== prev) {
                statusname.push(arr[i]);
                statuscount.push(1);
            } else {
                statuscount[statuscount.length - 1]++;
            }
            prev = arr[i];
        }
        console.log("statusname" + statusname);
        var result = [];
        for (var status in statusname) {

            result.push({
                statusname: statusname[status],
                statuscount: statuscount[status]
            });
        }

        return result;
    }
}

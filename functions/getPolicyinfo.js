'use strict';


var js2xmlparser = require("js2xmlparser");
//var xml2jsparser = require("xml2jsparser")
var parser = require('xml2json');
var request = require("request");
var utf8 = require('utf8');
var bcSdk = require('../fabcar/query.js');




exports.getPolicyinfo = () => {
    
  return new Promise((resolve, reject) => {
      
        
      bcSdk.readAllRequest()({})

      .then((response) => {
            console.log("data in response " + response)

          return resolve({
                status: 200,
                query: response
            })
        })

      .catch(err => {

          if (err.code == 401) {

              return reject({
                    status: 401,
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
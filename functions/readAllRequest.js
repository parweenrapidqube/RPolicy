'use strict';


const bcSdk = require('../fabcar/query.js');



exports. readAllRequest = (key) => {
    
   return new Promise((resolve, reject) => {
       
        
       bcSdk.readAllRequest({
           key:key
       })

       .then((response) => {
            console.log("data in response " + JSON.stringify(response.key))

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
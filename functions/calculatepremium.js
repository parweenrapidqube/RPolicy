var js2xmlparser = require("js2xmlparser");
var bcSdk = require('../fabcar/invoke.js');
//var xml2jsparser = require("xml2jsparser")
var parser = require('xml2json');
var request = require("request");
var utf8 = require('utf8');

exports.calculatepremium = (premiumrequest) =>{ 
return new Promise((resolve, reject) => {
   

  // const brandnewupdatevehical = ({
  //     updatevehical
  //    // rapid_doc_ID: rapid_doc_ID
  //   // docinfo: docinfo
  // })


var object = js2xmlparser.parse("CALCULATEPREMIUMREQUEST", premiumrequest)
console.log("object",object)


request.post({
    url:"https://dtc.royalsundaram.net/DTCWS/Services/Product/TwoWheeler/CalculatePremium",
    port: 9000,
    method:"POST",
    headers:{
        'Content-Type': 'application/xml',
    },
     body: object
},

function(error, response, body){
   
  //  console.log("status",response.StatusCode);
    console.log("body",body);
    console.log(error);
    //console.log(xml2jsparser.parse("CALCULATEPREMIUMREQUEST", body))
    var json = parser.toJson(body);
    var json1 = JSON.parse(json)
    var data =  JSON.stringify(json1)
    var key  =  JSON.stringify(json1.PREMIUMDETAILS.DATA.QUOTE_ID)
    console.log("to json -> %s", JSON.stringify(json1));
    const transactiondetails = ({
        data: data,
        key:key
    });
    bcSdk.savetransaction({
        Transactiondetails:transactiondetails   
         })
return  resolve({
    status: 201,
    message:"Success",
    Response:json
    
})
}




);
})

}
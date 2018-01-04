let multichain = require("multichain-node")({
    port: 6284,
    host: '127.0.0.1',
    user: "multichainrpc",
    pass: "E5ZZ9KAsnPtrmWU2uXLSeYZCdr84R7iEdGgPFD4hoq3e"
});


function savetransaction(params) {
   
    return new Promise((resolve) => {
        var response;

    var TransactionDetails = params.TransactionDetails.transactionString;
    var policyNumber=params.TransactionDetails.policyNumber;
    console.log("TransactionDetails",TransactionDetails)
    var hex = '';
    for(var i=0;i<TransactionDetails.length;i++) {
        hex += ''+TransactionDetails.charCodeAt(i).toString(16);
    }
    console.log("hex",hex);
    
    multichain.publish({stream: "policyInfo",key: policyNumber,data: hex }, (err, res) => {
        console.log(res)
        if(err == null){
         return resolve({response:res});
        }else{
            console.log(err)
        }
    })

})
   
}
module.exports = {
    savetransaction: savetransaction
    

};
let multichain = require("multichain-node")({
    port: 6284,
    host: '127.0.0.1',
    user: "multichainrpc",
    pass: "E5ZZ9KAsnPtrmWU2uXLSeYZCdr84R7iEdGgPFD4hoq3e"
});


function readAllRequest() {
    
    return new Promise((resolve) => {
        var policyDetails = [];
        var response;    
    multichain.listStreamItems({stream: "policyInfo"}, (err, res) => {
        console.log(res)
        if(err == null){

            for (let i = 0; i < res.length; i++) {
                var string = '';
                var data=res[i].data;
                for (var j = 0; j < data.length; j += 2) {
                   string += String.fromCharCode(parseInt(data.substr(j, 2), 16))
                    }
                  
                
                policyDetails.push({
                                            "publishers": res[i].publishers[0],
                                            "key": res[i].key,
                                            "data": string,
                                            "confirmations": res[i].confirmations,
                                            "blocktime": res[i].blocktime,
                                            "txid": res[i].txid,
                                            
                                        });
                }   

        console.log("policyDetails",policyDetails);

         return resolve({response:policyDetails});
        }else{
            console.log(err)
        }
    })

})
   
}

function readRequest(params) {
    
    return new Promise((resolve) => {
        var requestid = params.requestid;
        var policyDetails = [];
        var response;    
    multichain.listStreamKeyItems({stream: "policyInfo","key": requestid}, (err, res) => {
        console.log(res)
        if(err == null){

            
                var string = '';
                var data=res[0].data;
                for (var j = 0; j < data.length; j += 2) {
                   string += String.fromCharCode(parseInt(data.substr(j, 2), 16))
                    }
                  
                
                policyDetails.push({
                                            "publishers": res[0].publishers[0],
                                            "key": res[0].key,
                                            "data": string,
                                            "confirmations": res[0].confirmations,
                                            "blocktime": res[0].blocktime,
                                            "txid": res[0].txid,
                                            
                                        });
                   

        console.log("policyDetails",policyDetails);

         return resolve({response:policyDetails});
        }else{
            console.log(err)
        }
    })

})
   
}



module.exports = {
    readAllRequest: readAllRequest,
    readRequest:readRequest
    

};
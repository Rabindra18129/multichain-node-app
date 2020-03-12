var axios=require('axios');
var httpClient=axios.create({
    baseURL:process.env.BASEURL,
    headers:{'Content-Type':'application/json','apikey':process.env.APIKEY}
});

function publishData(queueData){
    return new Promise((resolve,reject)=>{
        let multichainData={};
        let key='';
        let stream='root';
        let method='publish'
        if(typeof queueData.data=='string'){
            multichainData={"text":queueData.data};
        }
        else if(typeof queueData.data=='object'){
            multichainData={"json":queueData.data};
        }
        key=queueData.key ?  queueData.key : 'node-key';
        console.log(`Data for chain is ${JSON.stringify(multichainData)} & stream is ${stream} and key is ${key}`);
        console.log('Sending data to multichain');
        httpClient.post(process.env.URL,{method:method,params:[stream,key,multichainData]})
            .then((response)=>{
               if(response.data){
                   if(!response.data.error){
                    resolve({status:response.status,data:response.data,message:'Pushed data to multichain',ack:true});
                   }
                   else{
                    resolve({status:response.status,data:response.data,message:'Not able to publish data to multichain',ack:false});
                   }
               }
               else{
                   reject(response);
               }
            })
            .catch((ex)=>{
                console.log(ex);
                reject(ex);
                
        });
    });
    
}

module.exports=publishData;


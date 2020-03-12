require('dotenv').config();
var amqpurl=process.env.MQURL;
var amqp = require('amqplib/callback_api');
var ch=null;
var publishChainData=require('./multiChainClient');
(()=>{
    amqp.connect(amqpurl,(err,connection)=>{
        if(err){
            console.error(err);
            process.exit(0);
        }
        connection.createChannel((err,channel)=>{
            ch=channel;
            if(err){             
                console.log('Error happened at channel creation while sending');
                console.error(err);
            }
            else{
                const bindKey='chain';
                let exchange='multichain';
                let queue='multichain-queue';
                channel.assertExchange(exchange,'direct',{durable:false});
                channel.assertQueue(queue,{durable:false},(err,resp)=>{
                    if(err){
                        console.log('Error at assertion queue');
                    }
                    else{
                        channel.bindQueue(queue,exchange,bindKey);
                        console.log('Ready to consume data from queue');
                        channel.consume(queue,(msg)=>{
                            if(msg.content!==undefined){
                                let queueData=JSON.parse(msg.content.toString());
                                console.log(`Data retrived from queue is ${JSON.stringify(queueData)}`);         
                                publishChainData(queueData)
                                    .then((response)=>{
                                        console.log(`Response from Multichain is ${JSON.stringify(response)}`);
                                        if(response.ack)
                                            channel.ack(msg);
                                    })
                                    .catch((ex)=>{
                                        console.log('Not able to publish data to chain');
                                        console.log(ex);
                                    });
                                }
                            else{
                                console.log('Not a valid message');                                    
                                channel.ack(msg);
                            }                                                   
                        });                    
                    }                
                });            
            }        
        });    
    });
})();
process.on('exit',(code)=>{
    if(ch)
        ch.close();
    console.log('Process exited with code ',code);

    }); 
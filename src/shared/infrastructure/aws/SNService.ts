import SNSClient from "aws-sdk/clients/sns";
import { config } from '../../../../config';
export class SNService {    
    private snsClient: SNSClient;
    private secretKey = config.AWS_ACCESS_SECRET_TEST;
    private accessKey = config.AWS_ACCESS_KEY_TEST;
    private region = config.AWS_REGION_TEST;
    constructor(){
        this.snsClient = new SNSClient({region: this.region, accessKeyId: this.accessKey, secretAccessKey: this.secretKey});
    }

    async publishMessage( phone: string, message: string): Promise<any> {        
        try{
            const params = {
                Message: message, 
                PhoneNumber:"+527228656884",  
                MessageAttributes: {
                    "AWS.SNS.SMS.SenderID": {
                        DataType: "String",
                        StringValue: "TEST"
                    }
                }                           
            };
            
            const response = await this.snsClient.publish(params).promise();
            console.log(response);
            console.log(phone);
            return { success: true, message: `Mesnaje enviado a ${phone}` };
        }catch(error){
            // console.log(phone, typeof phone);
            // console.log("+527228656884", typeof "+527228656884");                        
            // console.log(phone === "+527228656884");            
            console.log(error);            
            throw new Error("Hubo un error al enviar el mensaje");            
        }
    }
}
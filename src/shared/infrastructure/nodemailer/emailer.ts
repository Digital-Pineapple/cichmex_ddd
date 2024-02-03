import nodemaler from 'nodemailer'
import fs from 'fs'
const dirname = `D:/CarWashAPI/carwash_ddd/src/shared/infrastructure/nodemailer`
const htmlContent = fs.readFileSync(dirname + '/WelcomeEmail.html', 'utf-8');

 export const createTrans = () =>{
    const transport = nodemaler.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6311696d9aef28",
          pass: "660f29bb79d844"
        }
    })
    return transport
}

 export const sendMail = async(email:string, fullname:string) =>{
    
    const transporter = createTrans()
    const info = await transporter.sendMail({
        from:'"CarWash autolavado y más","<CarWash@gmail.com.mx"', //Correo que envia el mensaje,
        to:email,   //Correo que recibe
        subject:`Bienvenido ${fullname} a CarWash Autolavado y más`,
        html: htmlContent,

    })
    console.log('MenSAJE ENVIADO ', info.messageId);
    
    return 
}
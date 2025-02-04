import cron from 'node-cron';
import { Configuration } from './config';
import { backUpDBToS3 } from './src/helpers/backUpDB';
import { Container } from './src/shared/infrastructure/Container';
import { Server } from './src/shared/infrastructure/server/Server';
// import { whatsappService } from './src/shared/infrastructure/whatsapp/WhatsappService..external';
const time = '0 0 * * *' // cada dia
cron.schedule(time, async () => {
    if(config.NODE_ENV.toLocaleLowerCase() === "production"){
        await backUpDBToS3();
    }
    return;
});

const container = new Container();
const server = container.invoke().resolve<Server>('server');
const config = container.invoke().resolve<Configuration>('config');


server
    .startServer()
    .then(async () => {
        await container.invoke().resolve('db')
        console.log(`Env: ${config.NODE_ENV}`);          
        // console.log(`S3: ${process.env.S3_ENVIRONMENT}`);              
    }).catch((err)=>{
        console.error('Error starting server:', err);
    });
 
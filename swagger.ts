import { Configuration } from './config';
import { Container } from './src/shared/infrastructure/Container';

import { Server } from './src/shared/infrastructure/server/Server';

const container = new Container();
const server = container.invoke().resolve<Server>('server');
const config = container.invoke().resolve<Configuration>('config');
import router from './src/shared/infrastructure/routes/Router';
import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json'
// const endpointsFiles = ['./src/api/infrastructure/router/index.ts'];
const endpointsFiles = ['./src/shared/infrastructure/routes/Router.ts'];
swaggerAutogen()(outputFile, endpointsFiles).then(()=>{
    server
})
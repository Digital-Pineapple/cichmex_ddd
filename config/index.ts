import { config } from 'dotenv';

const { NODE_ENV } = process.env;
// Cargar el archivo de entorno adecuado según NODE_ENV
if (NODE_ENV === 'production') {
    config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' });
} else {
    config(); // Carga `.env` por defecto (para desarrollo)
}

// config();

import TEST from './environments/test';
import DEVELOPMENT from './environments/development';
import PRODUCTION from './environments/production';
let currentConfig = TEST;

export type Configuration = {
    NODE_ENV            :   string;
    PORT                :   number;
    APP_NAME            :   string;
    TIME_ZONE           :   string;
    APP_DATABASE_URL    :   string;
    APP_LOG_LEVEL       :   string;
    SECRET_JWT_KEY      :   string;
    GOOGLE_CLIENT_ID    :   string;
    GOOGLE_SECRET_ID    :   string;
    GOOGLE_MAP_KEY      :   string;
    AWS_REGION          :   string;
    AWS_ACCESS_KEY      :   string;
    AWS_SECRET_KEY      :   string;
    AWS_BUCKET_NAME     :   string;    
    S3_ENVIRONMENT      :   string;
    TWILIO_ACCOUNT_SID  :   string;
    TWILIO_AUTH_TOKEN   :   string;
    TWILIO_PHONE_NUMBER :   string;
    MY_NUMBER           :   string;
    DIR_NODEMAILER      :   string;
    MERCADOPAGO_TOKEN   :   string;
    AWS_ACCESS_KEY_TEST ?:   string;
    AWS_ACCESS_SECRET_TEST ?:   string;
    AWS_REGION_TEST     ?:   string;   
    FACTURAPI_KEY : string; 
};


switch (NODE_ENV) {
    case 'production':
        currentConfig = PRODUCTION;
        break;

    case 'test':
        currentConfig = TEST;
        break;

    default:
        currentConfig = DEVELOPMENT;
}


export { currentConfig as config };

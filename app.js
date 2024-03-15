
import express from 'express';
import busboy from 'connect-busboy';

import router from './router.js';
import bodyParser from 'body-parser';

export default () => {
    const app = express();

    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
      })); // Insert the busboy middle-ware
      

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //app.use(helmet());
      
    app.use('/v1', router.initialise());
    


    return app;
}
import express from 'express';
import config from "./config/config"
import router from './routes';


const app = express();
app.use(express.json());


app.use('/', router);
app.listen(config.PORT, () => {
    console.log('server has started');
})
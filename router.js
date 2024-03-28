import expres from 'express'
import storage from './controllers/storage.js'
import Retrieve from './controllers/retrieve.js'


const router = expres.Router();

const initialise = () => {

    router.post('/store', storage);
    router.get('/:filename', Retrieve);

    return router;
}

export default { initialise }
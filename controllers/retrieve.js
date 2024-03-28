import crypto from "../services/CryptoService.js";
import s3 from '../services/S3Service.js';

const downloadStream = async (req, res) => {
    
    const skipDecryption = 
        `${req.query['skip-decryption']}`.toLowerCase() === 'true';

    const { filename } = req.params;
    const content = await s3.downloadStream(`${filename}`);
   
    if(!skipDecryption) {
        const keyring = await crypto.config();
        const decryption = crypto.decryptionStream(keyring);
        content.pipe(decryption).pipe(res);
    }
    else {
        content.pipe(res);
    }    
}

export default downloadStream;
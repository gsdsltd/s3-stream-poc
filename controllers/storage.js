import crypto from '../services/CryptoService.js';
import s3 from '../services/S3Service.js';


const uploadStream = async (req, res) => {
    try {

        const keyring = await crypto.config();

        req.busboy.on('file', async (fieldname, file, fileObject, encoding, mime) => {
            const { filename } = fileObject;
            
            const encryption = crypto.encryptionStream(keyring);
            const upload = await s3.uploadFromStream(`${filename}`);

            encryption.on('error', (err) => {
                //console.error('Encryption error:', err);
                res.status(500).send({
                    status: 'Encryption Error',
                    message: err.message
                });
            });

            upload.on('error', (err) => {
                //console.error('S3 Upload Error:', err);
                res.status(500).send({
                    status: 'S3 error',

                    message: err.message
                });
            });

            file.pipe(encryption)
                .pipe(upload);    
        });

        req.busboy.on('finish', function() {
            console.log('Done parsing form!');
            res.send({
                status: 'success'
            }); 
        });
        req.pipe(req.busboy);
    }
    catch(err) {
        res.status(500).send({
            status: 'Error',
            message: err.message
        });
    }
}

export default uploadStream;


import * as S3Service from '../services/S3Service.js';

const downloadStream = async (req, res) => {
    
    /*
    var file = path.join(__dirname, 'uploads', req.query.file);
  
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);
  
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(decryptStream(keyring)).pipe(res);
    */
     S3Service.downloadStream().pipe(res);
   
}

export default downloadStream;
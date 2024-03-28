import { PassThrough } from 'stream';
import { Upload } from "@aws-sdk/lib-storage";
import * as AWSConfigV3 from './AWSConfigV3.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const bucket = "mc-stream-test-awc-dybs3m3";

const downloadStream = async (key) => {
  const s3Parms = {Bucket: bucket, Key: key};
  const s3 = AWSConfigV3.awsS3Client();
  const command = new GetObjectCommand(s3Parms);

  return (await s3.send(command)).Body;    
};


const uploadFromStream = async (key) => {
  var pass = new PassThrough();

  const s3Parms = {Bucket: bucket, Key: key, Body: pass};
  const additionalOptions = {partSize: 5 * 1024 * 1024, queueSize: 10};
  
  console.log('s3Parms', s3Parms);
  const s3 = AWSConfigV3.awsS3Client();

  const upload = new Upload({
      client: s3,
      params: s3Parms,
      ...additionalOptions,
  });

  upload.done().then((res, error) => {
    if(error) {
      console.log('error', error);
    }
  });
  return pass;
  
 }

 export default { downloadStream, uploadFromStream };
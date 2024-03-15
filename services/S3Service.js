import { Readable } from "stream";
import { PassThrough } from 'stream';
import { Upload } from "@aws-sdk/lib-storage";
import * as AWSConfigV3 from './AWSConfigV3.js';

const bucket = "mc-stream-test-awc-dybs3m3";

const downloadStream = () => {
    let eventCount = 0;
    const mockEventStream = new Readable({
        objectMode: true,
      read: function (size) {
        if (eventCount < 10) {
          eventCount = eventCount + 1;
          return this.push(`event${eventCount}`)
        } else {
          return this.push(null);
        }
      }
    });
    return mockEventStream;
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
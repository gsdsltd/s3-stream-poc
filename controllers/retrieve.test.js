import httpMocks from 'node-mocks-http';
import Retrieve from './retrieve';
import * as S3Service from '../services/S3Service.js';
import { EventEmitter, Readable, WritableStream } from 'stream';


jest.mock('../services/S3Service.js');


describe.skip('Retrieve',  () => {
  
  it('calls S3Service',  (done) => {       
    let req = undefined;
 
    let res = httpMocks.createResponse( 
      {
         writableStream: WritableStream,
         eventEmitter: EventEmitter
     });
  
    let eventCount = 0;
    const mockEventStream = new Readable({
      objectMode: true,
      read: function (size) {
        if (eventCount < 2) {
          eventCount = eventCount + 1;
          return this.push(`AAA`)
        } else {
          return this.push(null);
        }
      }
    });
  
    S3Service.downloadStream.mockImplementation(() => { return mockEventStream; });
  
    res.on('end', () => {
      expect(res._getData()).toBe('AAAAAA'); 
      done();
    });

    Retrieve(req, res); 
  });
});
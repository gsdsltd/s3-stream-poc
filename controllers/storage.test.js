import supertest from 'supertest';
import path from 'path';
import fs from 'fs';
import { BufferWritableMock, DuplexMock, ObjectWritableMock } from 'stream-mock';

// to mock..
import * as crypto from '@aws-crypto/client-node';
import CryptoService from '../services/CryptoService.js';
import S3Service from '../services/S3Service.js';

jest.mock('@aws-crypto/client-node');
jest.mock('../services/S3Service.js');
jest.mock('../services/CryptoService.js');

import app from '../app.js';
import { PassThrough } from 'stream';

const appInstance = app();

const filePath =  path.resolve(__dirname, '../uploads/test_data.txt');

describe('Storage', () => {
    
    it('happy path', async () => {

        const encryptionStream = new PassThrough();
        const writeStream = new BufferWritableMock();

        CryptoService.encryptionStream.mockImplementation(()=> encryptionStream);
        S3Service.uploadFromStream.mockImplementation(() => writeStream);

        const result = await supertest(appInstance)
            .post('/v1/store')
            .attach('file', filePath);

        expect(result.statusCode).toBe(200);
    });

    
    
    it('stream exception from encryption stream',  (done) => {

        const encryptionStream = new DuplexMock();
        encryptionStream._read = () => { 
            throw new Error('Test Exception') 
        };
        const writeStream = new BufferWritableMock();

        CryptoService.encryptionStream.mockImplementation(()=> encryptionStream);
        S3Service.uploadFromStream.mockImplementation(() => writeStream);

        const result = supertest(appInstance)
            .post('/v1/store')
            .attach('file', filePath);
            // .end((err, res) => {
            //     expect(res.statusCode).toBe(500);
            //     done();
            // });
    });

    it.only('error in encryption stream', async () => {
        const encryptionStream = new PassThrough();
        const writeStream = new ObjectWritableMock();
        writeStream._write = (chunk, enc, next) => 
            next(new Error('Test Exception'));
        

        CryptoService.encryptionStream.mockImplementation(()=> encryptionStream);
        S3Service.uploadFromStream.mockImplementation(() => writeStream);
     
        const file = fs.createReadStream(filePath);
        
        const result = await supertest(appInstance)
            .post("/v1/store?skip-encryption=false")
            .attach('file', file)
        
        expect(result.statusCode).toBe(500);
        expect(result.body.status).toBe('Encryption Error');
        
    }, 10*1000
    );
});
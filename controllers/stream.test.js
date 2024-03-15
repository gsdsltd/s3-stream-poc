import { Writable } from "stream";

describe.skip('stream write unhandled', () => {

    it('should write unhandled', async () => {
       const write = new Writable();
       write._write = (chunk, encoding, next) => {
            next(new Error('unhandled'));
       };

       write.on('error', (err) => {
           expect(err.message).toBe('unhandled');
       });

       await write.write('test');
        
    });


    
});
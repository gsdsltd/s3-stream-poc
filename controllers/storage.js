import busboy from "busboy";

import crypto from "../services/CryptoService.js";
import s3 from "../services/S3Service.js";
import PQueue from "p-queue-compat";

const uploadStream = async (req, res) => {
  const bb = busboy({ headers: req.headers });
  const workQueue = new PQueue({ concurrency: 1 });

  function abort() {
    req.unpipe(bb);
    workQueue.pause();
    if (!req.aborted) {
      //res.set("Connection", "close");
      //res.sendStatus(413);
      res.status(500).send({ status: "Error" });
    }
  }

  async function abortOnError(fn) {
    workQueue.add(async () => {
      try {
        await fn();
      } catch (e) {
        abort();
      }
    });
  }
  try {
    const keyring = await crypto.config();

    bb.on("file", async (fieldame, file, fileObject) => {
      abortOnError(async () => {
        const { filename } = fileObject;

        const encryption = crypto.encryptionStream(keyring);
        const upload = await s3.uploadFromStream(`${filename}`);

        encryption.on("error", abort);

        upload.on("error", abort);

        file.pipe(encryption).pipe(upload);
      });
    });

    bb.on("close", function () {
      res.send({
        status: "success",
      });
    });

    req.pipe(bb);
  } catch (err) {
    res.status(500).send({
      status: "Error",
      message: err.message,
    });
  }
};

export default uploadStream;

import supertest from "supertest";
import path from "path";
import {
  BufferWritableMock,
  DuplexMock,
  ObjectWritableMock,
} from "stream-mock";

// to mock..
import CryptoService from "../services/CryptoService.js";
import S3Service from "../services/S3Service.js";

import app from "../app.js";
import { PassThrough } from "stream";

jest.mock("@aws-crypto/client-node");
jest.mock("../services/S3Service.js");
jest.mock("../services/CryptoService.js");

const appInstance = app();

const filePath = path.resolve(__dirname, "../uploads/test_data.txt");

describe("Storage", () => {
  it("happy path", async () => {
    const encryptionStream = new PassThrough();
    const writeStream = new BufferWritableMock();

    CryptoService.encryptionStream.mockImplementation(() => encryptionStream);
    S3Service.uploadFromStream.mockImplementation(() => writeStream);

    const result = await supertest(appInstance)
      .post("/v1/store")
      .query({ "skip-encryption": "false" })
      .set("connection", "keep-alive")
      .attach("file", filePath);

    expect(result.statusCode).toBe(200);
  });

  it("stream exception from encryption stream", async () => {
    const encryptionStream = new DuplexMock();
    encryptionStream._read = () => {
      throw new Error("Test Exception");
    };
    const writeStream = new BufferWritableMock();

    CryptoService.encryptionStream.mockImplementation(() => encryptionStream);
    S3Service.uploadFromStream.mockImplementation(() => writeStream);

    const result = await supertest(appInstance)
      .post("/v1/store")
      .query({ "skip-encryption": "true" })
      .set("connection", "keep-alive")
      .attach("file", filePath);

    expect(result.statusCode).toBe(500);
    expect(result.body.status).toBe("Error");
  });

  it(
    "error in S3 stream",
    async () => {
      const encryptionStream = new PassThrough();
      const writeStream = new ObjectWritableMock();
      writeStream._write = (chunk, enc, next) =>
        next(new Error("Test Exception"));

      CryptoService.encryptionStream.mockImplementation(() => encryptionStream);
      S3Service.uploadFromStream.mockImplementation(() => writeStream);

      const result = await supertest(appInstance)
        .post("/v1/store")
        .query({ "skip-encryption": "true" }) // <-- add query string
        .set("connection", "keep-alive")
        .attach("file", filePath);

      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Error");
    },
    10 * 1000
  );
});

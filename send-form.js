const FormData = require("form-data");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

// const fetch = (...args) =>
// import("node-fetch").then(({ default: fetch }) => fetch(...args));

const upload = async () => {
  const readFile = util.promisify(fs.readFile);
  // var upload = await readFile("output_24.dat", "utf-8");
  var upload = await readFile("output1.dat", "utf-8");

  const form = new FormData();
  form.append("file", upload, { filename: "test-file.dat" });
  // const resp = await fetch("http://localhost:3000/", {
  /*
  const resp = await fetch("http://localhost:3000/non-stream", {
    method: "POST",
    body: form,
  });
  */
  /*
  const resp = await axios({
    method: "post",
    url: "http://localhost:3000/non-stream",
    data: form,
    headers: form.getHeaders(),
  });
  */
  console.log(new Date(), "start");
  //const resp = await axios.post("http://localhost:3000/non-stream", form);
  const resp = await axios.post("http://localhost:3000/", form);
  console.log(new Date(), "end");
  //console.log(resp.status);
};
upload();

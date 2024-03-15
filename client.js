//var request = require("request");
var fs = require("fs");

/*
var r = request.post("http://localhost:3000/");
// See http://nodejs.org/api/stream.html#stream_new_stream_readable_options
// for more information about the highWaterMark
// Basically, this will make the stream emit smaller chunks of data (ie. more precise upload state)
var upload = fs.createReadStream("output.dat", { highWaterMark: 500 });

upload.pipe(r);

var upload_progress = 0;
upload.on("data", function (chunk) {
  upload_progress += chunk.length;
  console.log(new Date(), upload_progress);
});

upload.on("end", function (res) {
  console.log("Finished");
});
*/

const upload = async () => {
  var upload = fs.createReadStream("output.dat", { highWaterMark: 500 });
  const resp = await fetch("http://localhost:3000/", {
    method: "POST",
    // headers: {
    // "Content-length": fileSizeInBytes,
    // },
    body: upload, // Here, stringContent or bufferContent would also work
    duplex: "half",
  });
};
upload();

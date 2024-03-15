const { S3 } = require("aws-sdk");

// Now you can use the S3 client with the credentials specified by AWS_PROFILE
const s3 = new S3();

s3.listBuckets((err, data) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Buckets:", data.Buckets);
  }
});

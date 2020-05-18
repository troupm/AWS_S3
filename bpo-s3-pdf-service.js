// *** Setup
// express
const express = require('express')
const app = express()
const port = 3000
const bucket = 'bpo-pdf-test-1'
const bodyParser = require('body-parser');
// aws
var AWS = require('aws-sdk')
var s3 = new AWS.S3({apiVersion: 'latest'})
// base64
var http = require('http')
var {Base64Encode} = require('base64-stream')

// Set credentials and Region here at reutime if desired
// I configured mine through the CLI, which persists a config file locally (with secrets) so you don't have to do this stuff live
// AWS.config.update({region: 'us-east-1', credentials: {YOUR_CREDENTIALS}});

app.use(bodyParser.urlencoded({ extended: true })); // TODO: <-- Untested Copypasta

app.listen(port, () => {
    console.log(`S3 PDF Server listening at http://localhost:${port}`)
    console.log(`Targeting AWS S3 Bucket: ${bucket}`)
})

app.get('/:filename', (req, res) => {
    let targetFilename = req.params.filename
    console.log(`Fetching file from S3. Bucket: ${bucket} Filename: ${targetFilename}`)
    let params = {Bucket: bucket, Key: targetFilename}
    s3.getObject(params).createReadStream().pipe(new Base64Encode()).pipe(res)
})

app.post('/:filename', (req, res) => {
    let targetFilename = req.params.filename
    console.log(`Incoming Upload request- Filename: ${targetFilename}`, req.body)
    console.log(`Request Body:`, req.body)
    let fileData = req.body // TODO: What kind of Encoding/Decoding/Transformation do I need here to be AWS S3 compatable?
    // Use S3 ManagedUpload class as it supports multipart uploads
  let upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucket,
      Key: targetFilename,
      Body: fileData //,
      // ACL: "public-read" // TODO: <-- Do I need to specify this?
    }})
    let uploadPromise = upload.promise();

    console.log(`Uploading file to S3. Bucket: ${bucket} Filename: ${targetFilename}...`)
    promise.then(
        function(data) {
          alert("File upload successful.");
          res.sendStatus(200); // TODO: Does this go here?
        },
        function(err) {
          return alert("Error uploading file: ", err.message)
        }
      );
})
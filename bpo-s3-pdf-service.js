// *** Setup
// express
const express = require('express')
const app = express()
const port = 3000
// aws
var AWS = require('aws-sdk')
var s3 = new AWS.S3({apiVersion: 'latest'})
// base64
var http = require('http')
var {Base64Encode} = require('base64-stream')

// Set credentials and Region here at reutime if desired
// I configured mine through the CLI, which persists a config file locally (with secrets) so you don't have to do this stuff live
// AWS.config.update({region: 'us-east-1', credentials: {YOUR_CREDENTIALS}});

app.listen(port, () => console.log(`S3 PDF Server listening at http://localhost:${port}`))

app.get('/', (req, res) => {
    var params = {Bucket: 'bpo-pdf-test-1', Key: 'TestPdf.pdf'}
    s3.getObject(params).createReadStream().pipe(new Base64Encode()).pipe(res)
})
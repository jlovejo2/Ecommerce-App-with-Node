const fs = require('fs')
const AWS = require('aws-sdk')
const { promisify } = require('util')


// this is not implemented into system yet
// and example of how to upload an image to s3

const s3 = new AWS.S3()
s3.uploadP = promisify(s3.upload)

const params = {
  Bucket: 'fullstack-printshop',
  Key: 'profile-photos/thedude.jpg',
  Body: fs.createReadStream('thedude.jpg')
}

(async function () {
  await s3.uploadP(params)
})()
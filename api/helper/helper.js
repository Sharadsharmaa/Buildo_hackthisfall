const config = require('../config/config');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

const bucket = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
  endpoint: config.s3_url,
   signatureVersion: 'v4'
});


let transporter = nodemailer.createTransport({
  host: 'send.one.com',
  port: 465,
  secure: true,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword
  }
});

exports.sendEmail = (to, subject, html) => {
  let mailOptions = {
    from: config.emailUser,
    to: to,
    subject: subject,
    html: html
  };
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log('sent');
        resolve(info);
      }
    });
  });
};

console.log(bucket.getBucketCors())


exports.uploadFile = (fileName,object) => {
  const params = {
    Bucket: config.Bucket,
    Key: fileName,
    Body: object,
    ACL: 'public-read',
    ContentType: '*/*',

  };

  return new Promise(function (resolve, reject) {
    bucket.putBucketCors(
      {
        "CORSRules":[
      
          {
      
          "AllowedHeaders": [],
      
          "AllowedMethods": [
      
            "GET"
      
          ],
      
          "AllowedOrigins": [
      
            "*"
      
          ],
      
          "ExposeHeaders": []
      
        }
      
      ]
      }
    )
    bucket.putObject(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data)
        resolve(data);
      }
    });
  });
};

// console.log( uploadFile("mytest","helper/email_templates/password_reset.html"));


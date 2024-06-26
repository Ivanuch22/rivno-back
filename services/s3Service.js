// services/s3Service.js
require('dotenv').config();
const AWS = require('aws-sdk');
const uuid = require("uuid");
const path = require("path");

// Configure AWS SDK
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4' ,
    region:`eu-north-1`
});
const upload =async (files) => {
    if (!files || !files.data) {
        throw new Error("No files provided for upload");
    }

    const fileExtension = path.extname(files.name);
    const avatarName = `${uuid.v4()}${fileExtension}`;
    let fileUrl;
    try {
        const uploadParams = {
            Body: files?.data,
            Bucket: process.env.S3_BUCKET_NAME,
            Key: avatarName,
        };

        const uploadResult = await S3.upload(uploadParams).promise();
        console.log("File uploaded to S3:", uploadResult);
        fileUrl = uploadResult;
        return fileUrl
    } catch (e) {
        return console.error("Error uploading file to S3:", e);

    }
}

module.exports = {upload,S3};

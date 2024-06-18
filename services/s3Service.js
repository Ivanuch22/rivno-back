// services/s3Service.js
require('dotenv').config();
const AWS = require('aws-sdk');
const uuid = require("uuid");

// Configure AWS SDK
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const upload =async (files) => {
    const img = files !== null && files !== undefined ? files.img : undefined;

    let avatarName = uuid.v4() + ".jpg";
    let fileUrl;
    try {

        console.log(files);
        const uploadParams = {
            Body: files?.data,
            Bucket: process.env.S3_BUCKET_NAME,
            Key: avatarName,
            ContentType: "image/jpeg",
        };

        const uploadResult = await S3.upload(uploadParams).promise();
        console.log("File uploaded to S3:", uploadResult);
        fileUrl = uploadResult.Location;
        return fileUrl
    } catch (e) {
        return console.error("Error uploading file to S3:", e);

    }
}


// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname);
//         }
//     })
// });

module.exports = upload;

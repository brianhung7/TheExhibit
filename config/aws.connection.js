const AWS = require('aws-sdk');
const fs = require('fs');
const uuid = require('uuid');

require('dotenv').config();
const credentials = new AWS.EnvironmentCredentials('AWS');
AWS.config.credentials = credentials;

class BucketS3 {
    #s3
    #bucketName

    constructor(){
        this.#s3 = new AWS.S3();
        this.#bucketName = process.env.AWS_BUCKET_NAME;
    }

    uploadFile(file){
        const filePath = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: this.#bucketName,
            Body: filePath,
            Key: `${file.originalname}-${uuid.v4()}`
        }

        return this.#s3.upload(uploadParams).promise();
    }
}


module.exports = new BucketS3();
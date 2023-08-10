import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { config } from './config';

dotenv.config();

const accessKey = config.aws.ACCESS_KEY;
const secretKey = config.aws.SECRET_KEY;

AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});

const s3 = new AWS.S3();

export default s3;

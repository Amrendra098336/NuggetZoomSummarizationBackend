/**
 * AWS S3 Configuration Service.
 *
 * Provides services and utilities for setting up and managing AWS S3 (Amazon Simple Storage Service).
 * This service is responsible for authenticating and initializing AWS S3 configurations, which
 * facilitates operations like file storage, retrieval, and management.
 * It leverages the `aws-sdk` package to interact with AWS S3 and initializes the service with
 * credentials fetched from the environment variables through `dotenv` and the `config` module.
 *
 * Usage:
 * ```typescript
 * import s3 from './path-to-this-file';
 * s3.listBuckets((err, data) => {
 *   if (err) console.log(err, err.stack); // an error occurred
 *   else     console.log(data);           // successful response
 * });
 * ```
 *
 * @module
 * @see [AWS SDK for JavaScript documentation]{@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/} for more details.
 * @see [dotenv documentation]{@link https://github.com/motdotla/dotenv} for more details.
 *
 * @author Amrendra Kumar Singh
 */

// Importing necessary dependencies and configuration.
import AWS from 'aws-sdk'; // AWS SDK for JavaScript to interact with Amazon services.
import dotenv from 'dotenv'; // Module to load environment variables from a .env file.
import { config } from './config'; // Application's specific configuration.

// Initializing dotenv to load environment variables.
dotenv.config();

// Extracting AWS specific credentials from the configuration.
const accessKey = config.aws.ACCESS_KEY;
const secretKey = config.aws.SECRET_KEY;

/**
 * AWS Configuration Initialization.
 *
 * Updates the AWS SDK configuration with provided AWS credentials to ensure
 * all subsequent SDK service clients will use the specified settings.
 *
 * @function
 */
AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretKey
});

// Initializing an instance of the AWS.S3 service object to interact with S3.
const s3 = new AWS.S3();

// Exporting the configured S3 instance for use in other parts of the application.
export default s3;

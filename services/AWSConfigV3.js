import { S3Client } from '@aws-sdk/client-s3';

export const awsS3Client = () => {
    return new S3Client({ region: 'eu-west-2' });
}
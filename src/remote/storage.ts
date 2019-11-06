import { S3 } from "aws-sdk";

export default function init(apiConfig, userIdentityId) {
  const client = new S3();
  const uploader = (key: string, object: any, options: any) => {
    const params = {
      Body: object,
      Bucket: apiConfig.Bucket,
      Key: `protected/${userIdentityId}/${key}`,
      ContentType: options.contentType,
    }
    return client.putObject(params).promise()
  }
  return uploader;
}


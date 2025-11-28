import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucket: string;
  private publicBase: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3({
      region: this.config.get<string>('aws.region'),
      accessKeyId: this.config.get<string>('aws.accessKeyId'),
      secretAccessKey: this.config.get<string>('aws.secretAccessKey'),
    });

    this.bucket = this.config.get<string>('aws.s3Bucket') || '';
    this.publicBase = this.config.get<string>('aws.s3PublicBase') || '';
  }

  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const key = `products/${uuid()}.${ext}`;

    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return `${this.publicBase}/${key}`;
  }
}


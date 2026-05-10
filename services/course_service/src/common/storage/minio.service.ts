import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket = process.env.S3_BUCKET ?? '';
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL ?? '';
  private readonly uploadEndpoint = this.resolveUploadEndpoint();
  private readonly shouldAutoSetupBucket =
    (process.env.S3_AUTO_SETUP ?? (process.env.NODE_ENV === 'production' ? 'false' : 'true')) ===
    'true';

  private readonly client = this.isConfigured() ? this.createClient(process.env.S3_ENDPOINT) : null;
  private readonly uploadClient = this.isConfigured()
    ? this.createClient(this.uploadEndpoint)
    : null;

  async onModuleInit(): Promise<void> {
    if (!this.client || !this.shouldAutoSetupBucket) {
      return;
    }

    await this.ensureBucket();
    await this.configureBucketCors();
    await this.configurePublicReadPolicy();
  }

  isConfigured(): boolean {
    return Boolean(
      process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY &&
      process.env.S3_BUCKET,
    );
  }

  private createClient(endpoint: string | undefined): S3Client {
    return new S3Client({
      endpoint,
      region: process.env.S3_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
      },
      forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? 'true') === 'true',
    });
  }

  private resolveUploadEndpoint(): string | undefined {
    return (
      process.env.S3_UPLOAD_ENDPOINT?.trim() ||
      this.deriveUploadEndpoint() ||
      process.env.S3_ENDPOINT
    );
  }

  private deriveUploadEndpoint(): string | undefined {
    if (!this.publicBaseUrl || !this.bucket) {
      return undefined;
    }

    try {
      const url = new URL(this.publicBaseUrl);
      const bucketPath = `/${this.bucket}`;
      if (url.pathname.replace(/\/$/, '') === bucketPath) {
        url.pathname = '';
        url.search = '';
        url.hash = '';
        return url.toString().replace(/\/$/, '');
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client!.send(new HeadBucketCommand({ Bucket: this.getBucket() }));
      return;
    } catch (error) {
      const statusCode = (error as { $metadata?: { httpStatusCode?: number } }).$metadata
        ?.httpStatusCode;

      if (statusCode && statusCode !== 404) {
        throw error;
      }
    }

    await this.client!.send(new CreateBucketCommand({ Bucket: this.getBucket() }));
    this.logger.log(`Created object storage bucket ${this.getBucket()}`);
  }

  private async configureBucketCors(): Promise<void> {
    const origins = (process.env.WEB_ORIGIN ?? '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    try {
      await this.client!.send(
        new PutBucketCorsCommand({
          Bucket: this.getBucket(),
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedMethods: ['GET', 'HEAD', 'PUT'],
                AllowedOrigins: origins.length > 0 ? origins : ['*'],
                AllowedHeaders: ['*'],
                ExposeHeaders: ['ETag'],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        }),
      );
    } catch (error) {
      this.logger.warn(
        `Could not configure object storage CORS: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  private async configurePublicReadPolicy(): Promise<void> {
    try {
      await this.client!.send(
        new PutBucketPolicyCommand({
          Bucket: this.getBucket(),
          Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.getBucket()}/*`],
              },
            ],
          }),
        }),
      );
    } catch (error) {
      this.logger.warn(
        `Could not configure object storage public-read policy: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  getBucket(): string {
    if (!this.bucket) {
      throw new ServiceUnavailableException('S3 bucket is not configured.');
    }
    return this.bucket;
  }

  async createPresignedUploadUrl(params: {
    key: string;
    contentType: string;
    expiresInSec?: number;
  }): Promise<string> {
    if (!this.uploadClient) {
      throw new ServiceUnavailableException('Object storage is not configured.');
    }

    return getSignedUrl(
      this.uploadClient,
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: params.key,
        ContentType: params.contentType,
      }),
      { expiresIn: params.expiresInSec ?? 900 },
    );
  }

  async uploadObject(params: {
    key: string;
    body: Buffer | Uint8Array | string;
    contentType: string;
  }): Promise<string> {
    if (!this.client) {
      throw new ServiceUnavailableException('Object storage is not configured.');
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    );

    return this.buildPublicUrl(params.key);
  }

  async headObject(key: string): Promise<{ contentLength?: number; contentType?: string }> {
    if (!this.client) {
      throw new ServiceUnavailableException('Object storage is not configured.');
    }

    const result = await this.client.send(
      new HeadObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
      }),
    );

    return {
      contentLength: result.ContentLength,
      contentType: result.ContentType,
    };
  }

  async deleteObject(key: string): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
      }),
    );
  }

  buildPublicUrl(key: string): string {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    }

    if (process.env.S3_ENDPOINT) {
      return `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${this.getBucket()}/${key}`;
    }

    return key;
  }
}

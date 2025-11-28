export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  aws: {
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    s3PublicBase: process.env.AWS_S3_PUBLIC_BASE,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL_SECONDS || '60', 10),
  },
});


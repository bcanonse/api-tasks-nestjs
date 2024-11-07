import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: process.env.PORT,
    hashSalt: Number(process.env.HASH_SALT) ?? 10,
    databaseUrl: process.env.DATABASE_URL,
  };
});

import { v2 } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      // cloud_name: 'drjww0gs9',
      // api_key: '896845177525949',
      // api_secret: 'z34eRf1lzDsDUSdhBqGMWVgQKPw',
      //CLOUDINARY_URL=cloudinary://896845177525949:z34eRf1lzDsDUSdhBqGMWVgQKPw@drjww0gs9
    });
  },
};

import * as dotEnv from 'dotenv';
dotEnv.config();
export const environment = {
  translationKey: process.env.TRANSLATION_KEY || '',
};

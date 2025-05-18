require('dotenv').config();
const { cleanEnv, str, port } = require('envalid');

const env = cleanEnv(process.env, {
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_NAME: str(),
  PORT: port({ default: 5000 }),
});

const DATABASE_URL = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

module.exports = {
  env,           // if you need individual validated values elsewhere
  DATABASE_URL,  // used by db.js
};

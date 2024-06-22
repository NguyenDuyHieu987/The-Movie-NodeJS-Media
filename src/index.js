import 'module-alias/register.js';
import { addAliases } from 'module-alias';
import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = path.resolve();
addAliases({
  '@': `${__dirname}`,
});
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import multer from 'multer';
import RedisCache from './config/redis/index.js';
import route from './routes/index.js';
dotenv.config();

RedisCache.connect();

process.on('exit', () => {
  RedisCache.quit();
});

const app = express();

app.use(
  cors({
    origin: [
      process.env.NODE_ENV != 'production' && 'http://localhost:3000',
      process.env.NODE_ENV != 'production' && 'http://localhost:8080',
      'https://phimhay247z.org',
      'https://dash.phimhay247z.org',
      'https://dashboard.phimhay247z.org',
      // www
      'https://www.phimhay247z.org',
    ],
    credentials: true,
  })
);
app.use('/static', express.static(path.join(__dirname, 'src/public')));
app.use(compression());
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(multer().any());

const server = http.createServer(app);

route(app);

const PORT = 5002;

server.listen(process.env.PORT || PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});

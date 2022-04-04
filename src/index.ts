import env from 'dotenv';
env.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import upload from './config/upload';
import errorHandler from './middlewares/errorHandler';

const uploadMiddleware = multer(upload);

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());
app.use('/models', express.static(upload.directory.modelsFolder));

app.post('/upload', uploadMiddleware.single('file'), (request, response) => {
  response.json(`${request.file_url}`);

  setTimeout(() => {
    return fs.unlink(
      `${upload.directory.modelsFolder}/${request.file_url}`,
      err => {
        if (err) {
          console.log(err);
        }
      },
    );
  }, 10000);
});

app.use(errorHandler);

app.listen(3333, () => console.log('Server started on port 3333!'));

import env from 'dotenv';
env.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';

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
  return response.json(`http://localhost:3333/models/${request.file_url}`);
});

app.use(errorHandler);

app.listen(3333, () => console.log('Server started on port 3333!'));

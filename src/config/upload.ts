import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

import AppError from '../errors/AppError';

const modelsFolder = path.join(__dirname, '..', '..', 'tmp', 'models');

const tmpFolder = {
  modelsFolder,
};

export default {
  directory: tmpFolder,
  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowedMimes = ['model/stl'];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new AppError('Invalid file type', 415));
    }
  },
  storage: multer.diskStorage({
    destination: tmpFolder.modelsFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      request.file_url = filename.replace(/\s/g, '');

      return callback(null, filename.replace(/\s/g, ''));
    },
  }),
};

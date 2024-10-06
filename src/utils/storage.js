import multer from 'multer';
import createHttpError from 'http-errors';
import path from 'path';
import fs from 'fs';
import { generateRandomString, getFormattedNumberDateTime } from './index.js';
const __dirname = path.resolve();

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body?.folder || req.params?.folder || req.query?.folder;

    // if (!folder) {
    //   return createHttpError(500, 'Please provide folder');
    // }

    const uploadPath = path.join(__dirname, 'src/public/imagesTest', folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Đặt tên file với định dạng "originalname-timestamp.ext"
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(
    //   null,
    //   file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    // );

    cb(null, generateRandomString(30) + path.extname(file.originalname));
  },
});

const storageArrayImage = multer.diskStorage({
  destination: function (req, file, cb) {
    const index = parseInt(file.fieldname.match(/\d+/)[0]);
    const item = JSON.parse(req.body[`data[${index}]`]);
    const folder = item.folder;

    const uploadPath = path.join(__dirname, 'src/public/imagesTest', folder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Đặt tên file với định dạng "originalname-timestamp.ext"
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(
    //   null,
    //   file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    // );

    cb(null, generateRandomString(30) + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only allow uploading image files (jpeg, jpg, png)');
  }
};

export const uploadImage = multer({
  storage: storageImage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: imageFilter,
});

export const uploadArrayImage = multer({
  storage: storageArrayImage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: imageFilter,
});

const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body?.folder || req.params?.folder || req.query?.folder;

    // if (!folder) {
    //   return createHttpError(500, 'Please provide folder');
    // }

    const extName = path.extname(file.originalname);
    const originalFileName = file.originalname
      .replace(extName, '')
      .replaceAll(' ', '_');

    const now = new Date();

    // const uploadPath = path.join(
    //   __dirname,
    //   `src/public/videos-storage`,
    //   `${now.getFullYear()}`,
    //   `${String(now.getMonth() + 1).padStart(2, '0')}`,
    //   originalFileName +
    //     '-' +
    //     getFormattedNumberDateTime({ from: 'day', to: 'seconds', join: '.' })
    // );

    const uploadPath = path.join(
      __dirname,
      `src/public/videos-storage/${folder}`,
      originalFileName + '_' + getFormattedNumberDateTime({ to: 'seconds' })
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = getFormattedNumberDateTime({ to: 'seconds' });
    const extName = path.extname(file.originalname);
    cb(
      null,
      file.originalname.replace(extName, '').replaceAll(' ', '_') +
        '_' +
        uniqueSuffix +
        extName
    );
  },
});

const viceoFilter = (req, file, cb) => {
  const fileTypes = /mp4|avi|mkv|mov|webm|flv|wmv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      'Error: Only allow uploading video files (mp4, avi, mkv, mov, webm, flv, wmv)'
    );
  }
};

export const uploadVideo = multer({
  storage: storageVideo,
  //   limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: viceoFilter,
});

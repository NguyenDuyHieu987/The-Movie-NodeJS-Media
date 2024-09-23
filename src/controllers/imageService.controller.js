import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import Vibrant from 'node-vibrant';
const __dirname = path.resolve();

class ImageServiceController {
  async upload(req, res, next) {
    try {
      const folder =
        req.body?.folder || req.params?.folder || req.query?.folder;

      const files = req.files || [req.file];
      // const uploadedFiles = files.map((file) => file.filename);
      let uploadedFiles = files.map((file) => file);

      if (req.files) {
        uploadedFiles.map(async (file) => {
          const palette = Vibrant.from(file.path).getPalette();
          file[`dominant_${folder}_color`] = palette.Vibrant.rgb;
          return file;
        });

        res.json({
          success: true,
          message: 'Images uploaded successfully!',
          files: uploadedFiles,
        });
      } else {
        const fileInfo = uploadedFiles[0];
        const palette = await Vibrant.from(fileInfo.path).getPalette();
        // console.log(palette.Vibrant.rgb); // Màu sắc chủ đạo
        // console.log(palette.Muted.rgb); // Màu sắc dịu hơn
        // console.log(palette.DarkVibrant.rgb); // Màu tối chủ đạo
        fileInfo[`dominant_${folder}_color`] = palette.Vibrant.rgb;

        res.json({
          success: true,
          message: 'Image uploaded successfully!',
          file: fileInfo,
        });
      }
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new ImageServiceController();

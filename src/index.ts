import express, { Request, Response } from 'express';
import multer, {FileFilterCallback} from 'multer';
import path from 'path';
import sharp from 'sharp';
import heic2any from 'heic2any';
import fs from 'fs-extra';
import convert from 'heic-convert';

  
const app = express();
const port = 3000;


// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
  // Check File Type
  const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  };
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  }).single('image'); 
  

//   app.post('/api/upload', async (req: Request, res: Response) => {
//     upload(req, res, (err: any) => {
//       if (err) {
//         res.status(400).json({ error: err.message });
//       } else {
//         if (req.file == undefined) {
//           res.status(400).json({ error: 'No file selected' });
//         } else {
//           res.json({
//             message: 'File uploaded successfully',
//             file: `uploads/${req.file.filename}`
//           });
//         }
//       }
//     });
//   });
  
app.post('/api/upload', async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
      if (err) return res.status(400).json({ error: err.message });
  
      if (!req.file) return res.status(400).json({ error: 'No file selected' });
  
      const filePath = req.file.path;
      const extname = path.extname(filePath).toLowerCase();
      
      try {
        if (extname === '.heic') {
          // Convert HEIC to JPEG
          const inputBuffer = await fs.readFile(filePath);
          const outputBuffer = await convert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1
          });
  
          // Save the converted image
          const outputPath = path.join('./uploads/', `${req.file.filename}.jpg`);
          await fs.writeFile(outputPath, outputBuffer);
  
          // Clean up original file
          await fs.remove(filePath);
  
          // Respond with the path to the converted file
          return res.json({
            message: 'File uploaded and converted successfully',
            file: `uploads/${path.basename(outputPath)}`
          });
        }
  
        // For non-HEIC files, just return the path
        return res.json({
          message: 'File uploaded successfully',
          file: `uploads/${req.file.filename}`
        });
  
      } catch (conversionError) {
        return res.status(500).json({ error: 'Error processing file' });
      }
    });
  });
  

  app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
 
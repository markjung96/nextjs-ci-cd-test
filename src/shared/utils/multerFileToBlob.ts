export const multerFileToBlob = (multerFile: Express.Multer.File): Blob => {
  return new Blob([multerFile.buffer], { type: multerFile.mimetype });
};

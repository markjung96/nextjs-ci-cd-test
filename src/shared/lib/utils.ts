import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const fileToMulterFile = async (file: File): Promise<Express.Multer.File> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    fieldname: file.name,
    originalname: file.name,
    encoding: '7bit',
    mimetype: file.type,
    size: file.size,
    buffer: buffer,
    stream: Readable.from(buffer),
    destination: '',
    filename: file.name,
    path: '',
  };
};

export { cn, fileToMulterFile };

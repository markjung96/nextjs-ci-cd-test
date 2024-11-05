import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import JSZip from 'jszip';

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

type FileFormat = {
  name: string;
  content: string;
};

const processFiles = async (unzipped: any) => {
  const filePromises: any = [];

  unzipped.forEach((relativePath: any, file: any) => {
    if (!file.dir) {
      const filePromise = file.async('text').then((content: any) => {
        return { name: file.name, content: content };
      });
      filePromises.push(filePromise);
    }
  });

  const codes = await Promise.all(filePromises);
  return codes;
};

const fetchZip = async (url: string) => {
  const zipFile = await fetch(url);
  const arrayBuffer = await zipFile.arrayBuffer();
  const zipBlob = new Blob([arrayBuffer], { type: 'application/zip' });
  const zip = new JSZip();
  const unzippedFiles = await zip.loadAsync(zipBlob);
  const files: FileFormat[] = await processFiles(unzippedFiles);
  return files;
};

export { cn, fileToMulterFile, fetchZip };

'use client';
import { Button } from '@/src/shared/ui';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { FC } from 'react';

interface LinkButtonProps {
  value: string;
  href: string;
  imgSrc: StaticImport;
  height?: number
}
export const LinkButton: FC<LinkButtonProps> = ({ value, href, imgSrc, height = 62 }) => {
  const handleClickLink = () => {
    window.open(href, '_blank');
  };
  return (
    <Button className='p-0' variant="ghost" onClick={handleClickLink}>
      <div className="flex items-center gap-1">
        <Image src={imgSrc} height={height} alt={value} />
        {value}
      </div>
    </Button>
  );
};

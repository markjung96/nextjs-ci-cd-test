'use client';
import { Button } from '@/src/shared/ui';
import Image from 'next/image';
import { FC } from 'react';

interface LinkButtonProps {
  value: string;
  href: string;
  imgSrc: string;
}
export const LinkButton: FC<LinkButtonProps> = ({ value, href, imgSrc }) => {
  const handleClickLink = () => {
    window.open(href, '_blank');
  };
  return (
    <Button variant="ghost" onClick={handleClickLink}>
      <div className="flex items-center gap-1">
        <Image width={20} height={20} src={imgSrc} alt={value} />
        {value}
      </div>
    </Button>
  );
};

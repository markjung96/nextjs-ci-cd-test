'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import LogoBlackIcon from '@/public/images/Logo-b-default.svg';
import LogoWhiteIcon from '@/public/images/Logo-w-default.svg';

export const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link href="/">
      <Image
        src={theme === 'dark' ? LogoWhiteIcon : LogoBlackIcon}
        alt="Logo"
        className="w-[128px] h-[32px]"
        priority
      />
    </Link>
  );
};

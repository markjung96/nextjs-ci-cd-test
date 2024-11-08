'use client';
import { Button, Label } from '@/src/shared/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/shared/ui/table';
import { Circle, Link } from 'lucide-react';
import { LinkButton } from './link-button';
import VeriwellLogoBlack from '@/public/images/platforms/veriwell-logo-black.png';
import VeriwellLogoWhite from '@/public/images/platforms/veriwell-logo-white.png';
import BlockscoutLogoBlack from '@/public/images/platforms/blockscout-B.svg';
import BlockscoutLogoWhite from '@/public/images/platforms/blockscout-W.svg';
import SourcifyLogoBlack from '@/public/images/platforms/sourcify-B.svg';
import SourcifyLogoWhite from '@/public/images/platforms/sourcify-W.svg';
import VerifiedBlack from '@/public/images/verified-black.png';
import VerifiedWhite from '@/public/images/verified-white.png';
import { useTheme } from 'next-themes';
import Image from 'next/image';

// 웹 페이지에서 Favicon URL을 추출하는 함수
const getFavicon = async (url: string) => {
  return new URL('/favicon.ico', url).href;
};

export default function Tools() {
  const { resolvedTheme } = useTheme();
  const veriwellFavicon = resolvedTheme === 'dark' ? VeriwellLogoWhite : VeriwellLogoBlack;
  const blockscoutFavicon = resolvedTheme === 'dark' ? BlockscoutLogoWhite : BlockscoutLogoBlack;
  const sourcifyFavicon = resolvedTheme === 'dark' ? SourcifyLogoWhite : SourcifyLogoBlack;
  const Verified = resolvedTheme === 'dark' ? VerifiedWhite : VerifiedBlack;
  return (
    <>
      <div className="rounded-full border-2 border-primary p-1 dark:bg-white dark:text-black bg-black text-white">
        <Label className="text-lg font-semibold">Open Source Verification Tools</Label>
      </div>
      <Table className="max-w-2xl rounded-lg shadow-lg w-[480px]">
        <TableHeader>
          <TableRow className="!border-b-4 border-black dark:border-white hover:bg-transparent !p-0">
            <TableHead></TableHead>
            <TableHead className="font-bold text-primary">
              <LinkButton value="" href="https://verification-roan.vercel.app/" imgSrc={veriwellFavicon} />
            </TableHead>
            <TableHead className="text-lg font-bold text-primary">
              <LinkButton value="" href="https://vera.blockscout.com/" imgSrc={blockscoutFavicon} />
            </TableHead>
            <TableHead className="text-lg font-bold text-primary">
              <LinkButton value="" height={100} href="https://sourcify.dev/#/" imgSrc={sourcifyFavicon} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            {
              tool: 'Solidity',
              blockscout: true,
              sourcify: true,
              veriwell: true,
            },
            { tool: 'Vyper', blockscout: true, sourcify: true, veriwell: null },
            {
              tool: 'Stylus',
              blockscout: false,
              sourcify: false,
              veriwell: true,
            },
            {
              tool: 'Cairo',
              blockscout: false,
              sourcify: false,
              veriwell: true,
            },
          ].map((row) => (
            <TableRow key={row.tool} className="border-b border-black dark:border-white hover:bg-transparent">
              <TableCell className="font-medium">{row.tool}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {row.veriwell ? <Image width={20} height={20} src={Verified} alt="verifed" /> : null}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {row.blockscout ? <Image width={20} height={20} src={Verified} alt="verifed" /> : null}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {row.sourcify ? <Image width={20} height={20} src={Verified} alt="verifed" /> : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

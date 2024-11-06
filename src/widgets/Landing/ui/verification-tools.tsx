'use server';
import { Button, Label } from '@/src/shared/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/shared/ui/table';
import { Circle } from 'lucide-react';
import { LinkButton } from './link-button';

// 웹 페이지에서 Favicon URL을 추출하는 함수
const getFavicon = async (url: string) => {
  return new URL('/favicon.ico', url).href;
};

export default async function Tools() {
  const blockscoutFavicon = await getFavicon('https://vera.blockscout.com/');
  const sourcifyFavicon = await getFavicon('https://sourcify.dev/#/');
  return (
    <>
      <Label className="text-lg font-semibold">Open Source Verification Tools</Label>
      <Table className="w-full max-w-2xl rounded-lg shadow-lg">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead></TableHead>
            <TableHead className="font-bold text-primary">Veriwell</TableHead>
            <TableHead className="text-lg font-bold text-primary">
              <LinkButton value="Blockscout" href="https://vera.blockscout.com/" imgSrc={blockscoutFavicon} />
            </TableHead>
            <TableHead className="text-lg font-bold text-primary">
              <LinkButton value="Sourcify" href="https://sourcify.dev/#/" imgSrc={sourcifyFavicon} />
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
            <TableRow key={row.tool} className="border-b border-gray-200 hover:bg-transparent">
              <TableCell className="font-medium">{row.tool}</TableCell>
              <TableCell>
                <div className="flex justify-center">{row.veriwell ? <Circle size={20} color="green" /> : null}</div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">{row.blockscout ? <Circle size={20} color="green" /> : null}</div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">{row.sourcify ? <Circle size={20} color="green" /> : null}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

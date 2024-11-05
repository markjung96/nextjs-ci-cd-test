'use client';
import { FC, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/ui';
import { CodeExplorer, FileStructure } from './code-explorer';
import { ContractInteract } from './contract-interact';
import { ContractInteractStarknet } from './contract-interact-starknet';
import { fetchZip } from '@/src/shared/lib/utils';

interface VerifiedInfoProps {
  chain: string;
  network: string;
  contractAddress: string;
  verifiedSrcUrl: string;
  outFileUrl?: string;
}

export const VerifiedInfo: FC<VerifiedInfoProps> = ({
  chain,
  network,
  contractAddress,
  verifiedSrcUrl,
  outFileUrl,
}) => {
  const [fileStructure, setFileStructure] = useState<FileStructure[]>([]);

  const getFiles = async (url: string) => {
    const files = await fetchZip(url);
    const structedFiles = files.reduce((acc: FileStructure[], file) => {
      const path = file.name.split('/');
      let current = acc;
      for (let i = 0; i < path.length; i++) {
        const name = path[i];
        const existing = current.find((item: FileStructure) => item.name === name);
        if (existing) {
          current = existing.children!;
        } else {
          const newFolder = {
            name,
            type: i === path.length - 1 ? 'file' : 'folder',
            content: i === path.length - 1 ? file.content : null,
            children: [],
          };
          current.push(newFolder);
          current = newFolder.children;
        }
      }
      return acc;
    }, []);
    setFileStructure(structedFiles);
  };

  useEffect(() => {
    getFiles(verifiedSrcUrl);
  }, []);

  return (
    <>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <p className="block sm:inline">Contract {contractAddress} has been verified</p>
        <br />
        <p className="block sm:inline">
          You can download the verified source code{' '}
          <a href={verifiedSrcUrl} className="text-blue-600" download>
            here
          </a>
        </p>
      </div>
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeExplorer url={verifiedSrcUrl} fileStructure={fileStructure} />
        </TabsContent>
        <TabsContent value="interact">
          {outFileUrl && (
            <>
              {chain === 'starknet' ? (
                <ContractInteractStarknet
                  chain={chain}
                  network={network}
                  outFileUrl={outFileUrl}
                  contractAddress={contractAddress!}
                  fileStructure={fileStructure}
                />
              ) : (
                <ContractInteract
                  chain={chain}
                  network={network}
                  outFileUrl={outFileUrl}
                  contractAddress={contractAddress!}
                  fileStructure={fileStructure}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

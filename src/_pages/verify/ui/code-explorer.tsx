'use client';
import { FC } from 'react';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, Folder } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CodeExplain } from './code-explain';
import { useTheme } from 'next-themes';

export type FileStructure = {
  name: string;
  type: string;
  content: string | null;
  children?: FileStructure[];
};
interface CodeExplorerProps {
  url: string;
  fileStructure?: FileStructure[];
}

export const CodeExplorer: FC<CodeExplorerProps> = ({ url, fileStructure }) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = React.useState<FileStructure | null>(null);

  const renderFileTree = (items?: FileStructure[]) => {
    return items?.map((item) => (
      <div key={item.name} className="pl-4">
        {item.type === 'folder' ? (
          <div>
            <div className="flex items-center py-1">
              <Folder className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {renderFileTree(item.children)}
          </div>
        ) : (
          <div
            className="flex items-center py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => setSelectedFile(item)}
          >
            <File className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className="border rounded-lg shadow-sm h-[600px] flex">
        <div className="w-1/4 border-r">
          <ScrollArea className="h-full">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Files</h3>
              {renderFileTree(fileStructure)}
            </div>
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{selectedFile ? selectedFile.name : 'No file selected'}</h3>
          </div>
          <ScrollArea className="flex-1">
            <SyntaxHighlighter
              language={selectedFile?.name.includes('.rs') ? 'rust' : 'toml'}
              style={theme === 'dark' ? a11yDark : a11yLight}
              wrapLongLines
            >
              {selectedFile ? selectedFile.content! : 'Select a file to view its content'}
            </SyntaxHighlighter>
          </ScrollArea>
        </div>
      </div>
      <CodeExplain content={selectedFile?.content!} />
    </>
  );
};

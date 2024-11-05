'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/src/shared/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MarkdownPreview } from './mark-down-preview';
import { useTheme } from 'next-themes';

interface FunctionExplainModalProps {
  code?: string;
}

export default function FunctionExplainModal({ code }: FunctionExplainModalProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getExplanationByApi = async (code: string) => {
    setIsLoading(true);
    const result = await fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: code }),
    });
    const { text } = await result.json();
    setIsLoading(false);
    setExplanation(text);
  };

  useEffect(() => {
    if (!!code) {
      getExplanationByApi(code);
    }
  }, [code]);

  if (!code) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Show code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] w-[90vw] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Function code and explanation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4 ">
          {/* 왼쪽: 코드 */}
          <div className="max-h-[50%]">
            <h3 className="text-lg font-semibold mb-2">Code</h3>
            <pre className="bg-white-800 dark:bg-gray-800 text-white rounded overflow-x-auto">
              <ScrollArea className="max-h-[calc(100%-2rem)] rounded border p-4">
                <SyntaxHighlighter
                  language="solidity"
                  wrapLongLines
                  className="text-sm"
                  style={theme === 'dark' ? a11yDark : a11yLight}
                >
                  {code || ''}
                </SyntaxHighlighter>
              </ScrollArea>
            </pre>
          </div>
          {/* 오른쪽: 설명 */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="max-h-[50%]">
              <h3 className="text-lg font-semibold mb-2">Explanation</h3>
              <ScrollArea className="h-[calc(100%-2rem)] rounded border p-4 flex-1">
                <MarkdownPreview markdown={explanation} />
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

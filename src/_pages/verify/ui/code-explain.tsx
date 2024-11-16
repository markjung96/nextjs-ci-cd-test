'use client';
import { FC } from 'react';
import { useEffect } from 'react';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownPreview } from './mark-down-preview';
import { Loader } from '@/src/widgets/Loader';

interface CodeExplainProps {
  content: string;
}

export const CodeExplain: FC<CodeExplainProps> = ({ content }) => {
  const [explainContent, setExplainContent] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const getExplainContentByAi = async (content: string) => {
    setIsLoading(true);
    const result = await fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    const { text } = await result.json();
    setIsLoading(false);
    setExplainContent(text);
  };

  useEffect(() => {
    getExplainContentByAi(content);
  }, [content]);

  return (
    <div className="border rounded-lg shadow-sm h-[600px] flex mt-4">
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Code Explain By AI (Gemini 1.5 Pro)</h3>
        </div>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader size={32} />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <MarkdownPreview markdown={explainContent || ''} />
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

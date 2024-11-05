import React from 'react';
import { default as MarkdownPost } from '@uiw/react-markdown-preview';
import { useTheme } from 'next-themes';

type MarkdownRendererProps = {
  markdown: string;
};

export function MarkdownPreview({ markdown }: MarkdownRendererProps) {
  const { theme } = useTheme();
  return (
    <MarkdownPost
      source={markdown}
      className="p-4"
      wrapperElement={{
        'data-color-mode': theme === 'dark' ? 'dark' : 'light',
      }}
    />
  );
}

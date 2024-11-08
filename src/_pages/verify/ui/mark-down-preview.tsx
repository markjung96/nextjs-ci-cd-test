import React from 'react';
import { default as MarkdownPost } from '@uiw/react-markdown-preview';
import { useTheme } from 'next-themes';

type MarkdownRendererProps = {
  markdown: string;
};

export function MarkdownPreview({ markdown }: MarkdownRendererProps) {
  const { resolvedTheme } = useTheme();
  return (
    <MarkdownPost
      source={markdown}
      className="p-4"
      wrapperElement={{
        'data-color-mode': resolvedTheme === 'dark' ? 'dark' : 'light',
      }}
    />
  );
}

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 dark:text-zinc-300 dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            return !inline ? (
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto my-3">
                <code className="text-xs font-mono text-amber-200" {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono text-xs" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
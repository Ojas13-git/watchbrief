"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BriefMarkdown({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="brief-md px-3 py-2 text-sm text-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mb-2 mt-4 font-semibold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-4 text-[15px] font-semibold tracking-tight first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-2 mt-3 text-sm font-semibold first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-ink-muted">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-2 list-disc space-y-1 pl-5 text-ink-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 list-decimal space-y-1 pl-5 text-ink-muted">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          hr: () => <hr className="my-3 border-line" />,
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-line-strong">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1.5 font-semibold text-ink">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-line px-2 py-1.5 align-top text-ink-muted">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

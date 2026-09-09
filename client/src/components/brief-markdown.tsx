"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BriefMarkdown({text}: {text: string}) {
      if(!text) return null;

      return(
            <div className="brief-md rounded border p-3 text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-2 mt-3 text-sm font-semibold first:mt-0">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          hr: () => <hr className="my-3 border-zinc-300 dark:border-zinc-700" />,
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-300 dark:border-zinc-600">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-zinc-200 px-2 py-1 align-top dark:border-zinc-800">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline"
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
      )
}
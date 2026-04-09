"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import hljs from "highlight.js";

import "highlight.js/styles/github-dark.css";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <pre className="rounded-lg">
                <code
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(children.toString(), {
                      language: match[1],
                    }).value,
                  }}
                />
              </pre>
            ) : (
              <code className="bg-foreground/10 px-1 py-0.5 rounded">
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

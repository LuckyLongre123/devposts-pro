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
          // Removed 'inline' from the destructured props
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            // If it's a code block with a language (match exists), render with Highlight.js
            return match ? (
              <pre className="rounded-lg">
                <code
                  {...props}
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(
                      String(children).replace(/\n$/, ""),
                      {
                        language: match[1],
                      },
                    ).value,
                  }}
                />
              </pre>
            ) : (
              // Otherwise, render as standard inline code
              <code className="bg-foreground/10 px-1 py-0.5 rounded" {...props}>
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

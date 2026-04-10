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
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (match) {
              const lang = match[1];
              const codeString = String(children).replace(/\n$/, "");

              const languageMap: Record<string, string> = {
                env: "bash",
                prisma: "graphql", // Prisma syntax is somewhat similar to graphql for basic highlighting
              };

              const mappedLang = languageMap[lang] || lang;

              const isSupported = !!hljs.getLanguage(mappedLang);
              const languageToUse = isSupported ? mappedLang : "plaintext"; // Fallback to plaintext

              const highlightedHtml = hljs.highlight(codeString, {
                language: languageToUse,
              }).value;

              return (
                <pre className="rounded-lg">
                  <code
                    {...props}
                    className={className} // Preserve original class names
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                </pre>
              );
            }

            return (
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

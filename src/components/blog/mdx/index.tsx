import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import type React from "react";
import type { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import type { MDXContentProps } from "./types";

const components: MDXComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="text-4xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-20"
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="text-3xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-20"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="text-2xl font-bold mt-6 mb-3 text-gray-900 scroll-mt-20"
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      {...props}
      className="text-xl font-bold mt-6 mb-3 text-gray-900 scroll-mt-20"
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-4 leading-relaxed text-gray-700 text-justify">
      {children}
    </p>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
    >
      {children}
    </a>
  ),
  img: ({
    src,
    alt,
    width,
    height,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null;
    return (
      <span className="block my-8">
        <Image
          src={String(src)}
          alt={alt || ""}
          width={800}
          height={600}
          unoptimized
          className="rounded-lg shadow-lg w-full h-auto"
          {...props}
        />
        {alt && (
          <span className="block text-center text-sm text-gray-500 mt-2 italic">
            {alt}
          </span>
        )}
      </span>
    );
  },
  code: ({
    children,
    className,
    ...props
  }: {
    children?: ReactNode;
    className?: string;
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="px-2 py-1 bg-gray-100 text-red-600 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="my-6 rounded-lg overflow-hidden shadow-lg">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || "text"}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className="not-prose my-6">
      {children}
    </div>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4"
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="leading-relaxed">
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-600 bg-blue-50 py-4 rounded-r-lg"
    >
      {children}
    </blockquote>
  ),
  table: ({
    children,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table
        {...props}
        className="min-w-full border border-gray-200 rounded-lg overflow-hidden"
      >
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-gray-100">
      {children}
    </thead>
  ),
  tbody: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      {...props}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {children}
    </tr>
  ),
  th: ({
    children,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
    >
      {children}
    </th>
  ),
  td: ({
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="px-4 py-3 text-sm text-gray-700">
      {children}
    </td>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className="my-8 border-gray-300" />
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-bold text-gray-900">
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic text-gray-700">
      {children}
    </em>
  ),
  input: ({
    type,
    checked,
    disabled,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="mr-2 accent-blue-600"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [],
          },
        }}
      />
    </div>
  );
}

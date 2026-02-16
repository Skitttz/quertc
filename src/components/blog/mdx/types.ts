interface MDXComponents {
  [key: string]: React.ComponentType<unknown>;
}

interface MDXContentProps {
  content: string;
}

export type { MDXComponents, MDXContentProps };

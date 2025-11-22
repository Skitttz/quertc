interface MDXComponents {
  [key: string]: React.ComponentType<any>; 
}

interface MDXContentProps {
  content: string;
}

export type { MDXComponents, MDXContentProps };
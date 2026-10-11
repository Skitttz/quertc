interface BlogPostCard {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  preview: string;
  date: string;
  comments: number;
  labels: Array<{ id: number; name: string; color: string }>;
}

export type { BlogPostCard };

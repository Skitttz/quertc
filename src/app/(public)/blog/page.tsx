import { TrendingUp } from "lucide-react";
import { Suspense } from "react";
import { BlogPosts } from "@/components/blog/posts";
import { ShimmerBlog } from "@/components/blog/shimmer";
import { PublicContainer } from "@/components/public/PublicContainer";
import {
  extractFirstImage,
  getAllPosts,
  getPostPreviewSimple,
} from "@/lib/github";
import { formatLongDatePtBr } from "@/utils/date-helpers";
import { generateSlug } from "@/utils/generate-slug";

export async function generateMetadata() {
  return {
    title: "Quertc | Blog e Atualizações",
    description:
      "Mantenha-se atualizado com as últimas notícias, tutoriais e insights sobre o projeto Quertc no nosso blog oficial.",
  };
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <PublicContainer classNames={{ content: "pt-4" }}>
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <header className="mb-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4">
              <TrendingUp size={16} />
              <span>Novidades do Projeto</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent py-4">
              Blog & Atualizações
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Fique por dentro das últimas novidades, tutoriais e insights sobre
              o projeto
            </p>
          </header>

          <Suspense fallback={<ShimmerBlog />}>
            <BlogPosts
              posts={posts.map((post) => ({
                id: post.id,
                title: post.title,
                slug: generateSlug(post.title),
                image: extractFirstImage(post.body),
                preview: getPostPreviewSimple(post.body, 150),
                date: formatLongDatePtBr(post.created_at),
                comments: post.comments,
                labels: post.labels,
              }))}
            />
          </Suspense>
        </div>
      </div>
    </PublicContainer>
  );
}

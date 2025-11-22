import { Calendar, Clock, MessageCircle, Tag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicContainer } from "@/components/public/PublicContainer";
import { MDXContent } from "@/components/blog/mdx";
import { getAllPosts } from "@/lib/github";
import { AppRoutesEnum } from "@/shared/route";
import { formatLongDatePtBr } from "@/utils/date-helpers";
import { generateSlug } from "@/utils/generate-slug";
import { Suspense } from "react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: generateSlug(post.title),
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const slug = params?.slug?.replace(/^[-]+|[-]+$/g, "") || "";
  const posts = await getAllPosts();

  const post = posts.find((p) => generateSlug(p.title) === slug) || null;

  if (!post) {
    return {
      title: "Quertc | Post não encontrado",
    };
  }

  return {
    title: post.title,
    description: post.body.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const posts = await getAllPosts();
  const post = posts.find((p) => generateSlug(p.title) === params.slug);

  if (!post) {
    notFound();
  }

  const wordCount = post.body.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <PublicContainer classNames={{ content: "pt-4" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={AppRoutesEnum.BLOG}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o blog</span>
        </Link>

        <header className="mb-12 space-y-6">
          {post.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.labels.map((label) => (
                <span
                  key={label.id}
                  style={{
                    backgroundColor: `#${label.color}15`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}30`,
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border"
                >
                  <Tag size={12} />
                  {label.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <span>{formatLongDatePtBr(post.created_at)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-500" />
              <span>{readingTime} min de leitura</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-green-500" />
              <span>
                {post.comments} {post.comments === 1 ? "comentário" : "comentários"}
              </span>
            </div>
          </div>
        </header>

        <article className="prose prose-lg prose-gray max-w-none">
          <Suspense fallback={<p>Loading...</p>}>
            <MDXContent content={post.body} />
          </Suspense>
        </article>
      </div>
    </PublicContainer>
  );
}
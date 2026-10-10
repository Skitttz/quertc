import { Calendar, FileText, Search, Tag, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ShimmerBlog } from "@/components/blog/shimmer";
import { PublicContainer } from "@/components/public/PublicContainer";
import {
  extractFirstImage,
  getAllPosts,
  getPostPreviewSimple,
} from "@/lib/github";
import { AppRoutesEnum } from "@/shared/route";
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
          <header className="mb-16 text-center space-y-6">
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

            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar posts..."
                  className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </header>

          <Suspense fallback={<ShimmerBlog />}>
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <FileText className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Nenhum post publicado ainda
                </h3>
                <p className="text-muted-foreground">
                  Fique atento! Em breve teremos conteúdo novo por aqui.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      {posts.length}
                    </span>{" "}
                    {posts.length === 1 ? "post publicado" : "posts publicados"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => {
                    const slug = generateSlug(post.title);
                    const image = extractFirstImage(post.body);
                    const preview = getPostPreviewSimple(post.body, 150);

                    return (
                      <Link
                        key={post.id}
                        href={`${AppRoutesEnum.BLOG}/${slug}`}
                        className="group block"
                      >
                        <article className="h-full bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                          {image ? (
                            <div className="relative h-48 w-full overflow-hidden bg-muted">
                              <Image
                                src={image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          ) : (
                            <div className="h-48 w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
                              <FileText className="text-primary/40" size={48} />
                            </div>
                          )}

                          <div className="p-6 space-y-4">
                            {post.labels.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.labels.slice(0, 3).map((label) => {
                                  return (
                                    <span
                                      key={label.id}
                                      style={{
                                        backgroundColor: `#${label.color}15`,
                                        color: `#${label.color}`,
                                        borderColor: `#${label.color}30`,
                                      }}
                                      className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border"
                                    >
                                      <Tag size={10} />
                                      {label.name}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            <h2 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>

                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed text-ellipsis text-justify text-balance">
                              {preview}
                            </p>

                            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-primary" />
                                <span>
                                  {formatLongDatePtBr(post.created_at)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <FileText
                                  size={14}
                                  className="text-purple-500"
                                />
                                <span>
                                  {post.comments}{" "}
                                  {post.comments === 1
                                    ? "comentário"
                                    : "comentários"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </PublicContainer>
  );
}

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 text-sm font-medium mb-4">
              <TrendingUp size={16} />
              <span>Novidades do Projeto</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent py-4">
              Blog & Atualizações
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Fique por dentro das últimas novidades, tutoriais e insights sobre
              o projeto
            </p>

            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar posts..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </header>

          <Suspense fallback={<ShimmerBlog />}>
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Nenhum post publicado ainda
                </h3>
                <p className="text-gray-500">
                  Fique atento! Em breve teremos conteúdo novo por aqui.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-gray-600">
                    <span className="text-gray-900 font-semibold">
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
                        <article className="h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                          {image ? (
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
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
                            <div className="h-48 w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <FileText className="text-blue-300" size={48} />
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

                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h2>

                            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed text-ellipsis text-justify text-balance">
                              {preview}
                            </p>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-blue-500" />
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

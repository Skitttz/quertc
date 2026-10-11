"use client";

import { Calendar, FileText, Search, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppRoutesEnum } from "@/shared/route";
import { normalizeText } from "@/utils/text-helpers";
import type { BlogPostCard } from "./types";

export function BlogPosts({ posts }: { posts: BlogPostCard[] }) {
  const [search, setSearch] = useState("");
  const query = normalizeText(search.trim());

  const visiblePosts = useMemo(
    () =>
      posts.filter((post) =>
        [post.title, post.preview, ...post.labels.map((label) => label.name)]
          .map(normalizeText)
          .some((text) => text.includes(query)),
      ),
    [posts, query],
  );

  if (posts.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="max-w-xl mx-auto mb-16">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="search"
            aria-label="Pesquisar posts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar posts..."
            className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <p className="text-muted-foreground">
          <span className="text-foreground font-semibold">
            {visiblePosts.length}
          </span>{" "}
          {query
            ? visiblePosts.length === 1
              ? "post encontrado"
              : "posts encontrados"
            : visiblePosts.length === 1
              ? "post publicado"
              : "posts publicados"}
        </p>
      </div>

      {visiblePosts.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          Nenhum post encontrado para “{search.trim()}”.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post) => (
          <Link
            key={post.id}
            href={`${AppRoutesEnum.BLOG}/${post.slug}`}
            className="group block"
          >
            <article className="h-full bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
              {post.image ? (
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <Image
                    src={post.image}
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
                    {post.labels.slice(0, 3).map((label) => (
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
                    ))}
                  </div>
                )}

                <h2 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed text-ellipsis text-justify text-balance">
                  {post.preview}
                </p>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    <span>{post.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FileText size={14} className="text-purple-500" />
                    <span>
                      {post.comments}{" "}
                      {post.comments === 1 ? "comentário" : "comentários"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}

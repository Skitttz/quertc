import { generateSlug } from "@/utils/generate-slug";
import type { GitHubIssue } from "./types";
import { remark } from "remark";


async function fetchGitHub(endpoint: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${process.env.GITHUB_REPO}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorBody}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error GitHub API:", error);
    throw error;
  }
}

export async function getAllPosts(): Promise<GitHubIssue[]> {
  return fetchGitHub(
    "/issues?state=open&sort=created&direction=desc",
  );
}

export function extractFirstImage(body: string): string | null {
  if (!body) return null;

  // Markdown ![alt](url)
  const markdownRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = body.match(markdownRegex);
  if (markdownMatch) return markdownMatch[1];

  // HTML <img src="..." />
  const htmlRegex = /<img[^>]+src=["'](.*?)["']/i;
  const htmlMatch = body.match(htmlRegex);
  if (htmlMatch) return htmlMatch[1];

  return null;
}

export function removeImagesFromBody(body: string): string {
  if (!body) return "";
  let result = body.replace(/!\[.*?\]\(.*?\)/g, "");
  result = result.replace(/<img [^>]*>/g, "");
  return result;
}

export function getPostPreviewSimple(body: string, maxLength = 150) {
  if (!body) return "";
  let clean = body.replace(/!\[.*?\]\(.*?\)/g, "").replace(/<img [^>]*>/g, "");
  clean = clean.replace(/[#*_>`~-]/g, ""); 
  clean = clean.replace(/\n+/g, " ").trim();

  return clean.length > maxLength ? clean.substring(0, maxLength) + "..." : clean;
}


export async function getPostBySlug(slug: string): Promise<GitHubIssue | null> {
  const posts = await getAllPosts();
  return posts.find((post) => generateSlug(post.title) === slug) || null;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => generateSlug(post.title));
}

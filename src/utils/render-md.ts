import { remark } from "remark";
import html from "remark-html";
import { removeImagesFromBody } from "@/lib/github";

export async function renderMarkdown(body: string): Promise<string> {
  const cleanBody = removeImagesFromBody(body);
  const processed = await remark().use(html).process(cleanBody);
  return processed.toString();
}

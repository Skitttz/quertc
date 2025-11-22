export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")          
    .replace(/[^\p{L}\p{N}\s-]/gu, "")       
    .replace(/\s+/g, "-")                   
    .replace(/-+/g, "-")                   
    .replace(/^[-]+|[-]+$/g, "")             
    .trim();
}
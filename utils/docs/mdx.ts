import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXMetadata } from './types';

export function getMDXMetadata(slug: string[]): MDXMetadata | null {
  try {
    const docsPath = path.join(process.cwd(), "app/docs");
    const filePath = path.join(docsPath, ...slug) + "/page.mdx";

    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    
    return {
      title: `${data.title} — Documentation — Bad Clients` || "Documentation",
      description: data.description || ""
    };
  } catch (error) {
    console.error("Error reading MDX metadata:", error);
    return null;
  }
}

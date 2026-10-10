export type Article = {
  title: string;
  description: string;
  href: string;
  date: string;
};

// No publishable articles exist yet. Adding an entry here enables the Writing
// section on the home page and its navigation link automatically.
export const articles: Article[] = [];

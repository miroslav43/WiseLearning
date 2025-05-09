
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  categories: string[];
  tags?: string[];
  comments: number;
  likes?: number;
}

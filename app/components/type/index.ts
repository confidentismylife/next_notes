export interface Post {
    slug: string;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    date: string;
    readTime: number;
    views: number;
    likes: number;
    toc: string[];
    number: string;
    dotColor: string;
    coverImage?: string;
    excerpt?: string;
}
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
    category?: string;
}

// 定义常量分类列表
export const CATEGORIES = {
    ALL: '全部',
    KNOWLEDGE: '知识',
    COMPONENTS: '组件库',
    TALKS: '杂谈'
};
import type { Category } from './category';

export type Blog = {
    _id: string;
    blogTitle: string;
    blogContent: string;
    blogImage: string;
    categoryId: string | Category;
    blogAuthor?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
}; 
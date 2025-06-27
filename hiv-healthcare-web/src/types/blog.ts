export interface Blog {
  _id: string;
  blogTitle: string;
  blogContent?: string;
  blogAuthor?: string;
  blogImage?: string;
  categoryId: string; // hoặc Category nếu populate
  createdAt: string;
  updatedAt: string;
} 
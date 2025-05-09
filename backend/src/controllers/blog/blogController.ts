import { Request, Response } from 'express';
import * as blogCommentService from './blogCommentService';
import * as blogPostService from './blogPostService';
import * as blogTaxonomyService from './blogTaxonomyService';

/**
 * Get all published blog posts
 * GET /api/blog/posts
 */
export const getAllPublishedPosts = async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      categoryId, 
      tagId, 
      search 
    } = req.query;
    
    const result = await blogPostService.getAllPublishedPosts(
      parseInt(page as string), 
      parseInt(limit as string),
      categoryId as string | undefined,
      tagId as string | undefined,
      search as string | undefined
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
};

/**
 * Get a specific blog post
 * GET /api/blog/posts/:id
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await blogPostService.getPostById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error(`Error fetching blog post ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
};

/**
 * Create a blog post
 * POST /api/blog/posts
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { 
      title, 
      excerpt, 
      content, 
      image, 
      published, 
      readTime,
      categoryIds,
      tagIds
    } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const post = await blogPostService.createPost(userId, {
      title,
      excerpt,
      content,
      image,
      published,
      readTime,
      categoryIds,
      tagIds
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Failed to create blog post' });
  }
};

/**
 * Update a blog post
 * PUT /api/blog/posts/:id
 */
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { 
      title, 
      excerpt, 
      content, 
      image, 
      published, 
      readTime,
      categoryIds,
      tagIds
    } = req.body;
    
    const post = await blogPostService.updatePost(id, userId, {
      title,
      excerpt,
      content,
      image,
      published,
      readTime,
      categoryIds,
      tagIds
    });
    
    res.status(200).json(post);
  } catch (error) {
    console.error(`Error updating blog post ${req.params.id}:`, error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (error.message.includes('own blog posts')) {
        return res.status(403).json({ message: 'You can only update your own blog posts' });
      }
    }
    
    res.status(500).json({ message: 'Failed to update blog post' });
  }
};

/**
 * Delete a blog post
 * DELETE /api/blog/posts/:id
 */
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    await blogPostService.deletePost(id, userId);
    
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(`Error deleting blog post ${req.params.id}:`, error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      if (error.message.includes('own blog posts')) {
        return res.status(403).json({ message: 'You can only delete your own blog posts' });
      }
    }
    
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
};

/**
 * Get all categories
 * GET /api/blog/categories
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await blogTaxonomyService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

/**
 * Get all tags
 * GET /api/blog/tags
 */
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await blogTaxonomyService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
};

/**
 * Add a comment to a post
 * POST /api/blog/posts/:id/comments
 */
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Post ID
    const userId = (req as any).user.id;
    const { content, parentId } = req.body;
    
    // Validate content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const comment = await blogCommentService.createComment(
      id,
      userId,
      content,
      parentId
    );
    
    res.status(201).json(comment);
  } catch (error) {
    console.error(`Error adding comment to post ${req.params.id}:`, error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('does not belong to this post') || 
          error.message.includes('levels allowed')) {
        return res.status(400).json({ message: error.message });
      }
    }
    
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

/**
 * Get comments for a post
 * GET /api/blog/posts/:id/comments
 */
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Post ID
    
    const comments = await blogCommentService.getPostComments(id);
    
    res.status(200).json(comments);
  } catch (error) {
    console.error(`Error fetching comments for post ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

/**
 * Delete a comment
 * DELETE /api/blog/comments/:id
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Comment ID
    const userId = (req as any).user.id;
    
    await blogCommentService.deleteComment(id, userId);
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(`Error deleting comment ${req.params.id}:`, error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      if (error.message.includes('own comments')) {
        return res.status(403).json({ message: error.message });
      }
    }
    
    res.status(500).json({ message: 'Failed to delete comment' });
  }
}; 
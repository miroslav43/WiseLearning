import { Role } from '@prisma/client';
import { Router } from 'express';
import * as blogController from '../controllers/blog';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Get all published blog posts
router.get('/posts', blogController.getAllPublishedPosts);

// Get a specific blog post
router.get('/posts/:id', blogController.getPostById);

// Create a blog post (teacher or admin only)
router.post('/posts', authenticate, authorize(Role.teacher, Role.admin), blogController.createPost);

// Update a blog post
router.put('/posts/:id', authenticate, blogController.updatePost);

// Delete a blog post
router.delete('/posts/:id', authenticate, blogController.deletePost);

// Get all categories
router.get('/categories', blogController.getAllCategories);

// Get all tags
router.get('/tags', blogController.getAllTags);

// Add a comment to a post
router.post('/posts/:id/comments', authenticate, blogController.addComment);

// Get comments for a post
router.get('/posts/:id/comments', blogController.getPostComments);

// Delete a comment
router.delete('/comments/:id', authenticate, blogController.deleteComment);

export default router; 
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getPostComments = exports.addComment = exports.getAllTags = exports.getAllCategories = exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPublishedPosts = void 0;
const blogCommentService = __importStar(require("./blogCommentService"));
const blogPostService = __importStar(require("./blogPostService"));
const blogTaxonomyService = __importStar(require("./blogTaxonomyService"));
/**
 * Get all published blog posts
 * GET /api/blog/posts
 */
const getAllPublishedPosts = async (req, res) => {
    try {
        const { page = '1', limit = '10', categoryId, tagId, search } = req.query;
        const result = await blogPostService.getAllPublishedPosts(parseInt(page), parseInt(limit), categoryId, tagId, search);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
};
exports.getAllPublishedPosts = getAllPublishedPosts;
/**
 * Get a specific blog post
 * GET /api/blog/posts/:id
 */
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await blogPostService.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(`Error fetching blog post ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch blog post' });
    }
};
exports.getPostById = getPostById;
/**
 * Create a blog post
 * POST /api/blog/posts
 */
const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, excerpt, content, image, published, readTime, categoryIds, tagIds } = req.body;
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
    }
    catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
};
exports.createPost = createPost;
/**
 * Update a blog post
 * PUT /api/blog/posts/:id
 */
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, excerpt, content, image, published, readTime, categoryIds, tagIds } = req.body;
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
    }
    catch (error) {
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
exports.updatePost = updatePost;
/**
 * Delete a blog post
 * DELETE /api/blog/posts/:id
 */
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await blogPostService.deletePost(id, userId);
        res.status(200).json({ message: 'Blog post deleted successfully' });
    }
    catch (error) {
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
exports.deletePost = deletePost;
/**
 * Get all categories
 * GET /api/blog/categories
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await blogTaxonomyService.getAllCategories();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};
exports.getAllCategories = getAllCategories;
/**
 * Get all tags
 * GET /api/blog/tags
 */
const getAllTags = async (req, res) => {
    try {
        const tags = await blogTaxonomyService.getAllTags();
        res.status(200).json(tags);
    }
    catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Failed to fetch tags' });
    }
};
exports.getAllTags = getAllTags;
/**
 * Add a comment to a post
 * POST /api/blog/posts/:id/comments
 */
const addComment = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const userId = req.user.id;
        const { content, parentId } = req.body;
        // Validate content
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content is required' });
        }
        const comment = await blogCommentService.createComment(id, userId, content, parentId);
        res.status(201).json(comment);
    }
    catch (error) {
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
exports.addComment = addComment;
/**
 * Get comments for a post
 * GET /api/blog/posts/:id/comments
 */
const getPostComments = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const comments = await blogCommentService.getPostComments(id);
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(`Error fetching comments for post ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};
exports.getPostComments = getPostComments;
/**
 * Delete a comment
 * DELETE /api/blog/comments/:id
 */
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; // Comment ID
        const userId = req.user.id;
        await blogCommentService.deleteComment(id, userId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
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
exports.deleteComment = deleteComment;

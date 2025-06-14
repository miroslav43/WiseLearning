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
const client_1 = require("@prisma/client");
const express_1 = require("express");
const blogController = __importStar(require("../controllers/blog"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all published blog posts
router.get('/posts', blogController.getAllPublishedPosts);
// Get a specific blog post
router.get('/posts/:id', blogController.getPostById);
// Create a blog post (teacher or admin only)
router.post('/posts', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), blogController.createPost);
// Update a blog post
router.put('/posts/:id', authMiddleware_1.authenticate, blogController.updatePost);
// Delete a blog post
router.delete('/posts/:id', authMiddleware_1.authenticate, blogController.deletePost);
// Get all categories
router.get('/categories', blogController.getAllCategories);
// Get all tags
router.get('/tags', blogController.getAllTags);
// Add a comment to a post
router.post('/posts/:id/comments', authMiddleware_1.authenticate, blogController.addComment);
// Get comments for a post
router.get('/posts/:id/comments', blogController.getPostComments);
// Delete a comment
router.delete('/comments/:id', authMiddleware_1.authenticate, blogController.deleteComment);
exports.default = router;

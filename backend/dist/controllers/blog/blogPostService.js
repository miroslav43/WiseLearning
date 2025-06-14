"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getAllPublishedPosts = void 0;
const index_1 = require("../../index");
/**
 * Get all published blog posts with filtering options
 */
const getAllPublishedPosts = async (page = 1, limit = 10, categoryId, tagId, search) => {
    // Build the query filters
    const where = { published: true };
    // Add category filter if provided
    if (categoryId) {
        where.categories = {
            some: {
                categoryId
            }
        };
    }
    // Add tag filter if provided
    if (tagId) {
        where.tags = {
            some: {
                tagId
            }
        };
    }
    // Add search filter if provided
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
        ];
    }
    // Calculate pagination
    const skip = (page - 1) * limit;
    // Execute the query
    const [posts, totalCount] = await Promise.all([
        index_1.prisma.blogPost.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                categories: {
                    include: {
                        category: true
                    }
                },
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
            orderBy: {
                publishedAt: 'desc'
            },
            skip,
            take: limit
        }),
        index_1.prisma.blogPost.count({ where })
    ]);
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    return {
        posts,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages
        }
    };
};
exports.getAllPublishedPosts = getAllPublishedPosts;
/**
 * Get a specific blog post by ID
 */
const getPostById = async (id) => {
    const post = await index_1.prisma.blogPost.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    bio: true
                }
            },
            categories: {
                include: {
                    category: true
                }
            },
            tags: {
                include: {
                    tag: true
                }
            },
            comments: {
                where: {
                    parentId: null
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
    if (!post) {
        return null;
    }
    // Increment view count in a separate query (not awaited to not block response)
    // In a real app, this would be handled by an analytics service
    return post;
};
exports.getPostById = getPostById;
/**
 * Create a new blog post
 */
const createPost = async (authorId, postData) => {
    const { title, excerpt, content, image, published, readTime, categoryIds, tagIds } = postData;
    // Calculate read time if not provided (estimate based on word count)
    const calculatedReadTime = readTime || Math.ceil(content.split(/\s+/).length / 200); // ~200 words per minute
    const publishStatus = published || false;
    const publishedAt = publishStatus ? new Date() : null;
    // Prepare category connections if provided
    const categoryConnections = categoryIds?.length
        ? {
            create: categoryIds.map(categoryId => ({
                category: {
                    connect: { id: categoryId }
                }
            }))
        }
        : undefined;
    // Prepare tag connections if provided
    const tagConnections = tagIds?.length
        ? {
            create: tagIds.map(tagId => ({
                tag: {
                    connect: { id: tagId }
                }
            }))
        }
        : undefined;
    return index_1.prisma.blogPost.create({
        data: {
            title,
            excerpt,
            content,
            image,
            published: publishStatus,
            publishedAt,
            readTime: calculatedReadTime,
            author: {
                connect: { id: authorId }
            },
            categories: categoryConnections,
            tags: tagConnections
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            categories: {
                include: {
                    category: true
                }
            },
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
};
exports.createPost = createPost;
/**
 * Update a blog post
 */
const updatePost = async (id, authorId, postData) => {
    const { title, excerpt, content, image, published, readTime, categoryIds, tagIds } = postData;
    // Get the current post to check ownership and to retain values if not changed
    const currentPost = await index_1.prisma.blogPost.findUnique({
        where: { id },
        include: {
            categories: true,
            tags: true
        }
    });
    if (!currentPost) {
        throw new Error('Blog post not found');
    }
    // Check if the user is the author
    if (currentPost.authorId !== authorId) {
        throw new Error('You can only update your own blog posts');
    }
    // Handle publication status change
    let publishedAt = currentPost.publishedAt;
    if (published === true && !currentPost.published) {
        publishedAt = new Date();
    }
    // Create a transaction to update the post and its relations
    return index_1.prisma.$transaction(async (tx) => {
        // Update categories if provided
        if (categoryIds !== undefined) {
            // Delete existing categories
            await tx.postCategory.deleteMany({
                where: { postId: id }
            });
            // Add new categories
            if (categoryIds.length > 0) {
                await Promise.all(categoryIds.map(categoryId => tx.postCategory.create({
                    data: {
                        postId: id,
                        categoryId
                    }
                })));
            }
        }
        // Update tags if provided
        if (tagIds !== undefined) {
            // Delete existing tags
            await tx.postTag.deleteMany({
                where: { postId: id }
            });
            // Add new tags
            if (tagIds.length > 0) {
                await Promise.all(tagIds.map(tagId => tx.postTag.create({
                    data: {
                        postId: id,
                        tagId
                    }
                })));
            }
        }
        // Calculate read time if content is updated but readTime is not provided
        let finalReadTime = readTime;
        if (content && readTime === undefined) {
            finalReadTime = Math.ceil(content.split(/\s+/).length / 200);
        }
        // Update the post
        return tx.blogPost.update({
            where: { id },
            data: {
                title,
                excerpt,
                content,
                image,
                published,
                publishedAt,
                readTime: finalReadTime,
                updatedAt: new Date()
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                categories: {
                    include: {
                        category: true
                    }
                },
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
    });
};
exports.updatePost = updatePost;
/**
 * Delete a blog post
 */
const deletePost = async (id, userId) => {
    // Get the current post to check ownership
    const post = await index_1.prisma.blogPost.findUnique({
        where: { id }
    });
    if (!post) {
        throw new Error('Blog post not found');
    }
    // Check if the user is the author
    if (post.authorId !== userId) {
        throw new Error('You can only delete your own blog posts');
    }
    // Create a transaction to delete the post and its relations
    return index_1.prisma.$transaction(async (tx) => {
        // Delete categories
        await tx.postCategory.deleteMany({
            where: { postId: id }
        });
        // Delete tags
        await tx.postTag.deleteMany({
            where: { postId: id }
        });
        // Delete comments
        await tx.blogComment.deleteMany({
            where: { postId: id }
        });
        // Delete the post
        return tx.blogPost.delete({
            where: { id }
        });
    });
};
exports.deletePost = deletePost;

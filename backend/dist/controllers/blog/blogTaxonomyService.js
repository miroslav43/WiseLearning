"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.updateTag = exports.createTag = exports.getTagBySlug = exports.getTagById = exports.getAllTags = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getAllCategories = void 0;
const index_1 = require("../../index");
/**
 * Get all blog categories
 */
const getAllCategories = async () => {
    return index_1.prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
};
exports.getAllCategories = getAllCategories;
/**
 * Get a category by ID
 */
const getCategoryById = async (id) => {
    return index_1.prisma.category.findUnique({
        where: { id }
    });
};
exports.getCategoryById = getCategoryById;
/**
 * Get a category by slug
 */
const getCategoryBySlug = async (slug) => {
    return index_1.prisma.category.findUnique({
        where: { slug }
    });
};
exports.getCategoryBySlug = getCategoryBySlug;
/**
 * Create a new category
 */
const createCategory = async (name, slug, description) => {
    // Check if category with name or slug already exists
    const existingCategory = await index_1.prisma.category.findFirst({
        where: {
            OR: [
                { name },
                { slug }
            ]
        }
    });
    if (existingCategory) {
        throw new Error('A category with this name or slug already exists');
    }
    return index_1.prisma.category.create({
        data: {
            name,
            slug,
            description
        }
    });
};
exports.createCategory = createCategory;
/**
 * Update a category
 */
const updateCategory = async (id, data) => {
    // Check if category exists
    const existingCategory = await index_1.prisma.category.findUnique({
        where: { id }
    });
    if (!existingCategory) {
        throw new Error('Category not found');
    }
    // Check if updating to a name or slug that already exists
    if (data.name || data.slug) {
        const duplicateCheck = await index_1.prisma.category.findFirst({
            where: {
                id: { not: id },
                OR: [
                    data.name ? { name: data.name } : {},
                    data.slug ? { slug: data.slug } : {}
                ]
            }
        });
        if (duplicateCheck) {
            throw new Error('A category with this name or slug already exists');
        }
    }
    return index_1.prisma.category.update({
        where: { id },
        data
    });
};
exports.updateCategory = updateCategory;
/**
 * Delete a category
 */
const deleteCategory = async (id) => {
    // Check if category exists
    const existingCategory = await index_1.prisma.category.findUnique({
        where: { id }
    });
    if (!existingCategory) {
        throw new Error('Category not found');
    }
    // Check if category has associated posts
    const postsCount = await index_1.prisma.postCategory.count({
        where: { categoryId: id }
    });
    if (postsCount > 0) {
        throw new Error(`Cannot delete category that has ${postsCount} posts associated with it`);
    }
    return index_1.prisma.category.delete({
        where: { id }
    });
};
exports.deleteCategory = deleteCategory;
/**
 * Get all blog tags
 */
const getAllTags = async () => {
    return index_1.prisma.tag.findMany({
        orderBy: {
            name: 'asc'
        }
    });
};
exports.getAllTags = getAllTags;
/**
 * Get a tag by ID
 */
const getTagById = async (id) => {
    return index_1.prisma.tag.findUnique({
        where: { id }
    });
};
exports.getTagById = getTagById;
/**
 * Get a tag by slug
 */
const getTagBySlug = async (slug) => {
    return index_1.prisma.tag.findUnique({
        where: { slug }
    });
};
exports.getTagBySlug = getTagBySlug;
/**
 * Create a new tag
 */
const createTag = async (name, slug) => {
    // Check if tag with name or slug already exists
    const existingTag = await index_1.prisma.tag.findFirst({
        where: {
            OR: [
                { name },
                { slug }
            ]
        }
    });
    if (existingTag) {
        throw new Error('A tag with this name or slug already exists');
    }
    return index_1.prisma.tag.create({
        data: {
            name,
            slug
        }
    });
};
exports.createTag = createTag;
/**
 * Update a tag
 */
const updateTag = async (id, data) => {
    // Check if tag exists
    const existingTag = await index_1.prisma.tag.findUnique({
        where: { id }
    });
    if (!existingTag) {
        throw new Error('Tag not found');
    }
    // Check if updating to a name or slug that already exists
    if (data.name || data.slug) {
        const duplicateCheck = await index_1.prisma.tag.findFirst({
            where: {
                id: { not: id },
                OR: [
                    data.name ? { name: data.name } : {},
                    data.slug ? { slug: data.slug } : {}
                ]
            }
        });
        if (duplicateCheck) {
            throw new Error('A tag with this name or slug already exists');
        }
    }
    return index_1.prisma.tag.update({
        where: { id },
        data
    });
};
exports.updateTag = updateTag;
/**
 * Delete a tag
 */
const deleteTag = async (id) => {
    // Check if tag exists
    const existingTag = await index_1.prisma.tag.findUnique({
        where: { id }
    });
    if (!existingTag) {
        throw new Error('Tag not found');
    }
    // Check if tag has associated posts
    const postsCount = await index_1.prisma.postTag.count({
        where: { tagId: id }
    });
    if (postsCount > 0) {
        throw new Error(`Cannot delete tag that has ${postsCount} posts associated with it`);
    }
    return index_1.prisma.tag.delete({
        where: { id }
    });
};
exports.deleteTag = deleteTag;

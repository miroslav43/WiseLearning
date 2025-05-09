import { prisma } from '../../index';

/**
 * Get all blog categories
 */
export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

/**
 * Get a category by ID
 */
export const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id }
  });
};

/**
 * Get a category by slug
 */
export const getCategoryBySlug = async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug }
  });
};

/**
 * Create a new category
 */
export const createCategory = async (name: string, slug: string, description?: string) => {
  // Check if category with name or slug already exists
  const existingCategory = await prisma.category.findFirst({
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
  
  return prisma.category.create({
    data: {
      name,
      slug,
      description
    }
  });
};

/**
 * Update a category
 */
export const updateCategory = async (
  id: string, 
  data: { name?: string; slug?: string; description?: string }
) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });
  
  if (!existingCategory) {
    throw new Error('Category not found');
  }
  
  // Check if updating to a name or slug that already exists
  if (data.name || data.slug) {
    const duplicateCheck = await prisma.category.findFirst({
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
  
  return prisma.category.update({
    where: { id },
    data
  });
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });
  
  if (!existingCategory) {
    throw new Error('Category not found');
  }
  
  // Check if category has associated posts
  const postsCount = await prisma.postCategory.count({
    where: { categoryId: id }
  });
  
  if (postsCount > 0) {
    throw new Error(`Cannot delete category that has ${postsCount} posts associated with it`);
  }
  
  return prisma.category.delete({
    where: { id }
  });
};

/**
 * Get all blog tags
 */
export const getAllTags = async () => {
  return prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

/**
 * Get a tag by ID
 */
export const getTagById = async (id: string) => {
  return prisma.tag.findUnique({
    where: { id }
  });
};

/**
 * Get a tag by slug
 */
export const getTagBySlug = async (slug: string) => {
  return prisma.tag.findUnique({
    where: { slug }
  });
};

/**
 * Create a new tag
 */
export const createTag = async (name: string, slug: string) => {
  // Check if tag with name or slug already exists
  const existingTag = await prisma.tag.findFirst({
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
  
  return prisma.tag.create({
    data: {
      name,
      slug
    }
  });
};

/**
 * Update a tag
 */
export const updateTag = async (id: string, data: { name?: string; slug?: string }) => {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id }
  });
  
  if (!existingTag) {
    throw new Error('Tag not found');
  }
  
  // Check if updating to a name or slug that already exists
  if (data.name || data.slug) {
    const duplicateCheck = await prisma.tag.findFirst({
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
  
  return prisma.tag.update({
    where: { id },
    data
  });
};

/**
 * Delete a tag
 */
export const deleteTag = async (id: string) => {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id }
  });
  
  if (!existingTag) {
    throw new Error('Tag not found');
  }
  
  // Check if tag has associated posts
  const postsCount = await prisma.postTag.count({
    where: { tagId: id }
  });
  
  if (postsCount > 0) {
    throw new Error(`Cannot delete tag that has ${postsCount} posts associated with it`);
  }
  
  return prisma.tag.delete({
    where: { id }
  });
}; 
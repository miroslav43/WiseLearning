import { prisma } from '../../index';

/**
 * Get comments for a specific blog post
 */
export const getPostComments = async (postId: string) => {
  // Get only top-level comments (no parent)
  return prisma.blogComment.findMany({
    where: {
      postId,
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
  });
};

/**
 * Create a new comment on a blog post
 */
export const createComment = async (
  postId: string,
  userId: string,
  content: string,
  parentId?: string
) => {
  // Check if blog post exists
  const post = await prisma.blogPost.findUnique({
    where: { id: postId }
  });
  
  if (!post) {
    throw new Error('Blog post not found');
  }
  
  // If this is a reply, check if parent comment exists
  if (parentId) {
    const parentComment = await prisma.blogComment.findUnique({
      where: { id: parentId }
    });
    
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    
    // Ensure parent comment belongs to the same post
    if (parentComment.postId !== postId) {
      throw new Error('Parent comment does not belong to this post');
    }
    
    // Ensure we're not creating a reply to a reply (only 2 levels allowed)
    if (parentComment.parentId) {
      throw new Error('Cannot reply to a reply (only 2 levels allowed)');
    }
  }
  
  // Create the comment
  const comment = await prisma.blogComment.create({
    data: {
      postId,
      userId,
      content,
      parentId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
  
  // Notify the post author if the comment is not from the author
  if (post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        title: 'New Comment',
        message: parentId 
          ? 'Someone replied to a comment on your blog post' 
          : 'Someone commented on your blog post',
        type: 'info',
        link: `/blog/posts/${postId}#comment-${comment.id}`
      }
    });
  }
  
  // If this is a reply, also notify the parent comment author
  if (parentId && userId !== post.authorId) {
    const parentComment = await prisma.blogComment.findUnique({
      where: { id: parentId },
      select: { userId: true }
    });
    
    if (parentComment && parentComment.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: parentComment.userId,
          title: 'New Reply',
          message: 'Someone replied to your comment',
          type: 'info',
          link: `/blog/posts/${postId}#comment-${comment.id}`
        }
      });
    }
  }
  
  return comment;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string, userId: string) => {
  // Check if comment exists
  const comment = await prisma.blogComment.findUnique({
    where: { id: commentId },
    include: {
      replies: true
    }
  });
  
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  // Check if the post exists and get the author
  const post = await prisma.blogPost.findUnique({
    where: { id: comment.postId },
    select: { authorId: true }
  });
  
  // Check if user is the comment author or the post author
  const isCommentAuthor = comment.userId === userId;
  const isPostAuthor = post && post.authorId === userId;
  
  if (!isCommentAuthor && !isPostAuthor) {
    throw new Error('You can only delete your own comments or comments on your posts');
  }
  
  // If the comment has replies, soft delete by replacing content
  if (comment.replies.length > 0) {
    return prisma.blogComment.update({
      where: { id: commentId },
      data: {
        content: '[Deleted]'
      }
    });
  } else {
    // No replies, hard delete
    return prisma.blogComment.delete({
      where: { id: commentId }
    });
  }
}; 
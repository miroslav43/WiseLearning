
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Calendar, MessageSquare } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
          {post.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="text-xs font-medium bg-brand-600 text-white px-2.5 py-0.5 rounded">
                {post.categories[0]}
              </span>
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-xl line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
          
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <img 
                src={post.authorAvatar} 
                alt={post.author} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{post.author}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{post.comments} comentarii</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogPostCard;

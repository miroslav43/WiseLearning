
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockBlogPosts } from '@/data/mockBlogData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import AdminBlogActions from '@/components/blog/AdminBlogActions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { BlogPost } from '@/types/blog';

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{postId: string}>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundPost = mockBlogPosts.find(p => p.id === postId) || null;
    setPost(foundPost);
    
    if (foundPost) {
      // Find posts in the same category
      const related = mockBlogPosts
        .filter(p => p.id !== postId && p.categories.some(cat => 
          foundPost.categories.includes(cat)
        ))
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [postId]);

  const handleEditPost = (updatedPost: BlogPost) => {
    setPost(updatedPost);
    toast({
      title: "Articol actualizat",
      description: "Articolul a fost actualizat cu succes.",
    });
  };

  const handleDeletePost = () => {
    toast({
      title: "Articol șters",
      description: "Articolul a fost șters cu succes.",
    });
    navigate('/blog');
  };
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Articol negăsit</h1>
        <p className="text-gray-600 mb-8">Articolul pe care îl cauți nu există sau a fost șters.</p>
        <Link to="/blog">
          <Button>Înapoi la blog</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/blog" className="inline-flex items-center text-brand-600 hover:text-brand-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi la blog
        </Link>
      </div>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category, index) => (
              <span key={index} className="text-xs font-medium bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded">
                {category}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            {user?.role === 'admin' && (
              <AdminBlogActions 
                post={post} 
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
              />
            )}
          </div>
          
          <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readTime} min de citit</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{post.comments} comentarii</span>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <img 
              src={post.authorAvatar} 
              alt={post.author} 
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-gray-600 text-sm">Autor</p>
            </div>
          </div>
        </header>
        
        <div className="mb-8">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto rounded-xl mb-8"
          />
          
          <div className="prose prose-lg max-w-none">
            {post.content ? (
              <div className="whitespace-pre-line">{post.content}</div>
            ) : (
              <div>
                <p className="mb-4">
                  {post.excerpt}
                </p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt
                  ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel tincidunt ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                </p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt
                  ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel tincidunt ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                </p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt
                  ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel tincidunt ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                </p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt
                  ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl
                  vel tincidunt ultricies, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
      
      {relatedPosts.length > 0 && (
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Articole similare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map(relatedPost => (
              <BlogPostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;

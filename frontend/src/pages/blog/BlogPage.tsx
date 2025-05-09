
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { mockBlogPosts } from '@/data/mockBlogData';
import BlogPostCard from '@/components/blog/BlogPostCard';
import AdminBlogActions from '@/components/blog/AdminBlogActions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { BlogPost } from '@/types/blog';

const BlogPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.categories.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 4);
  const remainingPosts = blogPosts.slice(4);

  const handleAddPost = () => {
    // In a real app, this would redirect to a form or open a modal
    toast({
      title: "Funcționalitate demo",
      description: "Aceasta este o demonstrație. În aplicația reală, s-ar deschide un formular de creare articol.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blogul BacExamen</h1>
          <p className="text-gray-600 mt-2">
            Sfaturi, noutăți și resurse pentru examenul de Bacalaureat
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Caută articole..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          {user?.role === 'admin' && (
            <AdminBlogActions onAddPost={handleAddPost} />
          )}
        </div>
      </div>
      
      {searchQuery ? (
        // Search results
        <div>
          <h2 className="text-xl font-semibold mb-6">Rezultate pentru "{searchQuery}"</h2>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nu am găsit articole care să corespundă căutării tale.</p>
              <Button variant="link" onClick={() => setSearchQuery('')}>
                Resetează căutarea
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Default blog view
        <>
          {/* Featured post */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-6">Articolul săptămânii</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-xl overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover aspect-video md:aspect-auto"
              />
              <div className="p-8">
                <div className="flex gap-2 mb-3">
                  {featuredPost.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="text-xs font-medium bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded">
                      {category}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-3">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={featuredPost.authorAvatar} 
                      alt={featuredPost.author} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-sm">{featuredPost.author}</p>
                      <p className="text-gray-500 text-xs">{featuredPost.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'admin' && (
                      <AdminBlogActions post={featuredPost} className="mr-2" />
                    )}
                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button>Citește mai mult</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent posts */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold mb-6">Articole recente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          
          {/* All posts */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Toate articolele</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Populare</Button>
                <Button variant="outline" size="sm">Recente</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;

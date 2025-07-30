import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroHeader, Card, Button, Badge } from '../components/ui';
import { ROUTES } from '../constants';

const PublicArticlesPage = () => {
  // Mock data untuk artikel public (bisa dari API nantinya)
  const [articles] = useState([
    {
      id: 1,
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Explore the latest trends and technologies shaping the future of web development, from AI integration to progressive web apps.',
      content: 'Full article content here...',
      author: 'John Doe',
      publishedAt: '2024-01-15',
      category: 'Technology',
      tags: ['Web Development', 'AI', 'Trends'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Building Scalable E-commerce Platforms: Best Practices',
      excerpt: 'Learn the essential strategies and technologies for creating robust, scalable e-commerce solutions that can grow with your business.',
      content: 'Full article content here...',
      author: 'Jane Smith',
      publishedAt: '2024-01-12',
      category: 'E-commerce',
      tags: ['E-commerce', 'Scalability', 'Best Practices'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Digital Marketing Strategies That Actually Work in 2024',
      excerpt: 'Discover proven digital marketing strategies and tactics that deliver real results for businesses of all sizes.',
      content: 'Full article content here...',
      author: 'Mike Johnson',
      publishedAt: '2024-01-10',
      category: 'Marketing',
      tags: ['Digital Marketing', 'Strategy', 'ROI'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Mobile App Development: Native vs Cross-Platform',
      excerpt: 'A comprehensive comparison of native and cross-platform mobile development approaches to help you make the right choice.',
      content: 'Full article content here...',
      author: 'Sarah Wilson',
      publishedAt: '2024-01-08',
      category: 'Mobile Development',
      tags: ['Mobile Development', 'Native', 'Cross-Platform'],
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'UI/UX Design Principles for Better User Experience',
      excerpt: 'Essential UI/UX design principles that will help you create more intuitive and engaging user interfaces.',
      content: 'Full article content here...',
      author: 'Alex Chen',
      publishedAt: '2024-01-05',
      category: 'Design',
      tags: ['UI/UX', 'Design', 'User Experience'],
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&h=400&fit=crop',
      readTime: '4 min read'
    },
    {
      id: 6,
      title: 'Cybersecurity Best Practices for Small Businesses',
      excerpt: 'Protect your business with these essential cybersecurity practices and tools that every small business should implement.',
      content: 'Full article content here...',
      author: 'David Brown',
      publishedAt: '2024-01-03',
      category: 'Security',
      tags: ['Cybersecurity', 'Small Business', 'Best Practices'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      readTime: '6 min read'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Technology', 'E-commerce', 'Marketing', 'Mobile Development', 'Design', 'Security'];

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const handleReadMore = (article) => {
    // Untuk public articles, bisa redirect ke halaman detail artikel
    console.log('Read article:', article);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroHeader
        title="Articles & Insights"
        subtitle="Stay updated with the latest trends and best practices"
        description="Discover valuable insights, tips, and industry knowledge from our team of experts. Learn about the latest technologies and strategies to grow your business."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            Subscribe to Newsletter
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to={ROUTES.CONTACT}>Suggest Topic</Link>
          </Button>
        </div>
      </HeroHeader>

      {/* Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Article Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>By {article.author}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleReadMore(article)}
                >
                  Read More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Stay Updated?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles, tips, and insights
              delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicArticlesPage;

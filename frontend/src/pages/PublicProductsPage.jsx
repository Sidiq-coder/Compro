import React from 'react';
import { Link } from 'react-router-dom';
import { HeroHeader, ProductCard, Button } from '../components/ui';
import { ROUTES } from '../constants';

const PublicProductsPage = () => {
  // Mock data untuk produk public (bisa dari API nantinya)
  const publicProducts = [
    {
      id: 1,
      name: 'Website Development',
      description: 'Professional website development services with modern technologies',
      price: 'Starting from $999',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      category: 'Web Services',
      features: ['Responsive Design', 'SEO Optimized', '24/7 Support']
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native and cross-platform mobile application development',
      price: 'Starting from $1499',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      category: 'Mobile Services',
      features: ['iOS & Android', 'Cross Platform', 'App Store Deployment']
    },
    {
      id: 3,
      name: 'Digital Marketing',
      description: 'Comprehensive digital marketing solutions to grow your business',
      price: 'Starting from $599/month',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      category: 'Marketing Services',
      features: ['SEO/SEM', 'Social Media', 'Content Marketing']
    },
    {
      id: 4,
      name: 'E-commerce Solutions',
      description: 'Complete e-commerce platform development and management',
      price: 'Starting from $1299',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      category: 'E-commerce',
      features: ['Payment Gateway', 'Inventory Management', 'Analytics']
    },
    {
      id: 5,
      name: 'Brand Identity Design',
      description: 'Professional brand identity and logo design services',
      price: 'Starting from $399',
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=300&fit=crop',
      category: 'Design Services',
      features: ['Logo Design', 'Brand Guidelines', 'Marketing Materials']
    },
    {
      id: 6,
      name: 'Consultation Services',
      description: 'Expert business and technology consultation services',
      price: 'Starting from $99/hour',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      category: 'Consultation',
      features: ['Strategy Planning', 'Technology Audit', 'Business Growth']
    }
  ];

  const handleProductClick = (product) => {
    // Untuk public products, bisa redirect ke halaman detail public
    console.log('View product:', product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroHeader
        title="Our Products & Services"
        subtitle="Comprehensive solutions for your business needs"
        description="Discover our range of professional products and services designed to help your business grow and succeed in the digital age."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to={ROUTES.CONTACT}>Contact Us</Link>
          </Button>
        </div>
      </HeroHeader>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose the Right Solution for You
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a wide range of products and services to meet your specific business requirements.
            Each solution is carefully crafted to deliver exceptional results.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicProducts.map((product) => (
            <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleProductClick(product)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project requirements and get a custom quote
              tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto">
                <Link to={ROUTES.CONTACT}>Get Quote</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProductsPage;

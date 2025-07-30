import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, HeroHeader } from '../components/ui';
import { ROUTES } from '../constants';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroHeader
        title="Welcome to Our Company"
        subtitle="Innovation • Excellence • Growth"
        description="We provide innovative solutions and exceptional products to help your business grow and succeed in the digital era."
        primaryButton={{
          text: "Our Products",
          href: "/produk",
          variant: "secondary"
        }}
        secondaryButton={{
          text: "Contact Us",
          href: ROUTES.CONTACT,
          variant: "outline"
        }}
        height="py-48"
        maxWidth="max-w-full"
        backgroundGradient="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
      />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive solutions tailored to meet your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Team',
                description: 'Our experienced professionals deliver high-quality solutions with attention to detail.',
                icon: '👥'
              },
              {
                title: 'Innovation',
                description: 'We stay ahead of the curve with cutting-edge technology and innovative approaches.',
                icon: '💡'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock support to ensure your business operations run smoothly.',
                icon: '🔧'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive product solutions to drive your business forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Enterprise Software',
              'Mobile Applications',
              'Digital Tools',
              'Cloud Solutions',
              'Analytics Platform',
              'Business Intelligence'
            ].map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {product}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Professional {product.toLowerCase()} solutions tailored to your needs.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/produk">
              <Button size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with our innovative solutions.
          </p>
          <Link to={ROUTES.CONTACT}>
            <Button size="lg" variant="secondary">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

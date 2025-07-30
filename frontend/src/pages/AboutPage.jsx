import React from 'react';
import { Link } from 'react-router-dom';
import { HeroHeader, Card, Button } from '../components/ui';
import { ROUTES } from '../constants';

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Visionary leader with 10+ years in tech industry'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=300&h=300&fit=crop&crop=face',
      description: 'Tech expert specializing in scalable solutions'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Creative director with award-winning designs'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      position: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Marketing strategist driving business growth'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly explore new technologies and approaches to deliver cutting-edge solutions.',
      icon: '💡'
    },
    {
      title: 'Quality',
      description: 'We maintain the highest standards in everything we do, ensuring exceptional results.',
      icon: '⭐'
    },
    {
      title: 'Collaboration',
      description: 'We work closely with our clients to understand their needs and exceed expectations.',
      icon: '🤝'
    },
    {
      title: 'Growth',
      description: 'We help businesses grow and succeed in the digital age through strategic solutions.',
      icon: '📈'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroHeader
        title="About Us"
        subtitle="Building the future, one solution at a time"
        description="We are a team of passionate professionals dedicated to helping businesses thrive in the digital world through innovative technology solutions and strategic partnerships."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            <Link to={ROUTES.PRODUCTS}>View Our Work</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to={ROUTES.CONTACT}>Get in Touch</Link>
          </Button>
        </div>
      </HeroHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2020, our company started with a simple mission: to help businesses 
                  leverage technology to achieve their goals. What began as a small team of developers 
                  has grown into a full-service digital agency.
                </p>
                <p>
                  Over the years, we've worked with dozens of clients across various industries, 
                  from startups to enterprise companies. Our experience spans web development, 
                  mobile applications, digital marketing, and business consultation.
                </p>
                <p>
                  Today, we continue to evolve and adapt to the ever-changing digital landscape, 
                  always staying ahead of the curve to provide our clients with the most effective 
                  and innovative solutions.
                </p>
              </div>
            </div>
            <div className="lg:pl-8">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Our team working"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we work with our clients and each other.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our diverse team of experts brings together years of experience and a passion for innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-lg text-gray-600">Numbers that reflect our commitment to excellence</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Work Together?</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Let's discuss how we can help your business grow and succeed in the digital world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                <Link to={ROUTES.CONTACT}>Start a Project</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                <Link to={ROUTES.PRODUCTS}>View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

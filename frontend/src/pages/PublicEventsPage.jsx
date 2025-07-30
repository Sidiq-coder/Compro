import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroHeader, Card, Button, Badge } from '../components/ui';
import { ROUTES } from '../constants';

const PublicEventsPage = () => {
  // Mock data untuk events public (bisa dari API nantinya)
  const [events] = useState([
    {
      id: 1,
      title: 'Web Development Workshop 2024',
      description: 'Learn the latest web development technologies and best practices in this comprehensive workshop.',
      date: '2024-02-15',
      time: '09:00 - 17:00',
      location: 'Tech Hub Jakarta',
      type: 'Workshop',
      status: 'upcoming',
      price: 'Free',
      maxParticipants: 50,
      currentParticipants: 32,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      organizer: 'Tech Community Jakarta',
      tags: ['Web Development', 'JavaScript', 'React']
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      description: 'Master the art of digital marketing with hands-on sessions covering SEO, social media, and paid advertising.',
      date: '2024-02-20',
      time: '10:00 - 16:00',
      location: 'Marketing Center Surabaya',
      type: 'Masterclass',
      status: 'upcoming',
      price: '$99',
      maxParticipants: 30,
      currentParticipants: 25,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      organizer: 'Digital Marketing Guild',
      tags: ['Digital Marketing', 'SEO', 'Social Media']
    },
    {
      id: 3,
      title: 'Mobile App Development Bootcamp',
      description: 'Intensive 3-day bootcamp covering React Native and Flutter for cross-platform mobile development.',
      date: '2024-02-25',
      time: '09:00 - 18:00',
      location: 'Innovation Hub Bandung',
      type: 'Bootcamp',
      status: 'upcoming',
      price: '$299',
      maxParticipants: 40,
      currentParticipants: 15,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      organizer: 'Mobile Dev Community',
      tags: ['Mobile Development', 'React Native', 'Flutter']
    },
    {
      id: 4,
      title: 'UI/UX Design Conference',
      description: 'Annual conference featuring the latest trends in UI/UX design with industry experts and case studies.',
      date: '2024-03-05',
      time: '08:00 - 17:00',
      location: 'Design Center Jakarta',
      type: 'Conference',
      status: 'upcoming',
      price: '$149',
      maxParticipants: 200,
      currentParticipants: 120,
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&h=400&fit=crop',
      organizer: 'Indonesia Design Community',
      tags: ['UI/UX', 'Design', 'User Experience']
    },
    {
      id: 5,
      title: 'Startup Pitch Competition',
      description: 'Present your startup idea to investors and industry experts. Win funding and mentorship opportunities.',
      date: '2024-01-10',
      time: '13:00 - 18:00',
      location: 'Startup Hub Jakarta',
      type: 'Competition',
      status: 'completed',
      price: 'Free',
      maxParticipants: 100,
      currentParticipants: 100,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      organizer: 'Startup Indonesia',
      tags: ['Startup', 'Pitch', 'Competition']
    },
    {
      id: 6,
      title: 'E-commerce Business Summit',
      description: 'Learn from successful e-commerce entrepreneurs and discover strategies to scale your online business.',
      date: '2024-01-05',
      time: '09:00 - 16:00',
      location: 'Business Center Surabaya',
      type: 'Summit',
      status: 'completed',
      price: '$199',
      maxParticipants: 150,
      currentParticipants: 150,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      organizer: 'E-commerce Indonesia',
      tags: ['E-commerce', 'Business', 'Entrepreneurship']
    }
  ]);

  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const eventTypes = ['All', 'Workshop', 'Masterclass', 'Bootcamp', 'Conference', 'Competition', 'Summit'];
  const eventStatuses = ['All', 'upcoming', 'completed'];

  const filteredEvents = events.filter(event => {
    const typeMatch = selectedType === 'All' || event.type === selectedType;
    const statusMatch = selectedStatus === 'All' || event.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const handleRegister = (event) => {
    if (event.status === 'upcoming') {
      console.log('Register for event:', event);
      // Redirect ke halaman registrasi atau buka modal
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroHeader
        title="Events & Workshops"
        subtitle="Join our community events and level up your skills"
        description="Discover upcoming workshops, conferences, and networking events designed to help you grow professionally and connect with like-minded individuals."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            View All Events
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to={ROUTES.CONTACT}>Organize Event</Link>
          </Button>
        </div>
      </HeroHeader>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Events</h2>
          
          {/* Event Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Event Type</h3>
            <div className="flex flex-wrap gap-3">
              {eventTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="rounded-full"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Event Status Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
            <div className="flex flex-wrap gap-3">
              {eventStatuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="rounded-full capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Event Image */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    {event.type}
                  </Badge>
                </div>
              </div>
              
              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">⏰</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">👥</span>
                    <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                  </div>
                </div>
                
                {/* Event Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-green-600">
                    {event.price}
                  </div>
                  {event.status === 'upcoming' ? (
                    <Button
                      size="sm"
                      onClick={() => handleRegister(event)}
                      disabled={event.currentParticipants >= event.maxParticipants}
                    >
                      {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Register'}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Completed
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Organize an Event?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Partner with us to organize workshops, conferences, or community events.
              We provide the platform and support to make your event successful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto">
                <Link to={ROUTES.CONTACT}>Contact Us</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Guidelines
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventsPage;

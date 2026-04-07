import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Building2, Users, Clock, Star, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockJobs, mockCategories } from '../mock';

const Home = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = () => {
    navigate(`/jobs?keyword=${searchKeyword}&location=${searchLocation}`);
  };

  const featuredJobs = mockJobs.filter(job => job.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Find Your <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-4 shadow-lg border-0">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    className="pl-10 h-12 border-gray-200"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="City or state"
                    className="pl-10 h-12 border-gray-200"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Search Jobs
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">5,000+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2,000+</div>
              <div className="text-sm text-gray-600">New Jobs Daily</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
          <p className="text-gray-600">Explore jobs by category</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockCategories.map((category, index) => {
            const IconComponent = {
              Code: Briefcase,
              Palette: Star,
              TrendingUp: TrendingUp,
              ShoppingCart: Briefcase,
              DollarSign: Briefcase,
              Heart: Briefcase,
              BookOpen: Briefcase,
              Factory: Building2
            }[category.icon] || Briefcase;

            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all cursor-pointer border hover:border-blue-300 group"
                onClick={() => navigate(`/jobs?category=${category.name}`)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 p-4 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} jobs</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-600">Hand-picked opportunities from top companies</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/jobs')}
              className="hidden md:block border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All Jobs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-xl transition-all cursor-pointer border hover:border-blue-300 group"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      <div className="flex gap-1 flex-col">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                          Featured
                        </Badge>
                        {job.whatsappNumber && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            WhatsApp
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-blue-600">{job.salary}</span>
                      <span className="text-sm text-gray-500">{job.applicants} applicants</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View All Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take the next step in your career?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of professionals who found their dream job with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8 font-semibold"
            >
              Create Free Account
            </Button>
            <Button
              onClick={() => navigate('/employer')}
              variant="outline"
              className="border-white text-white hover:bg-blue-700 h-12 px-8 font-semibold"
            >
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
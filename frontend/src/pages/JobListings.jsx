import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Building2, Filter, ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { jobsAPI } from '../api';

const JobListings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '');
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['0-2 years', '2-5 years', '5-8 years', '8+ years'];
  const salaryRanges = ['0-5 LPA', '5-10 LPA', '10-20 LPA', '20+ LPA'];

  useEffect(() => {
    fetchJobs();
  }, [searchKeyword, searchLocation, selectedJobTypes]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (searchLocation) params.location = searchLocation;
      if (selectedJobTypes.length > 0) params.job_type = selectedJobTypes[0];
      
      const response = await jobsAPI.getJobs(params);
      setJobs(response.data.jobs);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleJobTypeChange = (type) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Job title, keywords, or company"
                className="pl-10 h-12"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="City or state"
                className="pl-10 h-12"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setSelectedJobTypes([])}>
                  Clear All
                </Button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  Job Type
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={() => handleJobTypeChange(type)}
                      />
                      <Label htmlFor={type} className="text-sm cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  Experience Level
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox id={level} />
                      <Label htmlFor={level} className="text-sm cursor-pointer">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  Salary Range
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {salaryRanges.map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox id={range} />
                      <Label htmlFor={range} className="text-sm cursor-pointer">
                        ₹{range}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `${total} Jobs Found`}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Based on your search criteria
                </p>
              </div>
              <select className="border rounded-lg px-4 py-2 text-sm">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
                <option>Most Relevant</option>
              </select>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <Card
                    key={job.id || job._id}
                    className="p-6 hover:shadow-lg transition-all cursor-pointer border hover:border-blue-300 group"
                    onClick={() => navigate(`/jobs/${job.id || job._id}`)}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={job.company_logo || job.companyLogo}
                        alt={job.company}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 font-medium">{job.company}</p>
                          </div>
                          <div className="flex gap-2">
                            {job.featured && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                Featured
                              </Badge>
                            )}
                            {job.whatsapp_number && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.experience}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Recently posted
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills && job.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-blue-600">{job.salary}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{job.applicants_count || 0} applicants</span>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/jobs/${job.id || job._id}`);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Building2, Users, DollarSign, Share2, Bookmark, ChevronLeft, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { mockJobs } from '../mock';
import { useToast } from '../hooks/use-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <Button onClick={() => navigate('/jobs')} className="bg-blue-600 hover:bg-blue-700">
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Job removed' : 'Job saved',
      description: isSaved ? 'Job removed from saved jobs' : 'Job saved to your profile',
    });
  };

  const handleApply = () => {
    toast({
      title: 'Application submitted',
      description: 'Your application has been sent to the employer',
    });
  };

  const handleWhatsAppApply = () => {
    const message = `Hi, I'm interested in applying for the *${job.title}* position at ${job.company}. I found this opportunity on Jobadda.

*Job Details:*
- Position: ${job.title}
- Location: ${job.location}
- Experience: ${job.experience}

I would like to discuss this opportunity further. Thank you!`;
    
    const whatsappUrl = `https://wa.me/${job.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'Opening WhatsApp',
      description: 'You will be redirected to WhatsApp to complete your application',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/jobs')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-700 font-medium mb-3">{job.company}</p>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Posted {job.postedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  onClick={handleWhatsAppApply}
                  className="bg-green-600 hover:bg-green-700 h-12 px-8 text-base font-semibold"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Apply via WhatsApp
                </Button>
                <Button 
                  onClick={handleApply}
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Apply Directly
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveJob}
                  className={`h-12 px-6 ${isSaved ? 'bg-blue-50 border-blue-600 text-blue-600' : ''}`}
                >
                  <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
                <Button variant="outline" className="h-12 px-6">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>

              <Separator className="my-6" />

              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
              <ul className="space-y-2 mb-6">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-semibold text-gray-900">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Type</p>
                    <p className="font-semibold text-gray-900">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold text-gray-900">{job.experience}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applicants</p>
                    <p className="font-semibold text-gray-900">{job.applicants} candidates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted</p>
                    <p className="font-semibold text-gray-900">{job.postedDate}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <Button
                onClick={handleWhatsAppApply}
                className="w-full bg-green-600 hover:bg-green-700 h-12 font-semibold mb-3"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Apply via WhatsApp
              </Button>
              
              <Button
                onClick={handleApply}
                variant="outline"
                className="w-full h-12 font-semibold border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Apply Directly
              </Button>
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Company</h3>
              <div className="text-center mb-4">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-20 h-20 rounded-lg object-cover mx-auto mb-3"
                />
                <h4 className="font-semibold text-gray-900">{job.company}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Leading technology company focused on innovative solutions and cutting-edge products.
              </p>
              <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                View Company Profile
              </Button>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Quick Apply</h3>
                  <p className="text-sm text-gray-600">Connect instantly via WhatsApp</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-3">
                <p className="mb-1"><strong>Contact:</strong> {job.contactPerson}</p>
                <p className="mb-3"><strong>WhatsApp:</strong> +{job.whatsappNumber}</p>
              </div>
              <Button
                onClick={handleWhatsAppApply}
                className="w-full bg-green-600 hover:bg-green-700 h-10 font-semibold"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
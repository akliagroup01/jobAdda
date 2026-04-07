import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, BookmarkIcon, FileText, User, Settings, Bell, Upload, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { mockApplications, mockSavedJobs, mockJobs, mockUser } from '../mock';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(mockUser);

  const savedJobsList = mockJobs.filter(job => mockSavedJobs.includes(job.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your job applications and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.email}</p>
                <div className="mt-3">
                  <Badge className="bg-green-100 text-green-800">
                    Profile {profile.profileComplete}% Complete
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Briefcase className="h-5 w-5 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'applications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FileText className="h-5 w-5 inline mr-2" />
                  My Applications
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'saved' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <BookmarkIcon className="h-5 w-5 inline mr-2" />
                  Saved Jobs
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <User className="h-5 w-5 inline mr-2" />
                  Profile Settings
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-gray-900">{mockApplications.length}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Saved Jobs</p>
                        <p className="text-3xl font-bold text-gray-900">{mockSavedJobs.length}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <BookmarkIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                        <p className="text-3xl font-bold text-gray-900">127</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Applications */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    <Button variant="ghost" onClick={() => setActiveTab('applications')} className="text-blue-600">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
                        <div>
                          <h4 className="font-semibold text-gray-900">{app.jobTitle}</h4>
                          <p className="text-sm text-gray-600">{app.company}</p>
                          <p className="text-xs text-gray-500 mt-1">Applied on {app.appliedDate}</p>
                        </div>
                        <Badge className={app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">My Applications</h3>
                <div className="space-y-4">
                  {mockApplications.map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{app.jobTitle}</h4>
                          <p className="text-gray-600">{app.company}</p>
                        </div>
                        <Badge className={app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={() => navigate(`/jobs/${app.jobId}`)} className="bg-blue-600 hover:bg-blue-700">
                          View Job
                        </Button>
                        <Button size="sm" variant="outline">
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Saved Jobs Tab */}
            {activeTab === 'saved' && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Saved Jobs</h3>
                <div className="space-y-4">
                  {savedJobsList.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                      <div className="flex items-start gap-4">
                        <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">{job.title}</h4>
                          <p className="text-gray-600">{job.company}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span>{job.type}</span>
                            <span className="font-semibold text-blue-600">{job.salary}</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profile.name} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profile.phone} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={profile.location} className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" value={profile.experience} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" value={profile.skills.join(', ')} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="resume">Resume</Label>
                    <div className="mt-1 flex items-center gap-3">
                      <Input type="file" id="resume" className="flex-1" />
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {profile.resume && (
                      <p className="text-sm text-gray-600 mt-2">Current: {profile.resume}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} placeholder="Tell us about yourself..." className="mt-1" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
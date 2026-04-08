import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [userType, setUserType] = useState('jobseeker');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    companyName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        user_type: userType,
        ...(userType === 'employer' ? { company_name: formData.companyName } : {})
      };

      const user = await signup(signupData);
      
      toast({
        title: 'Account created successfully',
        description: 'Welcome to Jobadda! You can now start applying for jobs.',
      });
      
      // Redirect based on user type
      if (user.user_type === 'employer') {
        navigate('/employer');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.detail || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Jobadda</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Start your journey to find your dream job</p>
        </div>

        <Card className="p-8 shadow-lg">
          <Tabs value={userType} onValueChange={setUserType} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobseeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{userType === 'employer' ? 'Full Name' : 'Full Name'}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {userType === 'employer' && (
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Tech Company Inc."
                    className="pl-10"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Bangalore, Karnataka"
                  className="pl-10"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

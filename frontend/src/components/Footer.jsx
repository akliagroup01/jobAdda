import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Jobadda</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting talented professionals with their dream careers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-400 transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-white font-semibold mb-4">Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/employer" className="hover:text-blue-400 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-blue-400 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-blue-400 transition-colors">
                  Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Jobadda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
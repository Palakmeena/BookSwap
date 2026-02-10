import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Upload, MapPin, Check, User, Mail } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  location: string;
  bio: string;
  allowLocation: boolean;
  avatar: File | null;
  avatarPreview: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    location: '',
    bio: '',
    allowLocation: true,
    avatar: null,
    avatarPreview: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Initialize form with user data
    setFormData({
      name: user.name,
      email: user.email,
      location: user.location,
      bio: user.bio,
      allowLocation: true,
      avatar: null,
      avatarPreview: user.avatar
    });

    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    
    gsap.fromTo(
      contentRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, delay: 0.1 }
    );
  }, [isAuthenticated, user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile
    if (updateProfile) {
      updateProfile({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        bio: formData.bio,
        avatar: formData.avatarPreview
      });
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  if (!user) return null;

  return (
    <div ref={pageRef} className="min-h-screen bg-paper">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-espresso/5">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-espresso hover:text-cranberry transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cranberry" />
            <span className="font-display font-semibold text-espresso">Edit Profile</span>
          </div>

          <div className="w-9 h-9" />
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-espresso mb-2">
              Edit your profile
            </h1>
            <p className="text-taupe">
              Update your information and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-paper">
                    <img
                      src={formData.avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Upload New Photo
                  </button>
                  <p className="text-xs text-taupe mt-2">
                    JPG or PNG, max 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-cranberry" />
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cranberry" />
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cranberry" />
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Brooklyn, NY"
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-espresso mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about your reading interests..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none"
              />
              <p className="text-xs text-taupe mt-1">
                {formData.bio.length} / 200 characters
              </p>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl p-6 border border-espresso/5">
              <h3 className="font-display font-semibold text-espresso mb-4">Preferences</h3>
              
              <div className="space-y-4">
                {/* Allow Location */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex-1">
                    <div className="font-medium text-espresso group-hover:text-cranberry transition-colors">
                      Allow location-based browsing
                    </div>
                    <div className="text-sm text-taupe mt-1">
                      Help others find books near them by sharing your approximate location
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, allowLocation: !prev.allowLocation }))}
                    className={`relative ml-4 w-12 h-6 rounded-full transition-colors ${
                      formData.allowLocation ? 'bg-cranberry' : 'bg-espresso/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.allowLocation ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3.5 border-2 border-espresso/10 rounded-xl text-espresso font-medium hover:border-cranberry/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-3.5"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" />
          
          <div className="relative bg-paper rounded-2xl shadow-paper-lg p-8 text-center max-w-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-espresso mb-2">
              Profile Updated!
            </h3>
            <p className="text-taupe">
              Your changes have been saved successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

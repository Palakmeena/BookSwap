import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  MapPin, 
  Shield, 
  Bell, 
  Eye, 
  MessageSquare, 
  Users, 
  Star, 
  FileText,
  Check,
  ChevronDown,
  Compass,
  Globe,
  Lock,
  UserCheck,
  BellRing,
  Mail,
  Smartphone
} from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsState {
  // Lending Preferences
  maxLendingDuration: number;
  autoApproveRequests: boolean;
  minimumBorrowerRating: number;
  requireVerifiedBorrowers: boolean;
  
  // Privacy Controls
  locationVisibility: 'exact' | 'approximate' | 'hidden';
  profileVisibility: 'public' | 'members' | 'connections';
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  
  // Discovery Settings
  discoveryRadius: number;
  whoCanDiscover: 'everyone' | 'verified' | 'connections';
  whoCanRequest: 'everyone' | 'verified' | 'connections';
  showInNearbyResults: boolean;
  
  // Notification Preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  requestNotifications: boolean;
  messageNotifications: boolean;
  returnReminders: boolean;
  weeklyDigest: boolean;
  
  // Custom Lending Rules
  preApprovalNote: string;
  personalLendingConditions: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SettingsState>({
    // Lending Preferences
    maxLendingDuration: 30,
    autoApproveRequests: false,
    minimumBorrowerRating: 4.0,
    requireVerifiedBorrowers: false,
    
    // Privacy Controls
    locationVisibility: 'approximate',
    profileVisibility: 'public',
    allowDirectMessages: true,
    showOnlineStatus: true,
    
    // Discovery Settings
    discoveryRadius: 5,
    whoCanDiscover: 'everyone',
    whoCanRequest: 'everyone',
    showInNearbyResults: true,
    
    // Notification Preferences
    emailNotifications: true,
    pushNotifications: true,
    requestNotifications: true,
    messageNotifications: true,
    returnReminders: true,
    weeklyDigest: false,
    
    // Custom Lending Rules
    preApprovalNote: '',
    personalLendingConditions: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

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
  }, [isAuthenticated, navigate]);

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (!user) return null;

  const durationOptions = [7, 14, 21, 30, 45, 60, 90];
  const radiusOptions = [1, 2, 5, 10, 15, 25, 50];
  const ratingOptions = [3.0, 3.5, 4.0, 4.5, 5.0];

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
            <span className="font-display font-semibold text-espresso">Settings</span>
          </div>

          <button
            onClick={handleSaveSettings}
            className="btn-primary px-4 py-2 text-sm"
          >
            Save
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-espresso mb-2">
              Settings
            </h1>
            <p className="text-taupe">
              Customize your lending preferences, privacy, and notifications
            </p>
          </div>

          <div className="space-y-4">
            {/* Lending Preferences Section */}
            <div className="bg-white rounded-2xl border border-espresso/5 overflow-hidden">
              <button
                onClick={() => toggleSection('lending')}
                className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cranberry" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso">
                      Lending Preferences
                    </h2>
                    <p className="text-sm text-taupe">Duration, ratings, and approval settings</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-taupe transition-transform ${activeSection === 'lending' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeSection === 'lending' && (
                <div className="px-5 pb-5 space-y-6 border-t border-espresso/5 pt-5">
                  {/* Max Lending Duration */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cranberry" />
                      Maximum Lending Duration
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Set how long borrowers can keep your books
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {durationOptions.map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, maxLendingDuration: days }))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            settings.maxLendingDuration === days
                              ? 'bg-cranberry text-white'
                              : 'bg-cream text-espresso hover:bg-cranberry/10'
                          }`}
                        >
                          {days} days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minimum Borrower Rating */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-cranberry" />
                      Minimum Borrower Rating
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Only accept requests from borrowers with at least this rating
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ratingOptions.map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, minimumBorrowerRating: rating }))}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            settings.minimumBorrowerRating === rating
                              ? 'bg-cranberry text-white'
                              : 'bg-cream text-espresso hover:bg-cranberry/10'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${settings.minimumBorrowerRating === rating ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
                          {rating}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <ToggleOption
                      icon={<UserCheck className="w-4 h-4 text-cranberry" />}
                      label="Auto-approve requests"
                      description="Automatically approve borrow requests that meet your criteria"
                      checked={settings.autoApproveRequests}
                      onChange={(checked) => setSettings(prev => ({ ...prev, autoApproveRequests: checked }))}
                    />
                    <ToggleOption
                      icon={<Shield className="w-4 h-4 text-cranberry" />}
                      label="Require verified borrowers"
                      description="Only accept requests from verified BookSwap members"
                      checked={settings.requireVerifiedBorrowers}
                      onChange={(checked) => setSettings(prev => ({ ...prev, requireVerifiedBorrowers: checked }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Controls Section */}
            <div className="bg-white rounded-2xl border border-espresso/5 overflow-hidden">
              <button
                onClick={() => toggleSection('privacy')}
                className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-cranberry" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso">
                      Privacy Controls
                    </h2>
                    <p className="text-sm text-taupe">Location, visibility, and messaging settings</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-taupe transition-transform ${activeSection === 'privacy' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeSection === 'privacy' && (
                <div className="px-5 pb-5 space-y-6 border-t border-espresso/5 pt-5">
                  {/* Location Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cranberry" />
                      Location Visibility
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Control how your location is shown to other users
                    </p>
                    <div className="space-y-2">
                      <RadioOption
                        label="Show exact location"
                        description="Display your precise neighborhood"
                        checked={settings.locationVisibility === 'exact'}
                        onChange={() => setSettings(prev => ({ ...prev, locationVisibility: 'exact' }))}
                      />
                      <RadioOption
                        label="Show approximate location"
                        description="Display only your general area (recommended)"
                        checked={settings.locationVisibility === 'approximate'}
                        onChange={() => setSettings(prev => ({ ...prev, locationVisibility: 'approximate' }))}
                      />
                      <RadioOption
                        label="Hide location"
                        description="Don't show your location to anyone"
                        checked={settings.locationVisibility === 'hidden'}
                        onChange={() => setSettings(prev => ({ ...prev, locationVisibility: 'hidden' }))}
                      />
                    </div>
                  </div>

                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-cranberry" />
                      Profile Visibility
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Who can view your profile and listed books
                    </p>
                    <div className="space-y-2">
                      <RadioOption
                        label="Public"
                        description="Anyone can view your profile"
                        checked={settings.profileVisibility === 'public'}
                        onChange={() => setSettings(prev => ({ ...prev, profileVisibility: 'public' }))}
                      />
                      <RadioOption
                        label="Members only"
                        description="Only logged-in BookSwap members can view"
                        checked={settings.profileVisibility === 'members'}
                        onChange={() => setSettings(prev => ({ ...prev, profileVisibility: 'members' }))}
                      />
                      <RadioOption
                        label="Connections only"
                        description="Only people you've interacted with can view"
                        checked={settings.profileVisibility === 'connections'}
                        onChange={() => setSettings(prev => ({ ...prev, profileVisibility: 'connections' }))}
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <ToggleOption
                      icon={<MessageSquare className="w-4 h-4 text-cranberry" />}
                      label="Allow direct messages"
                      description="Let other users send you messages directly"
                      checked={settings.allowDirectMessages}
                      onChange={(checked) => setSettings(prev => ({ ...prev, allowDirectMessages: checked }))}
                    />
                    <ToggleOption
                      icon={<Globe className="w-4 h-4 text-cranberry" />}
                      label="Show online status"
                      description="Let others see when you're active on BookSwap"
                      checked={settings.showOnlineStatus}
                      onChange={(checked) => setSettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Discovery Settings Section */}
            <div className="bg-white rounded-2xl border border-espresso/5 overflow-hidden">
              <button
                onClick={() => toggleSection('discovery')}
                className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <Compass className="w-5 h-5 text-cranberry" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso">
                      Discovery Settings
                    </h2>
                    <p className="text-sm text-taupe">Radius, discoverability, and request permissions</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-taupe transition-transform ${activeSection === 'discovery' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeSection === 'discovery' && (
                <div className="px-5 pb-5 space-y-6 border-t border-espresso/5 pt-5">
                  {/* Discovery Radius */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cranberry" />
                      Discovery Radius
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Find books and readers within this distance
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {radiusOptions.map((miles) => (
                        <button
                          key={miles}
                          type="button"
                          onClick={() => setSettings(prev => ({ ...prev, discoveryRadius: miles }))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            settings.discoveryRadius === miles
                              ? 'bg-cranberry text-white'
                              : 'bg-cream text-espresso hover:bg-cranberry/10'
                          }`}
                        >
                          {miles} mi
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Who Can Discover */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-cranberry" />
                      Who can discover your books
                    </label>
                    <div className="space-y-2">
                      <RadioOption
                        label="Everyone"
                        description="All BookSwap users can find your books"
                        checked={settings.whoCanDiscover === 'everyone'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanDiscover: 'everyone' }))}
                      />
                      <RadioOption
                        label="Verified members"
                        description="Only verified users can discover your books"
                        checked={settings.whoCanDiscover === 'verified'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanDiscover: 'verified' }))}
                      />
                      <RadioOption
                        label="Connections only"
                        description="Only people you've swapped with before"
                        checked={settings.whoCanDiscover === 'connections'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanDiscover: 'connections' }))}
                      />
                    </div>
                  </div>

                  {/* Who Can Request */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cranberry" />
                      Who can request your books
                    </label>
                    <div className="space-y-2">
                      <RadioOption
                        label="Everyone"
                        description="Any user can send you borrow requests"
                        checked={settings.whoCanRequest === 'everyone'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanRequest: 'everyone' }))}
                      />
                      <RadioOption
                        label="Verified members"
                        description="Only verified users can request your books"
                        checked={settings.whoCanRequest === 'verified'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanRequest: 'verified' }))}
                      />
                      <RadioOption
                        label="Connections only"
                        description="Only people you've swapped with before"
                        checked={settings.whoCanRequest === 'connections'}
                        onChange={() => setSettings(prev => ({ ...prev, whoCanRequest: 'connections' }))}
                      />
                    </div>
                  </div>

                  <ToggleOption
                    icon={<Compass className="w-4 h-4 text-cranberry" />}
                    label="Show in nearby results"
                    description="Appear in searches when users look for books nearby"
                    checked={settings.showInNearbyResults}
                    onChange={(checked) => setSettings(prev => ({ ...prev, showInNearbyResults: checked }))}
                  />
                </div>
              )}
            </div>

            {/* Notification Preferences Section */}
            <div className="bg-white rounded-2xl border border-espresso/5 overflow-hidden">
              <button
                onClick={() => toggleSection('notifications')}
                className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-cranberry" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-taupe">Email, push, and in-app notification settings</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-taupe transition-transform ${activeSection === 'notifications' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeSection === 'notifications' && (
                <div className="px-5 pb-5 space-y-4 border-t border-espresso/5 pt-5">
                  <ToggleOption
                    icon={<Mail className="w-4 h-4 text-cranberry" />}
                    label="Email notifications"
                    description="Receive updates via email"
                    checked={settings.emailNotifications}
                    onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                  <ToggleOption
                    icon={<Smartphone className="w-4 h-4 text-cranberry" />}
                    label="Push notifications"
                    description="Receive notifications on your device"
                    checked={settings.pushNotifications}
                    onChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                  <ToggleOption
                    icon={<BookOpen className="w-4 h-4 text-cranberry" />}
                    label="Borrow request notifications"
                    description="Get notified when someone requests your book"
                    checked={settings.requestNotifications}
                    onChange={(checked) => setSettings(prev => ({ ...prev, requestNotifications: checked }))}
                  />
                  <ToggleOption
                    icon={<MessageSquare className="w-4 h-4 text-cranberry" />}
                    label="Message notifications"
                    description="Get notified of new messages"
                    checked={settings.messageNotifications}
                    onChange={(checked) => setSettings(prev => ({ ...prev, messageNotifications: checked }))}
                  />
                  <ToggleOption
                    icon={<BellRing className="w-4 h-4 text-cranberry" />}
                    label="Return reminders"
                    description="Remind borrowers when books are due"
                    checked={settings.returnReminders}
                    onChange={(checked) => setSettings(prev => ({ ...prev, returnReminders: checked }))}
                  />
                  <ToggleOption
                    icon={<FileText className="w-4 h-4 text-cranberry" />}
                    label="Weekly digest"
                    description="Receive a weekly summary of activity"
                    checked={settings.weeklyDigest}
                    onChange={(checked) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                  />
                </div>
              )}
            </div>

            {/* Custom Lending Rules Section */}
            <div className="bg-white rounded-2xl border border-espresso/5 overflow-hidden">
              <button
                onClick={() => toggleSection('rules')}
                className="w-full flex items-center justify-between p-5 hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cranberry" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso">
                      Custom Lending Rules
                    </h2>
                    <p className="text-sm text-taupe">Pre-approval notes and personal conditions</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-taupe transition-transform ${activeSection === 'rules' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeSection === 'rules' && (
                <div className="px-5 pb-5 space-y-6 border-t border-espresso/5 pt-5">
                  {/* Pre-approval Note */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cranberry" />
                      Pre-approval Note
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      This message will be shown to borrowers before they submit a request
                    </p>
                    <textarea
                      value={settings.preApprovalNote}
                      onChange={(e) => setSettings(prev => ({ ...prev, preApprovalNote: e.target.value }))}
                      placeholder="e.g., 'Please include a brief message about why you're interested in this book...'"
                      rows={3}
                      className="w-full px-4 py-3 bg-cream/50 rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none text-sm"
                    />
                    <p className="text-xs text-taupe mt-1 text-right">
                      {settings.preApprovalNote.length} / 200 characters
                    </p>
                  </div>

                  {/* Personal Lending Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cranberry" />
                      Personal Lending Conditions
                    </label>
                    <p className="text-xs text-taupe mb-3">
                      Set your own rules that borrowers must agree to (shows on your profile)
                    </p>
                    <textarea
                      value={settings.personalLendingConditions}
                      onChange={(e) => setSettings(prev => ({ ...prev, personalLendingConditions: e.target.value }))}
                      placeholder="e.g., 'Please handle books with care. No smoking around books. Return within the agreed timeframe or communicate if you need an extension...'"
                      rows={4}
                      className="w-full px-4 py-3 bg-cream/50 rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none text-sm"
                    />
                    <p className="text-xs text-taupe mt-1 text-right">
                      {settings.personalLendingConditions.length} / 500 characters
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Profile Link */}
            <div className="bg-white rounded-2xl border border-espresso/5 p-5">
              <button
                onClick={() => navigate('/edit-profile')}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-espresso/5 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-espresso" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-display text-lg font-semibold text-espresso group-hover:text-cranberry transition-colors">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-taupe">Update your name, bio, and profile photo</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-taupe rotate-180 group-hover:text-cranberry transition-colors" />
              </button>
            </div>

            {/* Save Button (Mobile) */}
            <div className="pt-4 lg:hidden">
              <button
                onClick={handleSaveSettings}
                className="w-full btn-primary py-3.5"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-espresso text-paper px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Toggle Option Component
function ToggleOption({ 
  icon, 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  icon: React.ReactNode;
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-2">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="font-medium text-espresso text-sm group-hover:text-cranberry transition-colors">
            {label}
          </div>
          <div className="text-xs text-taupe mt-0.5">
            {description}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative ml-4 w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-cranberry' : 'bg-espresso/20'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

// Radio Option Component
function RadioOption({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors text-left ${
      checked ? 'bg-cranberry/5 border border-cranberry/20' : 'bg-cream/50 hover:bg-cream border border-transparent'
    }`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? 'border-cranberry' : 'border-espresso/30'
      }`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-cranberry" />}
      </div>
      <div className="flex-1">
        <div className={`font-medium text-sm ${checked ? 'text-cranberry' : 'text-espresso'}`}>
          {label}
        </div>
        <div className="text-xs text-taupe mt-0.5">
          {description}
        </div>
      </div>
    </button>
  );
}

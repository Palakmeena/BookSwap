import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Menu, X, User, Inbox, Map } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

interface NavigationProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function Navigation({ onLoginClick, onSignupClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, incomingRequests } = useAuth();

  const pendingRequestsCount = incomingRequests.filter(r => r.status === 'pending').length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    // If not on homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    
    // If already on homepage, scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      onLoginClick?.();
    }
    setIsMobileMenuOpen(false);
  };

  const handleListBookClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      onSignupClick?.();
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-paper/90 backdrop-blur-md shadow-paper py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-6 h-6 text-cranberry" />
            <span className="font-display text-xl font-semibold text-espresso">
              BookSwap
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('browse')}
              className="text-sm font-medium text-espresso/80 hover:text-espresso transition-colors"
            >
              Browse
            </button>
            <button
              onClick={() => navigate('/map')}
              className="text-sm font-medium text-espresso/80 hover:text-espresso transition-colors flex items-center gap-1.5"
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => scrollToSection('community')}
              className="text-sm font-medium text-espresso/80 hover:text-espresso transition-colors"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection('stories')}
              className="text-sm font-medium text-espresso/80 hover:text-espresso transition-colors"
            >
              Stories
            </button>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-full border border-espresso/10">
              <MapPin className="w-3.5 h-3.5 text-cranberry" />
              <span className="text-xs font-medium text-espresso">Brooklyn</span>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/requests')}
                  className="relative p-2 rounded-full hover:bg-espresso/5 transition-colors"
                >
                  <Inbox className="w-5 h-5 text-espresso" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-cranberry text-white text-xs flex items-center justify-center rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown />
                <button
                  onClick={handleListBookClick}
                  className="btn-primary text-sm"
                >
                  List a book
                </button>
                <button
                  onClick={handleProfileClick}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-cranberry hover:scale-105 transition-transform"
                >
                  <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginClick}
                  className="text-sm font-medium text-espresso/80 hover:text-espresso transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onSignupClick}
                  className="btn-primary text-sm"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile actions - notification and menu */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* Mobile Requests Icon */}
                <button
                  onClick={() => navigate('/requests')}
                  className="relative p-2 rounded-full hover:bg-espresso/5 transition-colors"
                  aria-label="View borrow requests"
                >
                  <Inbox className="w-5 h-5 text-espresso" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-cranberry text-white text-xs flex items-center justify-center rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                {/* Mobile Notification Icon */}
                <NotificationDropdown />
              </>
            )}
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-espresso" />
              ) : (
                <Menu className="w-6 h-6 text-espresso" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-paper pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6">
            {isAuthenticated && (
              <div className="flex items-center gap-4 pb-4 border-b border-espresso/10">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-cranberry"
                />
                <div>
                  <p className="font-medium text-espresso">{user?.name}</p>
                  <p className="text-sm text-taupe">{user?.email}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => scrollToSection('browse')}
              className="text-lg font-medium text-espresso text-left"
            >
              Browse
            </button>
            <button
              onClick={() => { navigate('/map'); setIsMobileMenuOpen(false); }}
              className="text-lg font-medium text-espresso text-left flex items-center gap-2"
            >
              <Map className="w-5 h-5" />
              Map
            </button>
            <button
              onClick={() => scrollToSection('community')}
              className="text-lg font-medium text-espresso text-left"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection('stories')}
              className="text-lg font-medium text-espresso text-left"
            >
              Stories
            </button>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { navigate('/requests'); setIsMobileMenuOpen(false); }}
                  className="text-lg font-medium text-espresso text-left flex items-center gap-2"
                >
                  <Inbox className="w-5 h-5" />
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="px-2 py-0.5 bg-cranberry text-white rounded-full text-xs">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleProfileClick}
                  className="text-lg font-medium text-espresso text-left flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-lg font-medium text-cranberry text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 pt-4 border-t border-espresso/10">
                  <MapPin className="w-4 h-4 text-cranberry" />
                  <span className="text-sm text-espresso">Brooklyn</span>
                </div>
                <button 
                  onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }}
                  className="btn-primary w-full"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onSignupClick?.(); setIsMobileMenuOpen(false); }}
                  className="btn-secondary w-full"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

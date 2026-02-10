import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import Hero from '@/sections/Hero';
import HowItWorks from '@/sections/HowItWorks';
import FeaturedBook from '@/sections/FeaturedBook';
import GenreExplorer from '@/sections/GenreExplorer';
import CommunityMap from '@/sections/CommunityMap';
import BorrowRequest from '@/sections/BorrowRequest';
import RecentAdditions from '@/sections/RecentAdditions';
import Testimonials from '@/sections/Testimonials';
import SafetyTrust from '@/sections/SafetyTrust';
import ClosingCTA from '@/sections/ClosingCTA';
import Footer from '@/sections/Footer';
import BookDetail from '@/pages/BookDetail';
import UserProfile from '@/pages/UserProfile';
import ListBook from '@/pages/ListBook';
import EditProfile from '@/pages/EditProfile';
import PublicProfile from '@/pages/PublicProfile';
import Requests from '@/pages/Requests';
import Map from '@/pages/Map';
import Settings from '@/pages/Settings';

gsap.registerPlugin(ScrollTrigger);

// Home page component with all sections
function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  // Handle scroll to section when navigating from other pages
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Small delay to ensure page is rendered and ScrollTrigger is set up
      const timer = setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear the state to prevent scrolling on subsequent renders
        window.history.replaceState({}, document.title);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    // Optimized scroll snap setup - shorter delay for faster loading
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.12, max: 0.28 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <>
      <Navigation onLoginClick={openLogin} onSignupClick={openSignup} />
      
      <main className="relative">
        <Hero />
        <HowItWorks />
        <GenreExplorer />
        <CommunityMap />
        <RecentAdditions />
        <Testimonials />
        <SafetyTrust />
        <ClosingCTA />
      </main>
      
      <Footer />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authMode}
      />
    </>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // Kill existing ScrollTriggers on route change for clean state
    ScrollTrigger.getAll().forEach(st => st.kill());
  }, [location.pathname]);
  
  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="relative bg-paper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/list-book" element={<ListBook />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

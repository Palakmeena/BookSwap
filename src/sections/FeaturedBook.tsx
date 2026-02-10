import { useEffect, useRef, useState } from 'react';
import { Star, MapPin, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredBook } from '@/data/books';
import { useAuth } from '@/contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedBook() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ownerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set will-change for performance
    const elements = [sheetRef.current, coverRef.current, contentRef.current, metaRef.current, ownerRef.current];
    elements.forEach(el => {
      if (el) el.style.willChange = 'transform, opacity';
    });

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      // Sheet entrance
      scrollTl.fromTo(
        sheetRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Book cover entrance
      scrollTl.fromTo(
        coverRef.current,
        { x: -100, rotation: -8, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, ease: 'none' },
        0.06
      );

      // Content entrance
      scrollTl.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Meta chips entrance
      scrollTl.fromTo(
        metaRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.14
      );

      // Owner card entrance
      scrollTl.fromTo(
        ownerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.16
      );

      // Exit animations
      scrollTl.to(
        sheetRef.current,
        { y: -80, opacity: 0.15, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        coverRef.current,
        { x: -50, opacity: 0.15, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        contentRef.current,
        { x: 40, opacity: 0.15, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => {
      elements.forEach(el => {
        if (el) el.style.willChange = 'auto';
      });
      ctx.revert();
    };
  }, []);

  const handleRequest = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(`/book/${featuredBook.id}`);
  };

  return (
    <section
      ref={sectionRef}
      id="browse"
      className="relative w-full h-screen bg-paper overflow-hidden z-30"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Main sheet */}
      <div
        ref={sheetRef}
        className="absolute left-[4vw] lg:left-[6vw] top-[12vh] w-[92vw] lg:w-[88vw] h-[76vh] paper-sheet rounded-2xl overflow-hidden"
      >
        <div className="relative w-full h-full flex flex-col lg:flex-row p-6 lg:p-10 gap-6 lg:gap-10">
          {/* Book cover */}
          <div
            ref={coverRef}
            className="w-full lg:w-auto lg:h-full aspect-[2/3] lg:aspect-auto flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/book/${featuredBook.id}`)}
          >
            <img
              src={featuredBook.cover}
              alt={featuredBook.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full max-h-[50vh] lg:max-h-full object-contain mx-auto lg:mx-0 rounded-lg shadow-paper hover:shadow-paper-lg transition-shadow duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Eyebrow */}
            <span className="mono-label text-cranberry mb-2">
              Featured near you
            </span>

            {/* Title block */}
            <div ref={contentRef}>
              <h2 
                className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-2 cursor-pointer hover:text-cranberry transition-colors"
                onClick={() => navigate(`/book/${featuredBook.id}`)}
              >
                The <span className="text-cranberry">Midnight</span> Library
              </h2>
              <p className="text-lg text-taupe mb-4">{featuredBook.author}</p>
            </div>

            {/* Meta chips */}
            <div
              ref={metaRef}
              className="flex flex-wrap gap-2 mb-4 lg:mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-full text-sm text-espresso border border-espresso/10">
                <BookOpen className="w-3.5 h-3.5 text-cranberry" />
                {featuredBook.genre}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-full text-sm text-espresso border border-espresso/10">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {featuredBook.rating}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper rounded-full text-sm text-espresso border border-espresso/10">
                <MapPin className="w-3.5 h-3.5 text-cranberry" />
                {featuredBook.distance}
              </span>
            </div>

            {/* Description */}
            <p className="text-base text-taupe leading-relaxed mb-6 lg:mb-8 max-w-xl">
              {featuredBook.description}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-auto">
              <button 
                onClick={handleRequest}
                className="btn-primary"
              >
                Request to borrow
              </button>
              <button 
                onClick={() => navigate(`/book/${featuredBook.id}`)}
                className="btn-secondary"
              >
                View details
              </button>
            </div>

            {/* Owner card */}
            <div
              ref={ownerRef}
              className="mt-6 lg:mt-auto flex items-center gap-4 p-4 bg-paper rounded-xl border border-espresso/10"
            >
              <img
                src={featuredBook.owner.avatar}
                alt={featuredBook.owner.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-taupe">Listed by</p>
                <p className="font-medium text-espresso flex items-center gap-1">
                  <User className="w-4 h-4 text-cranberry" />
                  {featuredBook.owner.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />
          <div className="relative bg-paper rounded-2xl shadow-paper-lg p-6 max-w-sm text-center">
            <h3 className="font-display text-xl font-semibold text-espresso mb-2">
              Sign in to request
            </h3>
            <p className="text-taupe mb-4">
              Create an account or sign in to borrow books from your community.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowLoginPrompt(false); navigate('/'); }}
                className="flex-1 btn-secondary"
              >
                Maybe later
              </button>
              <button 
                onClick={() => { setShowLoginPrompt(false); navigate('/'); }}
                className="flex-1 btn-primary"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

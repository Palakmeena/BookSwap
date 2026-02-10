import { useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set will-change for performance
    const elements = [sheetRef.current, imageRef.current, stampRef.current];
    elements.forEach(el => {
      if (el) el.style.willChange = 'transform, opacity';
    });

    const ctx = gsap.context(() => {
      // Initial load animation - subtle and smooth
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      loadTl
        .fromTo(
          sheetRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }
        )
        .fromTo(
          headlineRef.current?.querySelectorAll('.word') || [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.04 },
          '-=0.25'
        )
        .fromTo(
          subheadRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35 },
          '-=0.15'
        )
        .fromTo(
          searchRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35 },
          '-=0.15'
        )
        .fromTo(
          imageRef.current,
          { x: 25, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          '-=0.4'
        )
        .fromTo(
          stampRef.current,
          { scale: 0.85, rotation: -8, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.2)' },
          '-=0.15'
        );

      // Scroll-driven exit animation - optimized
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      // Exit animations - smoother transitions
      scrollTl
        .fromTo(
          sheetRef.current,
          { y: 0, rotation: 0, opacity: 1 },
          { y: -40, rotation: -0.5, opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          headlineRef.current,
          { y: 0, opacity: 1 },
          { y: -20, opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          searchRef.current,
          { y: 0, opacity: 1 },
          { y: -15, opacity: 0.2, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          imageRef.current,
          { x: 0, opacity: 1 },
          { x: 20, opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          stampRef.current,
          { scale: 1, rotation: 0, opacity: 1 },
          { scale: 0.92, rotation: 5, opacity: 0.2, ease: 'power2.in' },
          0.75
        );
    }, sectionRef);

    return () => {
      elements.forEach(el => {
        if (el) el.style.willChange = 'auto';
      });
      ctx.revert();
    };
  }, []);

  const handleSearch = () => {
    navigate('/book/1');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-paper overflow-hidden z-10"
    >
      {/* Paper texture overlay */}
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Main content sheet */}
      <div
        ref={sheetRef}
        className="absolute left-[4vw] lg:left-[6vw] top-[14vh] w-[92vw] lg:w-[88vw] h-[72vh] paper-sheet rounded-2xl overflow-hidden"
      >
        <div className="relative w-full h-full flex flex-col lg:flex-row">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-8 lg:py-0">
            <h1
              ref={headlineRef}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-espresso leading-[1.05] mb-4 lg:mb-6"
            >
              <span className="word inline-block">Share</span>{' '}
              <span className="word inline-block">stories.</span>
              <br />
              <span className="word inline-block">Borrow</span>{' '}
              <span className="word inline-block text-cranberry">joy.</span>
            </h1>

            <p
              ref={subheadRef}
              className="text-base lg:text-lg text-taupe max-w-md mb-6 lg:mb-8"
            >
              List books you own. Discover reads nearby. Borrow without buying.
            </p>

            {/* Search bar */}
            <div
              ref={searchRef}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe" />
                <input
                  type="text"
                  placeholder="Title, author, or ISBN"
                  className="w-full pl-12 pr-4 py-3.5 bg-paper rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Find books
              </button>
            </div>
          </div>

          {/* Right image */}
          <div
            ref={imageRef}
            className="hidden lg:block relative w-[45%] h-full cursor-pointer"
            onClick={() => navigate('/book/1')}
          >
            <img
              src="/hero_reader.jpg"
              alt="Person reading a book"
              loading="eager"
              decoding="sync"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Stamp badge */}
      <div
        ref={stampRef}
        className="absolute left-[8vw] lg:left-[52vw] bottom-[12vh] lg:bottom-[16vh] w-20 h-20 lg:w-24 lg:h-24 stamp shadow-lg"
      >
        <div className="text-center">
          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-1" />
          <span className="text-[10px] lg:text-xs leading-tight block">
            Free to
            <br />
            borrow
          </span>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recentBooks } from '@/data/books';

gsap.registerPlugin(ScrollTrigger);

export default function RecentAdditions() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Use will-change for better performance
    cardsRef.current.forEach((card) => {
      if (card) {
        card.style.willChange = 'transform, opacity';
      }
    });

    const ctx = gsap.context(() => {
      // Title animation - subtle
      gsap.fromTo(
        titleRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation - smoother with shorter duration
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      // Clean up will-change
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.willChange = 'auto';
        }
      });
      ctx.revert();
    };
  }, []);

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-paper py-16 lg:py-24 z-[70]"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      <div className="relative px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 lg:mb-12">
          <h2
            ref={titleRef}
            className="font-display text-3xl lg:text-5xl font-semibold text-espresso"
          >
            Recent <span className="text-cranberry">additions</span>
          </h2>
          <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-cranberry hover:gap-3 transition-all">
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={cardsContainerRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 -mx-6 px-6 lg:-mx-12 lg:px-12 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-cranberry/30 rounded-lg"
          tabIndex={0}
          role="region"
          aria-label="Recent book additions - scroll horizontally to see more"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#a99b8e #F6F1E4',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {recentBooks.map((book, index) => (
            <div
              key={book.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              onClick={() => handleBookClick(book.id)}
              className="flex-shrink-0 w-[180px] sm:w-[200px] lg:w-[240px] group cursor-pointer"
            >
              {/* Book cover */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4 shadow-paper group-hover:shadow-paper-lg transition-shadow duration-200">
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ${book.isAvailable === false ? 'opacity-75' : ''}`}
                />
                {/* Availability badge */}
                {book.isAvailable === false && (
                  <div className="absolute top-2 left-2 bg-espresso/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    Lent Out
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/15 transition-colors duration-200 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-espresso px-4 py-2 rounded-full text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                    View details
                  </span>
                </div>
              </div>

              {/* Book info */}
              <h3 className="font-display text-base lg:text-lg font-semibold text-espresso mb-1 line-clamp-1 group-hover:text-cranberry transition-colors duration-200">
                {book.title}
              </h3>
              <p className="text-sm text-taupe mb-2">{book.author}</p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-espresso">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {book.rating}
                </span>
                <span className="flex items-center gap-1 text-taupe">
                  <MapPin className="w-3.5 h-3.5 text-cranberry" />
                  {book.distance}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all button */}
        <button className="sm:hidden mt-6 flex items-center justify-center gap-2 w-full py-3 border-2 border-espresso/10 rounded-xl text-sm font-medium text-espresso hover:border-cranberry hover:text-cranberry transition-colors">
          View all books
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

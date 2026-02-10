import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { genres } from '@/data/books';
import { recentBooks, featuredBook } from '@/data/books';

gsap.registerPlugin(ScrollTrigger);

export default function GenreExplorer() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showGenreBooks, setShowGenreBooks] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Title entrance
      scrollTl.fromTo(
        titleRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Grid container entrance
      scrollTl.fromTo(
        gridRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Cards entrance with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        scrollTl.fromTo(
          card,
          { y: 30, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.1 + i * 0.03
        );
      });

      // Exit animation
      scrollTl.to(
        titleRef.current,
        { opacity: 0.25, y: -10, ease: 'power2.in' },
        0.75
      );

      scrollTl.to(
        gridRef.current,
        { y: 20, opacity: 0.25, ease: 'power2.in' },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleGenreClick = (genreName: string) => {
    setSelectedGenre(genreName);
    setShowGenreBooks(true);
  };

  const closeGenreBooks = () => {
    setShowGenreBooks(false);
    setTimeout(() => setSelectedGenre(null), 300);
  };

  // Get books for selected genre
  const allBooks = [featuredBook, ...recentBooks];
  const genreBooks = selectedGenre 
    ? allBooks.filter(book => 
        book.genre.toLowerCase().includes(selectedGenre.toLowerCase()) ||
        selectedGenre.toLowerCase().includes(book.genre.toLowerCase())
      )
    : [];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-paper overflow-hidden z-40 py-16 lg:py-20"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      <div className="relative w-full h-full flex flex-col px-6 lg:px-12">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-8 lg:mb-12 text-center"
        >
          Browse by <span className="text-cranberry">genre</span>
        </h2>

        {/* Genre Grid */}
        <div
          ref={gridRef}
          className="w-full max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {genres.map((genre, index) => (
              <div
                key={genre.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                onClick={() => handleGenreClick(genre.name)}
                className="group relative paper-sheet rounded-xl overflow-hidden cursor-pointer 
                  shadow-paper hover:shadow-paper-lg 
                  transform transition-all duration-200 ease-out
                  hover:scale-[1.02] hover:-translate-y-0.5
                  active:scale-[0.99] active:shadow-paper
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cranberry focus-visible:ring-offset-2"
                tabIndex={0}
                role="button"
                aria-label={`Explore ${genre.name} - ${genre.bookCount} books available`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGenreClick(genre.name);
                  }
                }}
              >
                {/* Genre image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                    transition-opacity duration-300 group-hover:from-black/70" />
                  
                  {/* Hover overlay indicator */}
                  <div className="absolute inset-0 bg-cranberry/0 transition-colors duration-300 group-hover:bg-cranberry/10" />
                </div>

                {/* Content */}
                <div className="p-3 lg:p-4 bg-cream/50">
                  <h3 className="font-display text-lg lg:text-xl font-semibold text-espresso mb-1 
                    transition-colors duration-300 group-hover:text-cranberry">
                    {genre.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-taupe mb-2">
                    {genre.bookCount} books
                  </p>
                  <div className="flex items-center gap-1.5 text-xs lg:text-sm font-medium text-cranberry 
                    transition-all duration-300 group-hover:gap-2.5">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Active/pressed state ring */}
                <div className="absolute inset-0 rounded-xl ring-0 ring-cranberry/0 transition-all duration-150 
                  group-active:ring-2 group-active:ring-cranberry/40" />
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <p className="text-center text-taupe mt-8 text-sm lg:text-base">
            Click on any genre to discover available books in your community
          </p>
        </div>
      </div>

      {/* Genre Books Modal */}
      {showGenreBooks && selectedGenre && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={closeGenreBooks}
          />
          
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-paper rounded-2xl shadow-paper-lg overflow-hidden">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-espresso/10 bg-paper">
              <div>
                <h3 className="font-display text-2xl font-semibold text-espresso">
                  {selectedGenre}
                </h3>
                <p className="text-sm text-taupe mt-1">{genreBooks.length} books available</p>
              </div>
              <button
                onClick={closeGenreBooks}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-espresso/10 transition-colors"
              >
                <X className="w-6 h-6 text-espresso" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {genreBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-taupe">No books found in this genre</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genreBooks.map((book) => (
                    <div
                      key={book.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        closeGenreBooks();
                        navigate(`/book/${book.id}`);
                      }}
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-paper group-hover:shadow-paper-lg transition-shadow">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-medium text-espresso text-sm line-clamp-1 group-hover:text-cranberry transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-taupe mt-1">{book.author}</p>
                      <p className="text-xs text-cranberry mt-1">{book.distance}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

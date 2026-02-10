import { useState } from 'react';
import { MapPin, Users, BookOpen, Navigation2, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import NavigationComponent from '@/components/Navigation';
import Footer from '@/sections/Footer';

// Sample nearby users for visual display
const nearbyReaders = [
  { id: 1, name: 'Priya', books: 12, top: '28%', left: '35%' },
  { id: 2, name: 'Jonas', books: 8, top: '45%', left: '62%' },
  { id: 3, name: 'Maya', books: 15, top: '55%', left: '28%' },
  { id: 4, name: 'Alex', books: 6, top: '38%', left: '72%' },
  { id: 5, name: 'Sarah', books: 10, top: '65%', left: '55%' },
  { id: 6, name: 'Raj', books: 9, top: '32%', left: '48%' },
];

export default function Map() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 1.6));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  return (
    <div className="min-h-screen bg-paper">
      <NavigationComponent />
      
      <main className="pt-24 pb-16 px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-4">
            Discover <span className="text-cranberry">Readers</span> Near You
          </h1>
          <p className="text-taupe text-lg max-w-2xl">
            Explore your neighborhood and find fellow book lovers ready to swap. 
            Connect with readers in your area for easy book exchanges.
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative paper-sheet rounded-2xl overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
            {/* Map Background - Stylized illustration */}
            <div 
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Base map layer with streets pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-cream via-paper to-cream">
                {/* Grid streets pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="streets" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#7A6B5F" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#streets)" />
                </svg>

                {/* Decorative blocks representing buildings/parks */}
                <div className="absolute top-[15%] left-[20%] w-24 h-16 bg-taupe/10 rounded-lg"></div>
                <div className="absolute top-[25%] left-[45%] w-32 h-20 bg-taupe/10 rounded-lg"></div>
                <div className="absolute top-[50%] left-[15%] w-20 h-28 bg-taupe/10 rounded-lg"></div>
                <div className="absolute top-[40%] left-[70%] w-28 h-18 bg-taupe/10 rounded-lg"></div>
                <div className="absolute top-[70%] left-[40%] w-36 h-16 bg-taupe/10 rounded-lg"></div>
                <div className="absolute top-[20%] left-[75%] w-16 h-24 bg-taupe/10 rounded-lg"></div>
                
                {/* Park areas */}
                <div className="absolute top-[60%] left-[65%] w-24 h-24 bg-green-200/30 rounded-full"></div>
                <div className="absolute top-[30%] left-[25%] w-16 h-16 bg-green-200/30 rounded-full"></div>

                {/* Main roads */}
                <div className="absolute top-0 left-[50%] w-1 h-full bg-taupe/15"></div>
                <div className="absolute top-[50%] left-0 w-full h-1 bg-taupe/15"></div>
              </div>

              {/* User Pins */}
              {nearbyReaders.map((reader) => (
                <button
                  key={reader.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 group ${
                    selectedUser === reader.id ? 'z-20 scale-110' : 'z-10 hover:scale-105 hover:z-20'
                  }`}
                  style={{ top: reader.top, left: reader.left }}
                  onClick={() => setSelectedUser(selectedUser === reader.id ? null : reader.id)}
                >
                  {/* Pin */}
                  <div className={`relative ${selectedUser === reader.id ? 'animate-bounce' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-colors ${
                      selectedUser === reader.id ? 'bg-cranberry' : 'bg-espresso group-hover:bg-cranberry'
                    }`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    {/* Pin point */}
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-[6px] border-r-[6px] border-t-[8px] 
                      border-l-transparent border-r-transparent transition-colors ${
                      selectedUser === reader.id ? 'border-t-cranberry' : 'border-t-espresso group-hover:border-t-cranberry'
                    }`}></div>
                  </div>

                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    bg-white rounded-lg shadow-paper-lg p-3 min-w-[140px] transition-all duration-200 ${
                    selectedUser === reader.id 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
                  }`}>
                    <p className="font-medium text-espresso text-sm">{reader.name}</p>
                    <p className="text-xs text-taupe flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3" />
                      {reader.books} books available
                    </p>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                  </div>
                </button>
              ))}

              {/* Center marker - Your location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="relative">
                  <div className="w-4 h-4 bg-cranberry rounded-full animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-cranberry rounded-full relative">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
              <button 
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white rounded-lg shadow-paper flex items-center justify-center hover:bg-cream transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5 text-espresso" />
              </button>
              <button 
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white rounded-lg shadow-paper flex items-center justify-center hover:bg-cream transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5 text-espresso" />
              </button>
              <button 
                className="w-10 h-10 bg-white rounded-lg shadow-paper flex items-center justify-center hover:bg-cream transition-colors"
                aria-label="Center on my location"
              >
                <Locate className="w-5 h-5 text-espresso" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-paper p-4 z-30">
              <h3 className="font-medium text-espresso text-sm mb-3">Map Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-taupe">
                  <div className="w-4 h-4 bg-cranberry rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span>Your location</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-taupe">
                  <div className="w-4 h-4 bg-espresso rounded-full flex items-center justify-center">
                    <BookOpen className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>Nearby readers</span>
                </div>
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-paper p-4 z-30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-cranberry" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-espresso">{nearbyReaders.length}</p>
                    <p className="text-xs text-taupe">Readers nearby</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-cranberry/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cranberry" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-espresso">
                      {nearbyReaders.reduce((sum, r) => sum + r.books, 0)}
                    </p>
                    <p className="text-xs text-taupe">Books available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info section below map */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="paper-sheet rounded-xl p-6">
              <div className="w-12 h-12 bg-cranberry/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-cranberry" />
              </div>
              <h3 className="font-display text-xl font-semibold text-espresso mb-2">Find Nearby</h3>
              <p className="text-sm text-taupe">
                Discover readers in your neighborhood with books to share. The closer they are, the easier the swap!
              </p>
            </div>
            
            <div className="paper-sheet rounded-xl p-6">
              <div className="w-12 h-12 bg-cranberry/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-cranberry" />
              </div>
              <h3 className="font-display text-xl font-semibold text-espresso mb-2">Connect & Chat</h3>
              <p className="text-sm text-taupe">
                Send a request to borrow a book. Arrange a convenient meetup spot and time with fellow readers.
              </p>
            </div>
            
            <div className="paper-sheet rounded-xl p-6">
              <div className="w-12 h-12 bg-cranberry/10 rounded-full flex items-center justify-center mb-4">
                <Navigation2 className="w-6 h-6 text-cranberry" />
              </div>
              <h3 className="font-display text-xl font-semibold text-espresso mb-2">Easy Exchange</h3>
              <p className="text-sm text-taupe">
                Meet up at a public place, exchange books, and enjoy your new read. It's that simple!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

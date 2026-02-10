import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, BookOpen, MessageCircle, Calendar, Send, X, Trash2, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { recentBooks, featuredBook } from '@/data/books';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

interface Owner {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  rating: number;
  condition: string;
  available: boolean;
}

// Mock owners for each book
const mockOwners: Record<string, Owner[]> = {
  '1': [
    { id: 'current-user', name: 'Alex Reader', avatar: '/avatar_jonas.jpg', distance: '0 mi', rating: 4.9, condition: 'Like new', available: true },
    { id: 'priya-user', name: 'Priya', avatar: '/avatar_priya.jpg', distance: '0.8 mi', rating: 4.9, condition: 'Like new', available: true },
    { id: 'maya-user', name: 'Maya', avatar: '/avatar_maya.jpg', distance: '1.2 mi', rating: 4.7, condition: 'Very good', available: true },
  ],
  '2': [
    { id: 'current-user', name: 'Alex Reader', avatar: '/avatar_jonas.jpg', distance: '0 mi', rating: 4.9, condition: 'Like new', available: true },
    { id: 'jonas-user', name: 'Jonas', avatar: '/avatar_jonas.jpg', distance: '1.5 mi', rating: 4.8, condition: 'Good', available: true },
  ],
  '3': [
    { id: 'current-user', name: 'Alex Reader', avatar: '/avatar_jonas.jpg', distance: '0 mi', rating: 4.9, condition: 'Very good', available: false },
    { id: 'priya-user', name: 'Priya', avatar: '/avatar_priya.jpg', distance: '0.8 mi', rating: 4.9, condition: 'Like new', available: false },
  ],
  '4': [
    { id: 'ava-user', name: 'Ava', avatar: '/testimonial_ava.jpg', distance: '0.5 mi', rating: 4.6, condition: 'Very good', available: true },
    { id: 'nora-user', name: 'Nora', avatar: '/testimonial_nora.jpg', distance: '2.1 mi', rating: 5.0, condition: 'Like new', available: true },
  ],
  '5': [
    { id: 'ava-user', name: 'Ava', avatar: '/testimonial_ava.jpg', distance: '1.5 mi', rating: 4.6, condition: 'Very good', available: false },
  ],
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, requestBook } = useAuth();
  
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [message, setMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingOwner, setPendingOwner] = useState<Owner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookDeleted, setBookDeleted] = useState(false);

  // Find the book
  const allBooks = [featuredBook, ...recentBooks];
  const book = allBooks.find(b => b.id === id) || featuredBook;
  const owners = mockOwners[id || '1'] || mockOwners['1'];
  
  // Check if current user is an owner of this book
  const isOwner = user && owners.some(owner => owner.id === user.id);

  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    
    gsap.fromTo(
      contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, delay: 0.1 }
    );
  }, []);

  const handleRequest = (owner: Owner) => {
    if (!isAuthenticated) {
      setPendingOwner(owner);
      setShowAuthModal(true);
      return;
    }
    setSelectedOwner(owner);
    setShowRequestModal(true);
  };

  // Handle successful login to continue with request
  useEffect(() => {
    if (isAuthenticated && pendingOwner) {
      setSelectedOwner(pendingOwner);
      setShowRequestModal(true);
      setPendingOwner(null);
    }
  }, [isAuthenticated, pendingOwner]);

  const submitRequest = () => {
    if (selectedOwner) {
      requestBook(book.id, selectedOwner.id, message);
      setRequestSent(true);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSent(false);
        setMessage('');
      }, 2000);
    }
  };

  const handleDeleteBook = () => {
    // In a real app, this would call an API to remove the book listing
    setBookDeleted(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      navigate('/profile');
    }, 1500);
  };

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
            <span className="font-display font-semibold text-espresso">BookSwap</span>
          </div>

          {user && (
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-cranberry"
            >
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left - Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-paper-lg sticky top-24">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right - Book Details */}
            <div className="lg:col-span-2">
              {/* Title & Author */}
              <div className="mb-6">
                <span className="mono-label text-cranberry mb-2 block">{book.genre}</span>
                <h1 className="font-display text-3xl lg:text-4xl font-semibold text-espresso mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-taupe">by {book.author}</p>
              </div>

              {/* Rating & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm border border-espresso/10">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-espresso">{book.rating}</span>
                  <span className="text-taupe">/ 5</span>
                </span>
                <span className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm border border-espresso/10">
                  <BookOpen className="w-4 h-4 text-cranberry" />
                  <span className="text-espresso">{owners.length} owners nearby</span>
                </span>
              </div>

              {/* Description */}
              {book.description && (
                <div className="mb-10">
                  <h3 className="font-display text-lg font-semibold text-espresso mb-3">
                    About this book
                  </h3>
                  <p className="text-taupe leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Owner Management - Only visible to book owner */}
              {isOwner && (
                <div className="mb-10 p-4 bg-cranberry/5 border border-cranberry/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold text-espresso mb-1">
                        Manage your listing
                      </h3>
                      <p className="text-sm text-taupe">You are sharing this book with the community</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove from sharing
                    </button>
                  </div>
                </div>
              )}

              {/* Owners List */}
              <div>
                <h3 className="font-display text-lg font-semibold text-espresso mb-4">
                  Available from
                </h3>
                
                <div className="space-y-4">
                  {owners.map((owner) => {
                    const isCurrentUserListing = user && owner.id === user.id;
                    
                    return (
                    <div
                      key={owner.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-espresso/5 hover:border-cranberry/20 hover:shadow-paper transition-all"
                    >
                      <div 
                        onClick={() => navigate(`/profile/${owner.id}`)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => navigate(`/profile/${owner.id}`)}
                            className="font-medium text-espresso hover:text-cranberry transition-colors"
                          >
                            {owner.name}
                          </button>
                          {isCurrentUserListing && (
                            <span className="text-xs bg-cranberry/10 text-cranberry px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {owner.rating}
                          </span>
                          {!owner.available && (
                            <span className="text-xs bg-espresso/10 text-espresso/70 px-2 py-0.5 rounded-full">
                              Lent Out
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-taupe">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cranberry" />
                            {owner.distance}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-taupe/40" />
                          <span>{owner.condition}</span>
                        </div>
                      </div>

                      {isCurrentUserListing ? (
                        <span className="text-xs text-taupe">Your copy</span>
                      ) : owner.available ? (
                        <button
                          onClick={() => handleRequest(owner)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all btn-primary"
                        >
                          Request
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="block text-xs text-taupe mb-1">Currently Unavailable</span>
                          <span className="text-xs text-espresso/50">Check back later</span>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedOwner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={() => setShowRequestModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-paper rounded-2xl shadow-paper-lg overflow-hidden">
            {requestSent ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-espresso mb-2">
                  Request sent!
                </h3>
                <p className="text-taupe">
                  {selectedOwner.name} will receive your request and respond soon.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-espresso/10">
                  <h3 className="font-display text-lg font-semibold text-espresso">
                    Request from {selectedOwner.name}
                  </h3>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-espresso/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-espresso" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-xl">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-espresso text-sm">{book.title}</p>
                      <p className="text-xs text-taupe">{book.author}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-espresso mb-2">
                      Add a message (optional)
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-taupe" />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Hi ${selectedOwner.name}, I'd love to borrow this book...`}
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-taupe mb-6">
                    <Calendar className="w-4 h-4 text-cranberry" />
                    <span>Suggested pickup: Within 3 days</span>
                  </div>

                  <button
                    onClick={submitRequest}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          setPendingOwner(null);
        }} 
        defaultMode="login"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={() => !bookDeleted && setShowDeleteModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-paper rounded-2xl shadow-paper-lg overflow-hidden">
            {bookDeleted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-espresso mb-2">
                  Book removed
                </h3>
                <p className="text-taupe">
                  Your listing has been removed from BookSwap.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-espresso/10">
                  <h3 className="font-display text-lg font-semibold text-espresso">
                    Remove from sharing?
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-espresso/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-espresso" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium mb-1">This action cannot be undone</p>
                      <p className="text-xs text-amber-700">
                        Removing this book will make it unavailable for other users to discover or request.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-xl border border-espresso/10">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-espresso text-sm">{book.title}</p>
                      <p className="text-xs text-taupe">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 py-3 rounded-lg text-sm font-medium border border-espresso/20 text-espresso hover:bg-espresso/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteBook}
                      className="flex-1 py-3 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove book
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

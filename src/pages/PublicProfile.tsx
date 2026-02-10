import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, MapPin, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';
import { recentBooks, featuredBook, nearbyUsers } from '@/data/books';

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mock user data - in a real app, this would be fetched based on userId
  const profileUser = {
    id: userId || 'priya-user',
    name: userId === 'maya-user' ? 'Maya' : userId === 'jonas-user' ? 'Jonas' : 'Priya',
    email: 'user@example.com',
    avatar: userId === 'maya-user' ? '/avatar_maya.jpg' : userId === 'jonas-user' ? '/avatar_jonas.jpg' : '/avatar_priya.jpg',
    location: 'Brooklyn, NY',
    bio: 'Book lover and avid reader. Always happy to share my collection!',
    booksListed: userId === 'maya-user' ? 15 : userId === 'jonas-user' ? 8 : 12,
    booksBorrowed: 20,
    rating: userId === 'maya-user' ? 4.8 : userId === 'jonas-user' ? 4.7 : 4.9,
    memberSince: '2024-03-15',
  };

  // Get books owned by this user
  const allBooks = [featuredBook, ...recentBooks];
  const userBooks = allBooks.filter(book => 
    book.owner.name.toLowerCase() === profileUser.name.toLowerCase()
  );

  useEffect(() => {
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
  }, []);

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    // In a real app, this would open a message dialog or navigate to messages
    alert('Message feature coming soon!');
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

          {currentUser && (
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-cranberry"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-paper"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-espresso mb-1">
                {profileUser.name}
              </h1>
              <p className="text-taupe mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cranberry" />
                {profileUser.location}
              </p>
              <p className="text-sm text-taupe max-w-md">{profileUser.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm border border-espresso/10">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-espresso">{profileUser.rating}</span>
                  <span className="text-taupe">rating</span>
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-espresso border border-espresso/10">
                  <span className="font-medium">{profileUser.booksListed}</span>{' '}
                  <span className="text-taupe">books listed</span>
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-espresso border border-espresso/10">
                  <span className="font-medium">{profileUser.booksBorrowed}</span>{' '}
                  <span className="text-taupe">books shared</span>
                </span>
              </div>
            </div>

            {isAuthenticated && currentUser?.id !== profileUser.id && (
              <button 
                onClick={handleSendMessage}
                className="flex items-center gap-2 btn-primary px-4 py-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            )}
          </div>

          {/* Books Section */}
          <div>
            <h2 className="font-display text-xl font-semibold text-espresso mb-6">
              Books from {profileUser.name}
            </h2>
            
            {userBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-espresso/5">
                <BookOpen className="w-12 h-12 text-taupe/40 mx-auto mb-4" />
                <p className="text-taupe">No books available from this user</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-paper group-hover:shadow-paper-lg transition-shadow">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-medium text-espresso text-sm line-clamp-1 group-hover:text-cranberry transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-taupe mt-1">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs text-espresso">{book.rating}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-taupe/40" />
                      <span className="text-xs text-cranberry">{book.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

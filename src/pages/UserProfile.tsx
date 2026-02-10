import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, BookCheck, MessageSquare, Settings, LogOut, Star, MapPin, Plus, Check, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';
import { recentBooks, featuredBook } from '@/data/books';

const allBooks = [featuredBook, ...recentBooks];

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, listedBooks, borrowedBooks, messages, sendMessage, markBookReturned } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'borrowed' | 'messages'>('books');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleReturnBook = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (window.confirm('Mark this book as returned?')) {
      markBookReturned(bookId);
    }
  };

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

  if (!user) return null;

  // Get book details for listed/borrowed books
  const myListedBooks = listedBooks.map(listing => ({
    ...listing,
    book: allBooks.find(b => b.id === listing.bookId) || allBooks[0],
  }));

  const myBorrowedBooks = borrowedBooks.map(listing => ({
    ...listing,
    book: allBooks.find(b => b.id === listing.bookId) || allBooks[0],
  }));

  // Group messages by conversation
  const conversations = messages.reduce((acc, msg) => {
    const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    if (!acc[otherId]) acc[otherId] = [];
    acc[otherId].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  const handleSendMessage = () => {
    if (selectedConversation && newMessage.trim()) {
      sendMessage(selectedConversation, newMessage);
      setNewMessage('');
    }
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

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-taupe hover:text-cranberry transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-paper"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-paper flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-espresso mb-1">
                {user.name}
              </h1>
              <p className="text-taupe mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cranberry" />
                {user.location}
              </p>
              <p className="text-sm text-taupe max-w-md">{user.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm border border-espresso/10">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-espresso">{user.rating}</span>
                  <span className="text-taupe">rating</span>
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-espresso border border-espresso/10">
                  <span className="font-medium">{user.booksListed}</span>{' '}
                  <span className="text-taupe">books listed</span>
                </span>
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-espresso border border-espresso/10">
                  <span className="font-medium">{user.booksBorrowed}</span>{' '}
                  <span className="text-taupe">books borrowed</span>
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 border-2 border-espresso/10 rounded-xl text-sm font-medium text-espresso hover:border-cranberry hover:text-cranberry transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-espresso/10">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'books'
                  ? 'border-cranberry text-cranberry'
                  : 'border-transparent text-taupe hover:text-espresso'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              My Books
              <span className="px-2 py-0.5 bg-espresso/10 rounded-full text-xs">
                {myListedBooks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'borrowed'
                  ? 'border-cranberry text-cranberry'
                  : 'border-transparent text-taupe hover:text-espresso'
              }`}
            >
              <BookCheck className="w-4 h-4" />
              Borrowed
              <span className="px-2 py-0.5 bg-espresso/10 rounded-full text-xs">
                {myBorrowedBooks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'messages'
                  ? 'border-cranberry text-cranberry'
                  : 'border-transparent text-taupe hover:text-espresso'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
              <span className="px-2 py-0.5 bg-cranberry/10 text-cranberry rounded-full text-xs">
                {messages.filter(m => !m.read && m.receiverId === user.id).length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* My Books Tab */}
            {activeTab === 'books' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-espresso">
                    Books you're sharing
                  </h2>
                  <button 
                    onClick={() => navigate('/list-book')}
                    className="flex items-center gap-2 btn-primary text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    List a book
                  </button>
                </div>

                {myListedBooks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-espresso/5">
                    <BookOpen className="w-12 h-12 text-taupe/40 mx-auto mb-4" />
                    <p className="text-taupe">No books listed yet</p>
                    <button 
                      onClick={() => navigate('/list-book')}
                      className="mt-4 text-cranberry font-medium hover:underline"
                    >
                      List your first book
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myListedBooks.map((item) => (
                      <div
                        key={item.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/book/${item.bookId}`)}
                      >
                        <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-paper group-hover:shadow-paper-lg transition-shadow">
                          <img
                            src={item.book.cover}
                            alt={item.book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="font-medium text-espresso text-sm line-clamp-1 group-hover:text-cranberry transition-colors">
                          {item.book.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'borrowed'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-taupe">{item.condition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Borrowed Tab */}
            {activeTab === 'borrowed' && (
              <div>
                <h2 className="font-display text-xl font-semibold text-espresso mb-6">
                  Books you've borrowed
                </h2>

                {myBorrowedBooks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-espresso/5">
                    <BookCheck className="w-12 h-12 text-taupe/40 mx-auto mb-4" />
                    <p className="text-taupe">No borrowed books yet</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-4 text-cranberry font-medium hover:underline"
                    >
                      Browse available books
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myBorrowedBooks.map((item) => (
                      <div
                        key={item.id}
                        className="group"
                      >
                        <div 
                          onClick={() => navigate(`/book/${item.bookId}`)}
                          className="aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-paper group-hover:shadow-paper-lg transition-shadow relative cursor-pointer"
                        >
                          <img
                            src={item.book.cover}
                            alt={item.book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2 w-8 h-8 bg-cranberry rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <h3 className="font-medium text-espresso text-sm line-clamp-1 group-hover:text-cranberry transition-colors">
                          {item.book.title}
                        </h3>
                        <p className="text-xs text-taupe mt-1">
                          From {item.book.owner.name}
                        </p>
                        <button
                          onClick={(e) => handleReturnBook(e, item.bookId)}
                          className="mt-2 w-full text-xs px-2 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Mark as Returned
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* Conversations List */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-espresso/5 overflow-hidden">
                  <div className="p-4 border-b border-espresso/10">
                    <h3 className="font-display font-semibold text-espresso">Messages</h3>
                  </div>
                  <div className="overflow-y-auto h-[calc(500px-60px)]">
                    {Object.entries(conversations).length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageSquare className="w-10 h-10 text-taupe/40 mx-auto mb-3" />
                        <p className="text-sm text-taupe">No messages yet</p>
                      </div>
                    ) : (
                      Object.entries(conversations).map(([userId, msgs]) => {
                        const lastMsg = msgs[msgs.length - 1];
                        const unreadCount = msgs.filter(m => !m.read && m.receiverId === user.id).length;
                        
                        return (
                          <button
                            key={userId}
                            onClick={() => setSelectedConversation(userId)}
                            className={`w-full p-4 text-left border-b border-espresso/5 hover:bg-paper transition-colors ${
                              selectedConversation === userId ? 'bg-paper' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src="/avatar_priya.jpg"
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-espresso text-sm">
                                    {userId === 'priya-user' ? 'Priya' : 'Book Owner'}
                                  </span>
                                  {unreadCount > 0 && (
                                    <span className="w-5 h-5 bg-cranberry rounded-full text-white text-xs flex items-center justify-center">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-taupe truncate">
                                  {lastMsg.content}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-espresso/5 overflow-hidden flex flex-col">
                  {selectedConversation ? (
                    <>
                      <div className="p-4 border-b border-espresso/10 flex items-center gap-3">
                        <img
                          src="/avatar_priya.jpg"
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-espresso">
                          {selectedConversation === 'priya-user' ? 'Priya' : 'Book Owner'}
                        </span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {conversations[selectedConversation]?.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.senderId === user.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                msg.senderId === user.id
                                  ? 'bg-cranberry text-white rounded-br-md'
                                  : 'bg-paper text-espresso rounded-bl-md'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-espresso/10">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-paper rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-cranberry text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-taupe/30 mx-auto mb-3" />
                        <p className="text-taupe">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

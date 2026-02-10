import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, X, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';
import { recentBooks, featuredBook } from '@/data/books';

const allBooks = [featuredBook, ...recentBooks];

export default function Requests() {
  const navigate = useNavigate();
  const { user, isAuthenticated, incomingRequests, outgoingRequests, approveRequest, rejectRequest } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    setSelectedRequest(null);
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
    setSelectedRequest(null);
  };

  const getRequestBook = (bookId: string) => {
    return allBooks.find(b => b.id === bookId) || allBooks[0];
  };

  const selectedRequestDetails = selectedRequest 
    ? incomingRequests.find(r => r.id === selectedRequest)
    : null;

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
            <span className="font-display font-semibold text-espresso">Requests</span>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-cranberry"
          >
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div ref={contentRef} className="px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-espresso mb-2">
              Borrow Requests
            </h1>
            <p className="text-taupe">
              Manage your incoming and outgoing book requests
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-espresso/10">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'incoming'
                  ? 'border-cranberry text-cranberry'
                  : 'border-transparent text-taupe hover:text-espresso'
              }`}
            >
              Incoming Requests
              {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="px-2 py-0.5 bg-cranberry text-white rounded-full text-xs">
                  {incomingRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'outgoing'
                  ? 'border-cranberry text-cranberry'
                  : 'border-transparent text-taupe hover:text-espresso'
              }`}
            >
              Outgoing Requests
              <span className="px-2 py-0.5 bg-espresso/10 rounded-full text-xs">
                {outgoingRequests.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Incoming Requests Tab */}
            {activeTab === 'incoming' && (
              <div>
                {incomingRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-espresso/5">
                    <MessageSquare className="w-12 h-12 text-taupe/40 mx-auto mb-4" />
                    <p className="text-taupe">No incoming requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingRequests.map((request) => {
                      const book = getRequestBook(request.bookId);
                      return (
                        <div
                          key={request.id}
                          className="bg-white rounded-xl border border-espresso/5 p-4 hover:border-cranberry/20 hover:shadow-paper transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-16 h-24 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-espresso">{book.title}</h3>
                                  <p className="text-sm text-taupe">{book.author}</p>
                                </div>
                                
                                {request.status === 'pending' ? (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                ) : request.status === 'approved' ? (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                    <CheckCircle className="w-3 h-3" />
                                    Approved
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                                    <XCircle className="w-3 h-3" />
                                    Rejected
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <img
                                  src={request.requesterAvatar}
                                  alt={request.requesterName}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-espresso">{request.requesterName}</span>
                                <span className="text-xs text-taupe">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {request.message && (
                                <p className="text-sm text-taupe mb-3 line-clamp-2">{request.message}</p>
                              )}
                              
                              {request.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(request.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                  >
                                    <Check className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                  >
                                    <X className="w-4 h-4" />
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Outgoing Requests Tab */}
            {activeTab === 'outgoing' && (
              <div>
                {outgoingRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-espresso/5">
                    <MessageSquare className="w-12 h-12 text-taupe/40 mx-auto mb-4" />
                    <p className="text-taupe">No outgoing requests</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-4 text-cranberry font-medium hover:underline"
                    >
                      Browse books to request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {outgoingRequests.map((request) => {
                      const book = getRequestBook(request.bookId);
                      return (
                        <div
                          key={request.id}
                          className="bg-white rounded-xl border border-espresso/5 p-4 hover:border-cranberry/20 hover:shadow-paper transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-16 h-24 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-espresso">{book.title}</h3>
                                  <p className="text-sm text-taupe">{book.author}</p>
                                </div>
                                
                                {request.status === 'pending' ? (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                ) : request.status === 'approved' ? (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                    <CheckCircle className="w-3 h-3" />
                                    Approved
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                                    <XCircle className="w-3 h-3" />
                                    Rejected
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm text-taupe">
                                  Requested from {book.owner.name}
                                </span>
                                <span className="text-xs text-taupe">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {request.message && (
                                <p className="text-sm text-taupe line-clamp-2">{request.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
  booksListed: number;
  booksBorrowed: number;
  rating: number;
  memberSince: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface BookListing {
  id: string;
  bookId: string;
  ownerId: string;
  status: 'available' | 'borrowed' | 'reserved';
  condition: string;
  distance: string;
}

export interface BorrowRequest {
  id: string;
  bookId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  ownerId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'request_received' | 'request_approved' | 'request_rejected' | 'return_reminder' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string; // Book ID or Request ID
  actionUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => void;
  listedBooks: BookListing[];
  borrowedBooks: BookListing[];
  addBookListing: (bookId: string, condition: string) => void;
  requestBook: (bookId: string, ownerId: string, message?: string) => void;
  updateProfile?: (updates: Partial<User>) => void;
  // Request management
  incomingRequests: BorrowRequest[];
  outgoingRequests: BorrowRequest[];
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  // Notifications
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  markBookReturned: (bookId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: 'current-user',
  name: 'Alex Reader',
  email: 'alex@example.com',
  avatar: '/avatar_jonas.jpg',
  location: 'Brooklyn, NY',
  bio: 'Avid reader who loves fiction and mystery novels. Always looking for my next great read!',
  booksListed: 8,
  booksBorrowed: 12,
  rating: 4.9,
  memberSince: '2024-01-15',
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'priya-user',
    receiverId: 'current-user',
    content: 'Hi! I\'d love to borrow The Midnight Library. Are you available to meet this weekend?',
    timestamp: new Date(Date.now() - 86400000),
    read: false,
  },
  {
    id: '2',
    senderId: 'current-user',
    receiverId: 'priya-user',
    content: 'Absolutely! How about Saturday afternoon at the coffee shop on 5th?',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
];

const mockListedBooks: BookListing[] = [
  { id: 'l1', bookId: '3', ownerId: 'current-user', status: 'available', condition: 'Like new', distance: '0.5 mi' },
  { id: 'l2', bookId: '5', ownerId: 'current-user', status: 'borrowed', condition: 'Good', distance: '0.5 mi' },
  { id: 'l3', bookId: '7', ownerId: 'current-user', status: 'available', condition: 'Very good', distance: '0.5 mi' },
];

const mockBorrowedBooks: BookListing[] = [
  { id: 'b1', bookId: '2', ownerId: 'maya-user', status: 'borrowed', condition: 'Like new', distance: '0.8 mi' },
  { id: 'b2', bookId: '4', ownerId: 'jonas-user', status: 'borrowed', condition: 'Good', distance: '1.2 mi' },
];

const mockIncomingRequests: BorrowRequest[] = [
  {
    id: 'req-1',
    bookId: '3',
    requesterId: 'priya-user',
    requesterName: 'Priya',
    requesterAvatar: '/avatar_priya.jpg',
    ownerId: 'current-user',
    message: 'Hi! I saw you have The Silent Sanctuary. I\'d love to borrow it this weekend if it\'s available!',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'req-2',
    bookId: '7',
    requesterId: 'maya-user',
    requesterName: 'Maya',
    requesterAvatar: '/avatar_maya.jpg',
    ownerId: 'current-user',
    message: 'Hey! Can I borrow The Whispers of Avalon? I\'ve been wanting to read this for a while.',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000),
  },
];

const mockOutgoingRequests: BorrowRequest[] = [
  {
    id: 'req-out-1',
    bookId: '1',
    requesterId: 'current-user',
    requesterName: 'Alex Reader',
    requesterAvatar: '/avatar_jonas.jpg',
    ownerId: 'priya-user',
    message: 'Hi Priya! Would love to borrow The Midnight Library. Are you free this weekend?',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'req-out-2',
    bookId: '6',
    requesterId: 'current-user',
    requesterName: 'Alex Reader',
    requesterAvatar: '/avatar_jonas.jpg',
    ownerId: 'jonas-user',
    message: 'Interested in borrowing The Maritime Chronicles. Let me know!',
    status: 'pending',
    createdAt: new Date(Date.now() - 43200000),
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'request_received',
    title: 'New borrow request',
    message: 'Priya wants to borrow The Silent Sanctuary',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    relatedId: 'req-1',
    actionUrl: '/requests',
  },
  {
    id: 'notif-2',
    type: 'request_approved',
    title: 'Request approved!',
    message: 'Priya approved your request for The Midnight Library',
    timestamp: new Date(Date.now() - 86400000),
    read: false,
    relatedId: 'req-out-1',
    actionUrl: '/requests',
  },
  {
    id: 'notif-3',
    type: 'return_reminder',
    title: 'Return reminder',
    message: 'The Whispering Leaves is due for return in 2 days',
    timestamp: new Date(Date.now() - 172800000),
    read: true,
    relatedId: 'b1',
  },
  {
    id: 'notif-4',
    type: 'message',
    title: 'New message from Priya',
    message: 'Hi! I\'d love to borrow The Midnight Library...',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    relatedId: '1',
    actionUrl: '/profile',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [listedBooks, setListedBooks] = useState<BookListing[]>(mockListedBooks);
  const [borrowedBooks, setBorrowedBooks] = useState<BookListing[]>(mockBorrowedBooks);
  const [incomingRequests, setIncomingRequests] = useState<BorrowRequest[]>(mockIncomingRequests);
  const [outgoingRequests, setOutgoingRequests] = useState<BorrowRequest[]>(mockOutgoingRequests);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password) {
      setUser(mockUser);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (name && email && password) {
      setUser({ ...mockUser, name, email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  }, [user]);

  const addBookListing = useCallback((bookId: string, condition: string) => {
    const newListing: BookListing = {
      id: Date.now().toString(),
      bookId,
      ownerId: user?.id || 'current-user',
      status: 'available',
      condition,
      distance: '0.5 mi',
    };
    setListedBooks(prev => [...prev, newListing]);
  }, [user]);

  const requestBook = useCallback((bookId: string, ownerId: string, message?: string) => {
    // Add to borrowed books
    const newBorrow: BookListing = {
      id: Date.now().toString(),
      bookId,
      ownerId,
      status: 'reserved',
      condition: 'Like new',
      distance: '0.8 mi',
    };
    setBorrowedBooks(prev => [...prev, newBorrow]);
    
    // Send message if provided
    if (message) {
      sendMessage(ownerId, message);
    }
  }, [sendMessage]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [user]);

  const approveRequest = useCallback((requestId: string) => {
    setIncomingRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'approved' as const } : req)
    );
    
    // Add notification
    const request = incomingRequests.find(r => r.id === requestId);
    if (request) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: 'request_approved',
        title: 'Request approved',
        message: `You approved ${request.requesterName}'s request`,
        timestamp: new Date(),
        read: false,
        relatedId: requestId,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [incomingRequests]);

  const rejectRequest = useCallback((requestId: string) => {
    setIncomingRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'rejected' as const } : req)
    );
    
    // Add notification
    const request = incomingRequests.find(r => r.id === requestId);
    if (request) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        type: 'request_rejected',
        title: 'Request rejected',
        message: `You rejected ${request.requesterName}'s request`,
        timestamp: new Date(),
        read: false,
        relatedId: requestId,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [incomingRequests]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif)
    );
  }, []);

  const markBookReturned = useCallback((bookId: string) => {
    setBorrowedBooks(prev => prev.filter(book => book.bookId !== bookId));
    
    // Add notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: 'return_reminder',
      title: 'Book returned',
      message: 'Book has been marked as returned',
      timestamp: new Date(),
      read: false,
      relatedId: bookId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        messages,
        sendMessage,
        listedBooks,
        borrowedBooks,
        addBookListing,
        requestBook,
        updateProfile,
        incomingRequests,
        outgoingRequests,
        approveRequest,
        rejectRequest,
        notifications,
        markNotificationRead,
        markBookReturned,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

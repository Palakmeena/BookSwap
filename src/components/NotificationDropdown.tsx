import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth, type Notification } from '@/contexts/AuthContext';

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    markNotificationRead(notification.id);
    setIsOpen(false);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'request_received':
      case 'request_approved':
      case 'request_rejected':
        return <BookOpen className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'return_reminder':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'request_approved':
        return 'bg-green-100 text-green-700';
      case 'request_rejected':
        return 'bg-red-100 text-red-700';
      case 'return_reminder':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-cranberry/10 text-cranberry';
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-espresso/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-espresso" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-cranberry text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem] bg-paper rounded-xl shadow-paper-lg border border-espresso/10 z-50 max-h-[70vh] sm:max-h-[80vh] flex flex-col">
          <div className="p-4 border-b border-espresso/10">
            <h3 className="font-display font-semibold text-espresso">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-taupe mt-1">{unreadCount} unread</p>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-taupe/40 mx-auto mb-3" />
                <p className="text-sm text-taupe">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-espresso/5">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-espresso/5 transition-colors ${
                      !notification.read ? 'bg-cranberry/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-espresso' : 'text-taupe'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-cranberry rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-xs text-taupe line-clamp-2">{notification.message}</p>
                        
                        <p className="text-xs text-taupe/60 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-espresso/10">
              <button
                onClick={() => {
                  notifications.forEach(n => !n.read && markNotificationRead(n.id));
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-cranberry hover:underline font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

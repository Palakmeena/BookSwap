import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Upload, Calendar, MapPin, Clock, Info, Check } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '@/contexts/AuthContext';

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  condition: 'new' | 'good' | 'worn';
  available: boolean;
  pickupDate: string;
  pickupLocation: string;
  borrowDuration: string;
  notes: string;
  coverImage: File | null;
  coverPreview: string;
}

const GENRES = [
  'Fiction',
  'Mystery',
  'Sci-Fi',
  'Romance',
  'Biography',
  'Fantasy',
  'Literary Fiction',
  'Historical Fiction',
  'Self-Help',
  'Classic',
  'Other'
];

export default function ListBook() {
  const navigate = useNavigate();
  const { user, isAuthenticated, addBookListing } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    condition: 'good',
    available: true,
    pickupDate: '',
    pickupLocation: '',
    borrowDuration: '2 weeks',
    notes: '',
    coverImage: null,
    coverPreview: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file,
        coverPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would upload the image and create the book listing
    // For now, we'll use a mock book ID
    addBookListing('new-book-' + Date.now(), formData.condition);
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  if (!user) return null;

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
            <span className="font-display font-semibold text-espresso">List a Book</span>
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-espresso mb-2">
              Share your book
            </h1>
            <p className="text-taupe">
              List a book from your collection and connect with readers nearby
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Book Cover Upload */}
            <div>
              <label className="block text-sm font-medium text-espresso mb-3">
                Book Cover
              </label>
              <div className="flex items-start gap-4">
                {formData.coverPreview ? (
                  <div className="w-32 h-48 rounded-xl overflow-hidden shadow-paper">
                    <img
                      src={formData.coverPreview}
                      alt="Book cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-48 rounded-xl border-2 border-dashed border-espresso/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-taupe" />
                  </div>
                )}
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Upload Cover
                  </button>
                  <p className="text-xs text-taupe mt-2">
                    Recommended: 600x900px, JPG or PNG
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-espresso mb-2">
                  Book Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter book title"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-espresso mb-2">
                  Author *
                </label>
                <input
                  id="author"
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Enter author name"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-espresso mb-2">
                Genre *
              </label>
              <select
                id="genre"
                required
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
              >
                <option value="">Select a genre</option>
                {GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Condition & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-espresso mb-2">
                  Condition *
                </label>
                <div className="flex gap-2">
                  {(['new', 'good', 'worn'] as const).map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, condition }))}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.condition === condition
                          ? 'border-cranberry bg-cranberry/5 text-cranberry'
                          : 'border-espresso/10 text-espresso hover:border-cranberry/30'
                      }`}
                    >
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-espresso mb-2">
                  Availability
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, available: !prev.available }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.available
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-espresso/10 text-espresso hover:border-cranberry/30'
                  }`}
                >
                  {formData.available ? (
                    <>
                      <Check className="w-4 h-4" />
                      Available
                    </>
                  ) : (
                    'Not Available'
                  )}
                </button>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cranberry" />
                  Pickup Date
                </label>
                <input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                />
              </div>

              <div>
                <label htmlFor="borrowDuration" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cranberry" />
                  Borrow Duration
                </label>
                <select
                  id="borrowDuration"
                  value={formData.borrowDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, borrowDuration: e.target.value }))}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                >
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="3 weeks">3 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cranberry" />
                Pickup Location
              </label>
              <input
                id="pickupLocation"
                type="text"
                value={formData.pickupLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                placeholder="e.g., Coffee shop on 5th Ave, or my address"
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-espresso mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-cranberry" />
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions or information about the book..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3.5 border-2 border-espresso/10 rounded-xl text-espresso font-medium hover:border-cranberry/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary py-3.5"
              >
                List Book
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" />
          
          <div className="relative bg-paper rounded-2xl shadow-paper-lg p-8 text-center max-w-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-espresso mb-2">
              Book Listed!
            </h3>
            <p className="text-taupe">
              Your book is now available for borrowing. Redirecting to your profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

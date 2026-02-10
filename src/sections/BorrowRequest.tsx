import { useEffect, useRef, useState } from 'react';
import { Send, Calendar, MessageSquare, MapPin, Truck, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BorrowRequest() {
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [pickupMethod, setPickupMethod] = useState<'meetup' | 'mail'>('meetup');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Sheet entrance - subtle
      scrollTl.fromTo(
        sheetRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Text entrance - subtle
      scrollTl.fromTo(
        textRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Form entrance - subtle
      scrollTl.fromTo(
        formRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      );

      // Button entrance
      scrollTl.fromTo(
        buttonRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'back.out(1.2)' },
        0.2
      );

      // Exit animations - subtle
      scrollTl.to(
        sheetRef.current,
        { y: 40, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        textRef.current,
        { x: -25, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        formRef.current,
        { x: -30, opacity: 0.25, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-paper overflow-hidden z-[60] py-8 sm:py-0 sm:h-screen"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Main sheet */}
      <div
        ref={sheetRef}
        className="relative sm:absolute left-0 sm:left-[4vw] lg:left-[6vw] top-auto sm:top-[12vh] mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-[92vw] lg:w-[88vw] min-h-fit sm:h-[76vh] paper-sheet rounded-2xl overflow-visible sm:overflow-hidden"
      >
        <div className="relative w-full h-full flex flex-col lg:flex-row">
          {/* Left text content */}
          <div
            ref={textRef}
            className="flex-none sm:flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-5xl font-semibold text-espresso mb-3 sm:mb-4">
              Send a <span className="text-cranberry">request</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-taupe max-w-md mb-4 sm:mb-6">
              Choose a pickup option, suggest a date, and say hello. Most
              requests are accepted within a few hours.
            </p>

            <div className="flex items-center gap-3 text-sm text-taupe">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cranberry/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-cranberry" />
              </div>
              <span>You can cancel before pickup</span>
            </div>
          </div>

          {/* Right form */}
          <div
            ref={formRef}
            className="flex-none sm:flex-1 bg-paper px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12 flex flex-col justify-center"
          >
            <div className="max-w-md mx-auto w-full">
              {/* Pickup method */}
              <div className="mb-4 sm:mb-6">
                <label className="mono-label text-taupe mb-2 sm:mb-3 block text-xs sm:text-sm">
                  Pickup method
                </label>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setPickupMethod('meetup')}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                      pickupMethod === 'meetup'
                        ? 'border-cranberry bg-cranberry/5 text-cranberry'
                        : 'border-espresso/10 text-espresso hover:border-espresso/30'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Meetup
                  </button>
                  <button
                    onClick={() => setPickupMethod('mail')}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                      pickupMethod === 'mail'
                        ? 'border-cranberry bg-cranberry/5 text-cranberry'
                        : 'border-espresso/10 text-espresso hover:border-espresso/30'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Mail
                  </button>
                </div>
              </div>

              {/* Date picker */}
              <div className="mb-4 sm:mb-6">
                <label className="mono-label text-taupe mb-2 sm:mb-3 block text-xs sm:text-sm">
                  Preferred date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-taupe" />
                  <input
                    type="date"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-white rounded-xl border border-espresso/10 text-espresso text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-4 sm:mb-6">
                <label className="mono-label text-taupe mb-2 sm:mb-3 block text-xs sm:text-sm">
                  Message (optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-taupe" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say hello to the book owner..."
                    rows={3}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-white rounded-xl border border-espresso/10 text-espresso placeholder:text-taupe/60 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cranberry/30 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                ref={buttonRef}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send request
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

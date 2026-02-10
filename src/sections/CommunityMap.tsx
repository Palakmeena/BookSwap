import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nearbyUsers } from '@/data/books';

gsap.registerPlugin(ScrollTrigger);

export default function CommunityMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tooltipsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Map entrance
      scrollTl.fromTo(
        mapRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Title entrance
      scrollTl.fromTo(
        titleRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      );

      // Pins entrance with stagger
      pinsRef.current.forEach((pin, i) => {
        if (!pin) return;
        scrollTl.fromTo(
          pin,
          { y: -40, scale: 0.7, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'back.out(1.2)' },
          0.12 + i * 0.05
        );
      });

      // Tooltips entrance
      tooltipsRef.current.forEach((tooltip, i) => {
        if (!tooltip) return;
        scrollTl.fromTo(
          tooltip,
          { y: 6, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.2 + i * 0.05
        );
      });

      // Exit animations
      scrollTl.to(
        mapRef.current,
        { y: -50, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        titleRef.current,
        { opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      pinsRef.current.forEach((pin) => {
        if (!pin) return;
        scrollTl.to(
          pin,
          { y: -30, opacity: 0.25, ease: 'power2.in' },
          0.72
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pinPositions = [
    { left: '22%', top: '45%' },
    { left: '50%', top: '55%' },
    { left: '78%', top: '40%' },
  ];

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative w-full h-screen bg-paper overflow-hidden z-50"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Map sheet */}
      <div
        ref={mapRef}
        className="absolute left-[4vw] lg:left-[6vw] top-[12vh] w-[92vw] lg:w-[88vw] h-[76vh] paper-sheet rounded-2xl overflow-hidden"
      >
        {/* Map background */}
        <div className="absolute inset-0">
          <img
            src="/map_background.jpg"
            alt="City map"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-paper/30 via-transparent to-paper/50" />
        </div>

        {/* Title overlay */}
        <div
          ref={titleRef}
          className="absolute top-6 lg:top-10 left-6 lg:left-10 z-10"
        >
          <h2 className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-2">
            Readers near you
          </h2>
          <p className="text-base text-taupe max-w-md">
            Real people. Real neighborhoods. No shipping required.
          </p>
        </div>

        {/* Pins */}
        {nearbyUsers.map((user, index) => (
          <div
            key={user.id}
            ref={(el) => { pinsRef.current[index] = el; }}
            className="absolute z-20"
            style={{
              left: pinPositions[index].left,
              top: pinPositions[index].top,
            }}
          >
            {/* Pin marker */}
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-4 border-white shadow-lg overflow-hidden bg-cranberry flex items-center justify-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-cranberry rotate-45" />
            </div>

            {/* Tooltip */}
            <div
              ref={(el) => { tooltipsRef.current[index] = el; }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-lg px-3 py-2 shadow-paper whitespace-nowrap"
            >
              <p className="font-medium text-espresso text-sm">{user.name}</p>
              <p className="text-xs text-taupe flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cranberry" />
                {user.distance}
              </p>
            </div>
          </div>
        ))}

        {/* Stats overlay */}
        <div className="absolute bottom-6 lg:bottom-10 left-6 lg:left-10 right-6 lg:right-auto flex flex-wrap gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-paper">
            <p className="text-2xl lg:text-3xl font-display font-semibold text-cranberry">
              247
            </p>
            <p className="text-xs text-taupe">Books nearby</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-paper">
            <p className="text-2xl lg:text-3xl font-display font-semibold text-cranberry">
              42
            </p>
            <p className="text-xs text-taupe">Active readers</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-paper">
            <p className="text-2xl lg:text-3xl font-display font-semibold text-cranberry">
              1.2mi
            </p>
            <p className="text-xs text-taupe">Average distance</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { Shield, Sliders, Bell, LifeBuoy, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const trustFeatures = [
  {
    icon: Shield,
    title: 'Public profiles & ratings',
    description: 'See reviews from other borrowers before requesting.',
  },
  {
    icon: Sliders,
    title: 'Pickup preferences you control',
    description: 'Choose meetup spots, times, or mail options that work for you.',
  },
  {
    icon: Bell,
    title: 'Due reminders & gentle nudges',
    description: 'Never forget a return date with friendly notifications.',
  },
  {
    icon: LifeBuoy,
    title: 'Report & support when needed',
    description: 'Our team is here to help with any issues.',
  },
];

export default function SafetyTrust() {
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Sheet entrance
      scrollTl.fromTo(
        sheetRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Title entrance
      scrollTl.fromTo(
        titleRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Items entrance with stagger
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        scrollTl.fromTo(
          item,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.14 + i * 0.04
        );
      });

      // Exit animations
      scrollTl.to(
        sheetRef.current,
        { y: -80, opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        titleRef.current,
        { opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      itemsRef.current.forEach((item) => {
        if (!item) return;
        scrollTl.to(
          item,
          { opacity: 0.2, ease: 'power2.in' },
          0.72
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-paper overflow-hidden z-[90]"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Main sheet */}
      <div
        ref={sheetRef}
        className="absolute left-[4vw] lg:left-[6vw] top-[14vh] w-[92vw] lg:w-[88vw] h-[72vh] paper-sheet rounded-2xl overflow-hidden"
      >
        <div className="relative w-full h-full flex flex-col lg:flex-row p-6 lg:p-12 gap-8 lg:gap-12">
          {/* Left title */}
          <div
            ref={titleRef}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-4">
              Built for <span className="text-cranberry">trust</span>
            </h2>
            <p className="text-base lg:text-lg text-taupe max-w-md">
              We've designed every feature with your safety and peace of mind
              at the center.
            </p>
          </div>

          {/* Right checklist */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-4 lg:space-y-5">
              {trustFeatures.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  className="flex items-start gap-4 p-4 bg-paper rounded-xl border border-espresso/5 hover:border-cranberry/20 transition-colors"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cranberry/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-cranberry" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-espresso mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-taupe">{feature.description}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-6 h-6 rounded-full bg-cranberry flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

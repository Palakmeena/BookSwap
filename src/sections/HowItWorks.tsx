import { useEffect, useRef } from 'react';
import { BookPlus, Search, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'List your books',
    description: 'Add the titles you\'re happy to lend. Set your pickup preferences.',
    image: '/step1_owner.jpg',
    icon: BookPlus,
    stamp: 'Share',
  },
  {
    number: '02',
    title: 'Discover nearby',
    description: 'Browse by genre, distance, and availability. Read reviews.',
    image: '/step2_browsing.jpg',
    icon: Search,
    stamp: 'Find',
  },
  {
    number: '03',
    title: 'Borrow & return',
    description: 'Send a request, meet up (or mail), enjoy, and return.',
    image: '/step3_handoff.jpg',
    icon: RotateCcw,
    stamp: 'Enjoy',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stampsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Title entrance
      scrollTl.fromTo(
        titleRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Cards entrance with stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const rotations = [-4, 0, 4];
        scrollTl.fromTo(
          card,
          { y: 50, rotation: rotations[i], opacity: 0 },
          { y: 0, rotation: 0, opacity: 1, ease: 'none' },
          0.05 + i * 0.04
        );
      });

      // Stamps entrance
      stampsRef.current.forEach((stamp, i) => {
        if (!stamp) return;
        scrollTl.fromTo(
          stamp,
          { scale: 0.7, rotation: -15, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, ease: 'back.out(1.2)' },
          0.18 + i * 0.03
        );
      });

      // Exit animations
      scrollTl.to(
        titleRef.current,
        { x: -30, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      cardsRef.current.forEach((card) => {
        if (!card) return;
        scrollTl.to(
          card,
          { y: 40, opacity: 0.25, ease: 'power2.in' },
          0.7
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full h-screen bg-paper overflow-hidden z-20"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      <div className="relative w-full h-full flex flex-col px-6 lg:px-12 pt-20 lg:pt-24">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-8 lg:mb-12"
        >
          How BookSwap <span className="text-cranberry">works</span>
        </h2>

        {/* Cards grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pb-8 lg:pb-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="paper-sheet rounded-2xl p-5 lg:p-6 flex flex-col relative overflow-hidden"
            >
              {/* Step number */}
              <span className="mono-label text-taupe mb-4">
                Step {step.number}
              </span>

              {/* Image */}
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <step.icon className="w-5 h-5 text-cranberry" />
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-espresso">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm lg:text-base text-taupe leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Stamp */}
              <div
                ref={(el) => { stampsRef.current[index] = el; }}
                className="absolute bottom-4 right-4 w-14 h-14 stamp text-xs"
              >
                {step.stamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

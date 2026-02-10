import { useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '@/data/books';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stampsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation with diagonal arrangement
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const yOffset = i === 1 ? 40 : 20;
        gsap.fromTo(
          card,
          { y: yOffset, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Stamps animation
      stampsRef.current.forEach((stamp, i) => {
        if (!stamp) return;
        gsap.fromTo(
          stamp,
          { scale: 0.8, rotation: -8, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.35,
            delay: 0.35 + i * 0.08,
            ease: 'back.out(1.3)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative w-full bg-paper py-16 lg:py-24 z-[80]"
    >
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      <div className="relative px-6 lg:px-12">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display text-3xl lg:text-5xl font-semibold text-espresso mb-12 lg:mb-16"
        >
          Reader <span className="text-cranberry">stories</span>
        </h2>

        {/* Cards grid - diagonal arrangement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`paper-sheet rounded-2xl p-6 lg:p-8 relative ${
                index === 1 ? 'md:mt-12' : ''
              }`}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-cranberry/30 mb-4" />

              {/* Quote text */}
              <p className="text-lg lg:text-xl text-espresso leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-espresso">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-taupe">BookSwap member</p>
                </div>
              </div>

              {/* Stamp */}
              <div
                ref={(el) => { stampsRef.current[index] = el; }}
                className="absolute bottom-6 right-6 w-12 h-12 stamp text-[10px]"
              >
                Love
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

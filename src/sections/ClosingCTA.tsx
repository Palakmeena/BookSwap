import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

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

      // Background wipe entrance
      scrollTl.fromTo(
        bgRef.current,
        { y: '100%' },
        { y: '0%', ease: 'none' },
        0
      );

      // Stamp entrance
      scrollTl.fromTo(
        stampRef.current,
        { scale: 0.6, rotation: -25, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, ease: 'back.out(1.2)' },
        0.1
      );

      // Title entrance
      scrollTl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.16
      );

      // Form entrance
      scrollTl.fromTo(
        formRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      // Exit animations
      scrollTl.to(
        stampRef.current,
        { scale: 0.85, opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        titleRef.current,
        { opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        formRef.current,
        { y: 60, opacity: 0.3, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for joining! We\'ll be in touch soon.');
    setEmail('');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden z-[100]"
    >
      {/* Espresso background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-espresso"
        style={{ transform: 'translateY(100%)' }}
      />

      {/* Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Large stamp circle */}
        <div
          ref={stampRef}
          className="absolute w-[80vw] h-[80vw] lg:w-[52vw] lg:h-[52vw] rounded-full bg-cranberry/90 flex items-center justify-center"
          style={{ maxWidth: '600px', maxHeight: '600px' }}
        >
          {/* Inner texture */}
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/30" />
          <div className="absolute inset-4 rounded-full border border-white/20" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center px-6 max-w-lg">
          <h2
            ref={titleRef}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-paper mb-6"
          >
            Start your{' '}
            <span className="text-paper/90">next chapter</span>
          </h2>

          {/* Email form */}
          <div ref={formRef}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 mb-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 px-5 py-3.5 bg-paper rounded-xl text-espresso placeholder:text-taupe focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-espresso text-paper rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-espresso/90 transition-colors"
              >
                Join
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-sm text-paper/60 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Free to use. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

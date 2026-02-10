import { BookOpen, Instagram, Twitter, Facebook, Github } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  support: [
    { label: 'Guidelines', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'Safety', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full bg-espresso py-12 lg:py-16 z-[110]">
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-cranberry" />
              <span className="font-display text-xl font-semibold text-paper">
                BookSwap
              </span>
            </div>
            <p className="text-sm text-paper/60 max-w-xs mb-6">
              Share stories, borrow joy. A community library built by the people
              around you.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center text-paper/60 hover:bg-cranberry hover:text-paper transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center text-paper/60 hover:bg-cranberry hover:text-paper transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center text-paper/60 hover:bg-cranberry hover:text-paper transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center text-paper/60 hover:bg-cranberry hover:text-paper transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-medium text-paper mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-paper transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-medium text-paper mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-paper transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-medium text-paper mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-paper transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-paper/40">
            © {new Date().getFullYear()} BookSwap. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-paper/5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-paper/60">247 books available now</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

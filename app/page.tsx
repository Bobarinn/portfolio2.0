'use client';

import { personal, work, projects, now, education, contact } from '@/data';
import { useEffect, useState } from 'react';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [heroExpanded, setHeroExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;

      // Debounce for smoother performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isMobile) {
          // Vertical scroll on mobile - detect which section is in view
          // Only count elements with snap-item class (actual sections)
          const sections = Array.from(target.querySelectorAll('.snap-item')) as HTMLElement[];
          const viewportHeight = window.innerHeight;

          // Find which section is most visible
          let maxVisibility = 0;
          let activeIndex = 0;

          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            // Calculate how much of the section is visible in viewport
            const visibleTop = Math.max(sectionTop, 0);
            const visibleBottom = Math.min(sectionBottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityRatio = visibleHeight / viewportHeight;

            if (visibilityRatio > maxVisibility) {
              maxVisibility = visibilityRatio;
              activeIndex = index;
            }
          });

          setActiveCard(activeIndex);

          // Collapse hero on mobile when scrolled past first section
          if (activeIndex > 0) {
            setHeroExpanded(false);
          } else {
            setHeroExpanded(true);
          }
        } else {
          // Horizontal scroll on desktop
          const scrollLeft = target.scrollLeft;
          const cardWidth = target.offsetWidth;
          const newActiveCard = Math.round(scrollLeft / cardWidth);
          setActiveCard(newActiveCard);
        }

        // Hide scroll hint after first interaction
        if ((isMobile ? target.scrollTop : target.scrollLeft) > 50) {
          setShowScrollHint(false);
        }
      }, 50);
    };

    const scrollContainer = document.getElementById('scroll-container');
    scrollContainer?.addEventListener('scroll', handleScroll);

    // Keyboard navigation (desktop only)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMobile) return;

      if (e.key === 'ArrowRight' && activeCard < 3) {
        const container = document.getElementById('scroll-container');
        container?.scrollTo({
          left: (activeCard + 1) * container.offsetWidth,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowLeft' && activeCard > 0) {
        const container = document.getElementById('scroll-container');
        container?.scrollTo({
          left: (activeCard - 1) * container.offsetWidth,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-hide hint after 3 seconds
    const timer = setTimeout(() => setShowScrollHint(false), 3000);

    return () => {
      clearTimeout(scrollTimeout);
      scrollContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [activeCard, isMobile]);

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Hero (Desktop) / Top Header (Mobile) */}
      <section className={`
        ${isMobile ? 'w-full border-b' : 'w-2/5 md:w-1/2 lg:w-2/5 border-r'}
        border-[var(--border)] flex flex-col justify-between
        ${isMobile ? (heroExpanded ? 'p-6' : 'px-6 py-3') : 'p-8 lg:p-12'}
        ${isMobile ? (heroExpanded ? 'h-auto' : 'h-auto') : 'overflow-y-auto'}
        transition-all duration-300 ease-in-out
      `}>
        <div>
          <div className={`${isMobile ? (heroExpanded ? 'mb-6' : 'mb-0') : 'mb-12'} transition-all duration-300`}>
            <div
              className={`flex items-center justify-between ${isMobile && !heroExpanded ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (isMobile && !heroExpanded) {
                  // Scroll back to top to expand hero
                  const container = document.getElementById('scroll-container');
                  if (container) {
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
            >
              <h1 className={`font-serif ${isMobile ? (heroExpanded ? 'text-3xl' : 'text-xl') : 'text-4xl lg:text-6xl'} ${isMobile && !heroExpanded ? 'mb-0' : 'mb-3'} text-[var(--accent)] transition-all duration-300`}>
                {personal.name}
              </h1>
              {isMobile && !heroExpanded && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--accent)] opacity-60"
                >
                  <path d="M10 13L6 9M10 13L14 9M10 13V7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>

          {(!isMobile || heroExpanded) && (
            <p className="text-xs md:text-sm tracking-widest uppercase text-[var(--foreground)] opacity-60 mb-6 transition-opacity duration-300">
              {personal.title}
            </p>
          )}

          {(!isMobile || heroExpanded) && (
            <div className={`space-y-4 ${isMobile ? 'mb-6' : 'mb-12'} transition-all duration-300`}>
              {personal.summary.map((line, i) => (
                <p
                  key={i}
                  className={`${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed text-[var(--foreground)] opacity-80 animate-fade-in stagger-${i + 2}`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {!isMobile && (
            <div className="space-y-3 animate-fade-in stagger-4">
              <a
                href={`mailto:${personal.email}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.email}
              </a>
              <a
                href={`mailto:${personal.workEmail}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.workEmail}
              </a>
              <a
                href={`tel:${personal.phone}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.phone}
              </a>
              <a
                href={`https://${personal.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.linkedin}
              </a>
              <a
                href="https://github.com/Bobarinn"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                github.com/Bobarinn
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors pt-2 border-t border-[var(--border)]"
              >
                View Resume ↗
              </a>
              <a
                href="/transcript.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                View Current Transcript ↗
              </a>
            </div>
          )}
        </div>

        {/* Nav Indicator - Desktop only (moves to bottom on mobile) */}
        {!isMobile && (
          <div className="flex gap-2 animate-fade-in stagger-5 mt-auto">
            {['Work', 'Projects', 'Now', 'Contact'].map((label, i) => (
              <button
                key={label}
                onClick={() => {
                  const container = document.getElementById('scroll-container');
                  if (container) {
                    container.scrollTo({
                      left: i * container.offsetWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`text-xs px-3 py-1 border transition-all ${
                  activeCard === i
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--foreground)] opacity-40 hover:opacity-70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Right Side - Horizontal Scroll Cards (Desktop) / Vertical Scroll (Mobile) */}
      <section
        id="scroll-container"
        className={`
          ${isMobile ? 'w-full h-full flex-col overflow-y-auto' : 'w-3/5 md:w-1/2 lg:w-3/5 flex overflow-x-auto overflow-y-hidden'}
          horizontal-scroll snap-container relative
          ${!isMobile && activeCard < 3 ? 'scroll-gradient' : ''}
        `}
      >
        {/* Scroll Hint */}
        {showScrollHint && !isMobile && (
          <div className="absolute top-8 right-12 z-10 flex items-center gap-2 text-[var(--accent)] pointer-events-none transition-opacity duration-1000 opacity-100">
            <span className="text-xs tracking-wider font-medium">SCROLL →</span>
          </div>
        )}

        {/* Work Card */}
        <div className={`${isMobile ? 'min-h-screen w-full' : 'min-w-full h-full'} ${isMobile ? 'p-6' : 'p-8 lg:p-12'} overflow-y-auto snap-item`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-serif ${isMobile ? 'mb-6' : 'mb-8'} text-[var(--accent)]`}>Work</h2>
          <div className="space-y-8">
            {work.map((job, i) => (
              <div key={i} className="pb-8 border-b border-[var(--border)] last:border-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{job.company}</h3>
                      {job.remote && (
                        <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)] text-[var(--accent)] opacity-60 tracking-wider whitespace-nowrap">
                          REMOTE
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-60">{job.location}</p>
                  </div>
                  <span className="text-xs opacity-60 whitespace-nowrap">{job.period}</span>
                </div>
                <p className="text-sm mb-4 text-[var(--accent)] opacity-80">{job.role}</p>
                <ul className="space-y-2">
                  {job.highlights.map((highlight, j) => (
                    <li key={j} className="text-xs leading-relaxed opacity-80 pl-4 relative before:content-['–'] before:absolute before:left-0">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Card */}
        <div className={`${isMobile ? 'min-h-screen w-full' : 'min-w-full h-full'} ${isMobile ? 'p-6' : 'p-8 lg:p-12'} overflow-y-auto snap-item`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-serif ${isMobile ? 'mb-6' : 'mb-8'} text-[var(--accent)]`}>Projects</h2>
          <div className="space-y-8">
            {projects.map((project, i) => (
              <div key={i} className="pb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isMobile ? 'text-base' : 'text-lg'} font-medium hover:text-[var(--accent)] transition-colors`}
                    >
                      {project.name} ↗
                    </a>
                  ) : (
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{project.name}</h3>
                  )}
                  {project.period && <span className="text-xs opacity-60 whitespace-nowrap">{project.period}</span>}
                </div>
                <p className="text-sm mb-4 opacity-80">{project.description}</p>
                <ul className="space-y-2 mb-6">
                  {project.details.map((detail, j) => (
                    <li key={j} className="text-xs leading-relaxed opacity-80 pl-4 relative before:content-['–'] before:absolute before:left-0">
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-1 border border-[var(--border)] opacity-60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Education */}
            <div className="pt-8 border-t border-[var(--border)]">
              <h3 className="text-lg font-medium mb-6">Education</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                      <div>
                        <h4 className="text-sm font-medium">{edu.school}</h4>
                        <p className="text-xs opacity-60">{edu.location}</p>
                      </div>
                      <span className="text-xs opacity-60 whitespace-nowrap">{edu.graduation}</span>
                    </div>
                    <p className="text-xs opacity-80">{edu.degree}</p>
                    <p className="text-xs opacity-60 mt-1">GPA: {edu.gpa}</p>
                    {edu.school === "Baylor University" && (
                      <a
                        href="/transcript.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs hover:text-[var(--accent)] transition-colors mt-2 border-t border-[var(--border)] pt-2"
                      >
                        View Current Transcript ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Now Card */}
        <div className={`${isMobile ? 'min-h-screen w-full' : 'min-w-full h-full'} ${isMobile ? 'p-6' : 'p-8 lg:p-12'} overflow-y-auto snap-item`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-serif ${isMobile ? 'mb-6' : 'mb-8'} text-[var(--accent)]`}>Now</h2>
          <div className="space-y-8">
            <div>
              <p className="text-sm mb-6 text-[var(--accent)] opacity-80">{now.status}</p>
              <div className="space-y-4">
                {now.focus.map((item, i) => (
                  <p key={i} className="text-xs leading-relaxed opacity-80 pl-4 relative before:content-['–'] before:absolute before:left-0">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--border)]">
              <h3 className="text-lg font-medium mb-4">Interests</h3>
              <div className="space-y-3">
                {now.interests.map((interest, i) => (
                  <p key={i} className="text-xs leading-relaxed opacity-80 pl-4 relative before:content-['–'] before:absolute before:left-0">
                    {interest}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className={`${isMobile ? 'min-h-screen w-full' : 'min-w-full h-full'} ${isMobile ? 'p-6 pb-32' : 'p-8 lg:p-12'} overflow-y-auto snap-item`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-serif ${isMobile ? 'mb-6' : 'mb-8'} text-[var(--accent)]`}>Contact</h2>
          <div className="max-w-xl">
            <p className="text-sm leading-relaxed opacity-80 mb-8">
              {contact.description}
            </p>

            <div className="mb-8">
              <ContactForm />
            </div>

            <div className="pt-6 border-t border-[var(--border)] space-y-3">
              <p className="text-xs opacity-60 mb-3">Or reach out directly:</p>
              <a
                href={`mailto:${personal.email}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.email}
              </a>
              <a
                href={`mailto:${personal.workEmail}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.workEmail}
              </a>
              <a
                href={`tel:${personal.phone}`}
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.phone}
              </a>
              <a
                href={`https://${personal.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                {personal.linkedin}
              </a>
              <a
                href="https://github.com/Bobarinn"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                github.com/Bobarinn
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors pt-2 border-t border-[var(--border)]"
              >
                View Resume ↗
              </a>
              <a
                href="/transcript.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors"
              >
                View Current Transcript ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-[var(--border)] flex justify-around items-center py-3 z-50">
          {['Work', 'Projects', 'Now', 'Contact'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                const container = document.getElementById('scroll-container');
                if (container) {
                  // Query for actual section elements (snap-items only)
                  const sections = container.querySelectorAll('.snap-item');
                  const sectionElement = sections[i] as HTMLElement;
                  if (sectionElement) {
                    sectionElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                    // Manually set active card to prevent delay
                    setActiveCard(i);
                  }
                }
              }}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-all ${
                activeCard === i ? 'text-[var(--accent)]' : 'text-[var(--foreground)] opacity-40'
              }`}
            >
              <div className={`h-1 w-6 rounded-full transition-all ${activeCard === i ? 'bg-[var(--accent)]' : 'bg-transparent'}`} />
              <span className="text-[10px] tracking-wider uppercase">{label}</span>
            </button>
          ))}
        </nav>
      )}
    </main>
  );
}

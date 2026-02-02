'use client';

import { personal, work, projects, now, education, contact } from '@/data';
import { useEffect, useState } from 'react';
import ContactForm from '@/components/ContactForm';

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollLeft = target.scrollLeft;
      const cardWidth = target.offsetWidth;
      const newActiveCard = Math.round(scrollLeft / cardWidth);
      setActiveCard(newActiveCard);

      // Hide scroll hint after first interaction
      if (scrollLeft > 50) {
        setShowScrollHint(false);
      }
    };

    const scrollContainer = document.getElementById('scroll-container');
    scrollContainer?.addEventListener('scroll', handleScroll);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
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
      scrollContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [activeCard]);

  return (
    <main className="h-screen flex overflow-hidden">
      {/* Left Side - Hero */}
      <section className="w-2/5 border-r border-[var(--border)] flex flex-col justify-between p-12 overflow-y-auto">
        <div>
          <div className="mb-12">
            <h1 className="font-serif text-6xl mb-3 text-[var(--accent)] animate-fade-in">
              {personal.name}
            </h1>
            <p className="text-sm tracking-widest uppercase text-[var(--foreground)] opacity-60 animate-fade-in stagger-1">
              {personal.title}
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {personal.summary.map((line, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed text-[var(--foreground)] opacity-80 animate-fade-in stagger-${i + 2}`}
              >
                {line}
              </p>
            ))}
          </div>

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
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs hover:text-[var(--accent)] transition-colors pt-2 border-t border-[var(--border)]"
            >
              View Resume ↗
            </a>
          </div>
        </div>

        {/* Nav Indicator */}
        <div className="flex gap-2 animate-fade-in stagger-5">
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
      </section>

      {/* Right Side - Horizontal Scroll Cards */}
      <section
        id="scroll-container"
        className={`w-3/5 flex overflow-x-auto overflow-y-hidden horizontal-scroll snap-container relative ${
          activeCard < 3 ? 'scroll-gradient' : ''
        }`}
      >
        {/* Scroll Hint */}
        {showScrollHint && (
          <div className="absolute top-8 right-12 z-10 flex items-center gap-2 text-[var(--accent)] pointer-events-none transition-opacity duration-1000 opacity-100">
            <span className="text-xs tracking-wider font-medium">SCROLL →</span>
          </div>
        )}

        {/* Work Card */}
        <div className="min-w-full h-full p-12 overflow-y-auto snap-item">
          <h2 className="text-3xl font-serif mb-8 text-[var(--accent)]">Work</h2>
          <div className="space-y-8">
            {work.map((job, i) => (
              <div key={i} className="pb-8 border-b border-[var(--border)] last:border-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-medium">{job.company}</h3>
                      {job.remote && (
                        <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)] text-[var(--accent)] opacity-60 tracking-wider">
                          REMOTE
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-60">{job.location}</p>
                  </div>
                  <span className="text-xs opacity-60">{job.period}</span>
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
        <div className="min-w-full h-full p-12 overflow-y-auto snap-item">
          <h2 className="text-3xl font-serif mb-8 text-[var(--accent)]">Projects</h2>
          <div className="space-y-8">
            {projects.map((project, i) => (
              <div key={i} className="pb-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <span className="text-xs opacity-60">{project.period}</span>
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
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium">{edu.school}</h4>
                        <p className="text-xs opacity-60">{edu.location}</p>
                      </div>
                      <span className="text-xs opacity-60">{edu.graduation}</span>
                    </div>
                    <p className="text-xs opacity-80">{edu.degree}</p>
                    <p className="text-xs opacity-60 mt-1">GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Now Card */}
        <div className="min-w-full h-full p-12 overflow-y-auto snap-item">
          <h2 className="text-3xl font-serif mb-8 text-[var(--accent)]">Now</h2>
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
        <div className="min-w-full h-full p-12 overflow-y-auto snap-item">
          <h2 className="text-3xl font-serif mb-8 text-[var(--accent)]">Contact</h2>
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
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs hover:text-[var(--accent)] transition-colors pt-2 border-t border-[var(--border)]"
              >
                View Resume ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

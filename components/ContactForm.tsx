'use client';

import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [originalData, setOriginalData] = useState<{
    subject: string;
    message: string;
  } | null>(null);

  const [isPolishing, setIsPolishing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const canPolish = formData.message.trim().length >= 20;

  const handlePolish = async () => {
    if (!canPolish) return;

    setIsPolishing(true);
    setStatus({ type: null, message: '' });

    try {
      // Store original before polishing
      if (!originalData) {
        setOriginalData({
          subject: formData.subject,
          message: formData.message,
        });
      }

      const res = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: formData.message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to polish message');
      }

      setFormData((prev) => ({
        ...prev,
        subject: data.subject,
        message: data.message,
      }));
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to polish message',
      });
    } finally {
      setIsPolishing(false);
    }
  };

  const handleRevert = () => {
    if (originalData) {
      setFormData((prev) => ({
        ...prev,
        subject: originalData.subject,
        message: originalData.message,
      }));
      setOriginalData(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({
        type: 'success',
        message: 'Message sent! Check your email for confirmation.',
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setOriginalData(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full bg-transparent border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full bg-transparent border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="w-full bg-transparent border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>

      <div className="relative">
        <textarea
          placeholder="Message (min. 20 characters for AI polish)"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full bg-transparent border border-[var(--border)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          {originalData && (
            <button
              type="button"
              onClick={handleRevert}
              title="Revert to original"
              className="group"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all"
              >
                <path d="M2.5 9a6.5 6.5 0 0 1 11-4.5M15.5 9a6.5 6.5 0 0 1-11 4.5" />
                <path d="M13.5 3v2.5H11" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={handlePolish}
            disabled={!canPolish || isPolishing}
            title={canPolish ? 'Polish with AI' : 'Write at least 20 characters'}
            className="group disabled:cursor-not-allowed"
          >
            {isPolishing ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="animate-spin opacity-60"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="10 4"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className={
                  canPolish
                    ? 'opacity-50 group-hover:opacity-100 transition-all'
                    : 'opacity-20'
                }
              >
                {/* AI sparkle icon */}
                <g className={canPolish ? 'group-hover:text-[var(--accent)]' : ''}>
                  <path
                    d="M9 2L10 6.5L14.5 7.5L10 8.5L9 13L8 8.5L3.5 7.5L8 6.5L9 2Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="14" cy="3" r="1" fill="currentColor" />
                  <circle cx="4" cy="14" r="1" fill="currentColor" />
                  <circle cx="14.5" cy="13" r="0.75" fill="currentColor" />
                </g>
              </svg>
            )}
          </button>
        </div>
      </div>

      {status.message && (
        <div
          className={`text-xs px-4 py-2 border ${
            status.type === 'success'
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-red-500 text-red-500'
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="w-full px-6 py-3 bg-[var(--accent)] text-[var(--background)] text-sm font-medium hover:bg-[var(--accent-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

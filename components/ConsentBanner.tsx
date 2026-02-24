'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem('cookie-consent');
    if (!storedConsent) {
      // Show banner after a brief delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const updateConsent = (analyticsConsent: boolean, marketingConsent: boolean) => {
    // Update Google Consent Mode
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsConsent ? 'granted' : 'denied',
        ad_storage: marketingConsent ? 'granted' : 'denied',
        ad_user_data: marketingConsent ? 'granted' : 'denied',
        ad_personalization: marketingConsent ? 'granted' : 'denied',
      });
    }

    // Store consent in localStorage
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        analytics: analyticsConsent,
        marketing: marketingConsent,
        timestamp: new Date().toISOString(),
      })
    );

    setShowBanner(false);
  };

  const acceptAll = () => {
    updateConsent(true, true);
  };

  const rejectAll = () => {
    updateConsent(false, false);
  };

  const savePreferences = () => {
    updateConsent(consent.analytics, consent.marketing);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)] shadow-2xl">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Cookie Consent</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We use cookies to analyze site traffic and improve your experience.
                By clicking "Accept All", you consent to our use of cookies for analytics.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-xs border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                Customize
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-xs border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-xs bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-dim)] transition-colors font-medium"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Cookie Preferences</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--border)]">
                <div className="flex-1">
                  <h4 className="text-xs font-medium mb-1">Essential Cookies</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Required for the website to function. Always enabled.
                  </p>
                </div>
                <div className="text-xs text-[var(--accent)] font-medium pt-1">
                  Always On
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--border)]">
                <div className="flex-1">
                  <h4 className="text-xs font-medium mb-1">Analytics Cookies</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <label className="relative inline-block w-10 h-5 pt-1">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) =>
                      setConsent({ ...consent, analytics: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <span className="absolute cursor-pointer inset-0 bg-[var(--border)] peer-checked:bg-[var(--accent)] transition-colors rounded-full"></span>
                  <span className="absolute left-0.5 top-0.5 bg-[var(--background)] w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
                </label>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-xs font-medium mb-1">Marketing Cookies</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Used to track visitors for personalized advertising.
                  </p>
                </div>
                <label className="relative inline-block w-10 h-5 pt-1">
                  <input
                    type="checkbox"
                    checked={consent.marketing}
                    onChange={(e) =>
                      setConsent({ ...consent, marketing: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <span className="absolute cursor-pointer inset-0 bg-[var(--border)] peer-checked:bg-[var(--accent)] transition-colors rounded-full"></span>
                  <span className="absolute left-0.5 top-0.5 bg-[var(--background)] w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2 text-xs bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-dim)] transition-colors font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

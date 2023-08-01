// src/analyticsService.js

// Example implementation using Google Analytics

// Replace 'YOUR_GA_TRACKING_ID' with your Google Analytics Tracking ID
const GA_TRACKING_ID = 'YOUR_GA_TRACKING_ID';

// Function to load Google Analytics script
function loadGAScript() {
  if (typeof window !== 'undefined') {
    const gaScript = document.createElement('script');
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    gaScript.async = true;
    document.head.appendChild(gaScript);
  }
}

// Function to initialize Google Analytics
export function initAnalytics() {
  loadGAScript();

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);
  }
}

// Function to track a page view
export function trackPageView(url) {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
}

// Function to track an event
export function trackEvent(eventCategory, eventAction, eventLabel) {
  if (typeof window !== 'undefined') {
    window.gtag('event', eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    });
  }
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPage = async () => {
      try {
        // Track in Supabase (Internal Analytics)
        const { error } = await supabase.from('page_views').insert({
          path: location.pathname + location.search,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          session_id: sessionStorage.getItem('analytics_session_id') || (() => {
            const id = Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('analytics_session_id', id);
            return id;
          })()
        });

        if (error) console.error('Error tracking page view:', error);

        // Track in GA4 (already handled by the script tag in index.html for page loads, 
        // but for SPA navigation we can manually send events if needed)
        if (window.gtag) {
          window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
          });
        }
      } catch (e) {
        console.error('Failed to track page view', e);
      }
    };

    trackPage();
  }, [location]);
};

export default usePageTracking;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

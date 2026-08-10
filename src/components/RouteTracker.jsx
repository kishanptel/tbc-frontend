import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';

export default function RouteTracker({ setIsPageLoading }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      AOS.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, setIsPageLoading]);

  return null;
}

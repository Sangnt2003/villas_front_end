import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top of the page
    }, [location.pathname]); // Re-run every time the route changes

    return null; // No visual output needed
};

export default ScrollToTop;

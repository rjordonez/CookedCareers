import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  // Skip animation for dashboard routes
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
                           location.pathname.startsWith('/projects');

  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;

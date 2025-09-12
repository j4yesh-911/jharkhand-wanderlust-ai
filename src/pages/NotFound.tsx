import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-nature">
      <div className="text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 rounded-2xl backdrop-blur-lg"
        >
          <motion.h1 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-8xl font-bold text-white"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 text-3xl font-playfair font-bold"
          >
            Oops! Page Not Found
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 text-xl text-white/80"
          >
            The page you're looking for doesn't exist in our Jharkhand tourism guide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild className="btn-hero group">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Return to Home
                <ArrowLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="glass border-white/20 text-white hover:bg-white/20">
              <Link to="/explore">
                Explore Destinations
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
